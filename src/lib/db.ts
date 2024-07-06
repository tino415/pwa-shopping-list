import { openDB, type IDBPDatabase } from 'idb'

let db: IDBPDatabase<undefined> | null = null

type CreateShoppingListParams = {
  name: string
}

type CreateShoppingListItemParams = {
  name: string
  shoppingListId: number
}

export type ShoppingList = {
  id: number
  name: string
  createdAt: Date
}

export type ShoppingListItem = {
  id: number
  shoppingListId: number
  name: string
  ngram: null | string[]
  quantity: null | number
  unit: null | string
  checked: boolean
  createdAt: Date
}

export async function createShoppingList({ name }: CreateShoppingListParams) {
  const shoppingList = {
    name,
    checked: false,
    createdAt: new Date(),
  }

  const db = await getDb()
  return db.add('shopping-lists', shoppingList)
}

export async function createShoppingListItem(
  params: CreateShoppingListItemParams,
) {
  const shoppingListItem = {
    ...params,
    ngram: createNgram(params.name),
    createdAt: new Date(),
  }

  const db = await getDb()
  return db.add('shopping-list-items', shoppingListItem)
}

export async function updateShoppingList(shoppingList: ShoppingList) {
  const db = await getDb()
  return db.put('shopping-lists', shoppingList)
}

export async function updateShoppingListItem(
  shoppingListItem: ShoppingListItem,
) {
  const newShoppingListItem = {
    ...shoppingListItem,
    ngram: createNgram(shoppingListItem.name),
  }
  const db = await getDb()
  return db.put('shopping-list-items', newShoppingListItem)
}

export async function deleteShoppingList(id: number) {
  const db = await getDb()
  const tx = db.transaction(
    ['shopping-lists', 'shopping-list-items'],
    'readwrite',
  )

  tx.objectStore('shopping-lists').delete(id)

  const index = tx
    .objectStore('shopping-list-items')
    .index('shopping-list-items-shopping-list')

  for await (const cursor of index.iterate(id)) {
    cursor.delete()
  }

  return tx.done
}

export async function deleteShoppingListItem(id: number) {
  const db = await getDb()
  return db.delete('shopping-list-items', id)
}

export async function listShoppingLists(): Promise<ShoppingList[]> {
  const db = await getDb()
  const items = await db.getAll('shopping-lists')

  return items.reverse()
}

export async function listShoppingListItems(
  shoppingListId: number,
): Promise<ShoppingListItem[]> {
  const db = await getDb()
  return db.getAllFromIndex(
    'shopping-list-items',
    'shopping-list-items-shopping-list',
    shoppingListId,
  )
}

export async function searchShoppingListItems(
  rawQuery: string,
): Promise<ShoppingListItem[]> {
  const query = normalize(rawQuery)
  const db = await getDb()
  const items = await db.getAllFromIndex(
    'shopping-list-items',
    'shopping-list-items-name-ngrams',
    query,
  )
  const uniq = new Set()

  return items.filter((item: ShoppingListItem) => {
    if (uniq.has(item.name)) {
      return false
    } else {
      uniq.add(item.name)
      return true
    }
  })
}

export async function getShoppingList(id: number): Promise<ShoppingList> {
  const db = await getDb()
  return db.get('shopping-lists', id)
}

export async function getShoppingListItem(
  id: number,
): Promise<ShoppingListItem> {
  const db = await getDb()
  return db.get('shopping-list-items', id)
}

async function getDb() {
  if (db === null) {
    db = await openDB('shopping_planner', 8, {
      async upgrade(db, oldVersion, newVersion, transaction) {
        if (oldVersion < 1) {
          db.createObjectStore('shopping-lists', {
            autoIncrement: true,
            keyPath: 'id',
          })
        }

        if (oldVersion <= 2) {
          const shoppingListItemStore = db.createObjectStore(
            'shopping-list-items',
            {
              autoIncrement: true,
              keyPath: 'id',
            },
          )

          shoppingListItemStore.createIndex(
            'shopping-list-items-shopping-list',
            'shoppingListId',
          )
        }

        // newVersion >= 3 - so I can develop this file without applying half baked
        // migrations
        if (oldVersion <= 7) {
          const shoppingListItemStore = transaction.objectStore(
            'shopping-list-items',
          )

          shoppingListItemStore.createIndex(
            'shopping-list-items-name-ngrams',
            'ngram',
            { multiEntry: true },
          )

          for await (const cursor of shoppingListItemStore.iterate()) {
            const item: ShoppingListItem = cursor.value
            await cursor.update({ ...item, ngram: createNgram(item.name) })
          }
        }
      },
    })
  }

  return db
}

function createNgram(text: string) {
  const segmenter = new Intl.Segmenter()
  const segments = Array.from(segmenter.segment(text))
  const ngram: string[] = []

  let current = ''

  for (const segment of segments) {
    const char = normalize(segment.segment)
    current = current + char
    ngram.push(current)
  }

  return ngram
}

function normalize(text: string) {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}
