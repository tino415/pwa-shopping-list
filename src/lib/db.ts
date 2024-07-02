import { openDB, type IDBPDatabase } from 'idb'

let db: IDBPDatabase<undefined> | null = null

type CreateShoppingListParams = {
  name: string
}

type UpdateShoppingListParams = {
  id: string
  name: string
}

type CreateShoppingListItemParams = {
  name: string
  shoppingListId: string
}

export type ShoppingList = {
  id: string
  name: string
  createdAt: Date
}

export type ShoppingListItem = {
  id: number
  shoppingListId: number
  name: string
  createdAt: Date
}

export async function createShoppingList({ name }: CreateShoppingListParams) {
  const shoppingList = {
    name,
    createdAt: new Date(),
  }

  const db = await getDb()
  const tx = db.transaction('shopping-lists', 'readwrite')
  tx.objectStore('shopping-lists').add(shoppingList)
  return tx.done
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
  const tx = db.transaction('shopping-list-items', 'readwrite')
  tx.objectStore('shopping-list-items').add(shoppingListItem)
  return tx.done
}

export async function updateShoppingList({
  id,
  name,
}: UpdateShoppingListParams) {
  const shoppingList = {
    id: parseInt(id),
    name,
    createdAt: new Date(),
  }

  const db = await getDb()
  const tx = db.transaction('shopping-lists', 'readwrite')
  tx.store.put(shoppingList)
  return tx.done
}

export async function updateShoppingListItem(
  shoppingListItem: ShoppingListItem,
) {
  const db = await getDb()
  const tx = db.transaction('shopping-list-items', 'readwrite')
  tx.store.put(shoppingListItem)
  return tx.done
}

export async function deleteShoppingList(id: string) {
  const db = await getDb()
  const tx = db.transaction('shopping-lists', 'readwrite')

  tx.store.delete(id)

  const txitems = db.transaction('shopping-list-items', 'readwrite')
  const index = txitems.store.index('shopping-list-items-shopping-list')

  for await (const cursor of index.iterate(id)) {
    cursor.delete()
  }

  return Promise.all([tx.done, txitems.done])
}

export async function deleteShoppingListItem(id: number) {
  const db = await getDb()
  const tx = db.transaction('shopping-list-items', 'readwrite')
  tx.store.delete(id)
  return tx.done
}

export async function listShoppingLists(): Promise<ShoppingList[]> {
  const db = await getDb()
  return db.transaction('shopping-lists').store.getAll()
}

export async function listShoppingListItems(
  shoppingListId: number,
): Promise<ShoppingListItem[]> {
  const db = await getDb()
  const items = await db
    .transaction('shopping-list-items')
    .store.index('shopping-list-items-shopping-list')
    .getAll(shoppingListId)
  console.log(items)
  return items
}

export async function getShoppingList(id: number): Promise<ShoppingList> {
  const db = await getDb()
  return db.transaction('shopping-lists').store.get(id)
}

export async function getShoppingListItem(
  id: number,
): Promise<ShoppingListItem> {
  const db = await getDb()
  return db.transaction('shopping-list-items').store.get(id)
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
