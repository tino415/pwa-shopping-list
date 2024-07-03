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

export async function createShoppingListItem({
  name,
  shoppingListId,
}: CreateShoppingListItemParams) {
  const shoppingListItem = {
    name,
    shoppingListId: shoppingListId,
    createdAt: new Date(),
  }

  const db = await getDb()
  return db.add('shopping-list-items', shoppingListItem)
}

export async function updateShoppingList(shoppingList : ShoppingList) {  
  const db = await getDb()
  return db.put('shopping-lists', shoppingList)
}

export async function updateShoppingListItem(shoppingListItem: ShoppingListItem) {
  const db = await getDb()
  return db.put('shopping-list-items', shoppingListItem)
}

export async function deleteShoppingList(id: number) {
  const db = await getDb()
  const tx = db.transaction(['shopping-lists', 'shopping-list-items'], 'readwrite')

  tx.objectStore('shopping-lists').delete(id)

  const index = tx.objectStore('shopping-list-items').index('shopping-list-items-shopping-list')

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
  return db.getAllFromIndex('shopping-list-items', 'shopping-list-items-shopping-list', shoppingListId)
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
    db = await openDB('shopping_planner', 2, {
      upgrade(db, oldVersion, _newVersion, transaction) {
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
      },
    })
  }

  return db
}
