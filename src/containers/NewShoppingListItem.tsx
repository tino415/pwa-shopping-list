import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { type WatchObserver } from 'react-hook-form'

import ShoppingListItemForm, {
  type InputData,
} from '../components/ShoppingListItemForm'

import {
  createShoppingListItem,
  deleteShoppingListItem,
  getShoppingList,
  listShoppingListItems,
  searchShoppingListItems,
  type ShoppingList as List,
  type ShoppingListItem,
} from '../lib/db'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../components/ui/Breadcrumb'

import Header from '../components/ui/Header'
import { Table, TableBody, TableCell, TableRow } from '../components/ui/Table'
import { Button } from '../components/ui/Button'

function NewShoppingListItem() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [shoppingList, setShoppingList] = useState<List | null>(null)
  const [shoppingListItems, setShoppingListItems] = useState<
    ShoppingListItem[]
  >([])
  const [recommendedItems, setRecommendedItems] = useState<ShoppingListItem[]>(
    [],
  )

  useEffect(() => {
    if (id) {
      getShoppingList(parseInt(id)).then((list) => {
        setShoppingList(list)
      })
      listShoppingListItems(parseInt(id)).then((list) => {
        setShoppingListItems(list)
      })
    }
  }, [id])

  function onSubmit(values: InputData) {
    if (id) {
      createShoppingListItem({ ...values, shoppingListId: parseInt(id) })
      navigate(`/${id}`)
    }
  }

  const onChange: WatchObserver<{ name: string }> = (value, { name }) => {
    if (name == 'name' && value.name) {
      searchShoppingListItems(value.name).then(setRecommendedItems)
    }
  }

  const addItem = async (name: string) => {
    if (id) {
      await createShoppingListItem({ name, shoppingListId: parseInt(id) })
      const items = await listShoppingListItems(parseInt(id))
      setShoppingListItems(items)
    }
  }

  const removeItem = async (removeId: number) => {
    if (id) {
      await deleteShoppingListItem(removeId)
      const items = await listShoppingListItems(parseInt(id))
      setShoppingListItems(items)
    }
  }

  const addRemoveShoppingListItem = (item: ShoppingListItem) => {
    const oldItem = shoppingListItems.find((i) => i.name == item.name)

    if (oldItem) {
      return (
        <Button onClick={() => removeItem(oldItem.id)} variant="destructive">
          Remove
        </Button>
      )
    } else {
      return <Button onClick={() => addItem(item.name)}>Add</Button>
    }
  }

  if (shoppingList) {
    return (
      <>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${shoppingList.id}`}>
                {shoppingList.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>New</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Header
          name={`Add new shopping list item to ${shoppingList.name}`}
        ></Header>

        <ShoppingListItemForm
          onSubmit={onSubmit}
          onChange={onChange}
          cancelLink={`/${id}`}
        />

        <div className="rounded-md border my-2">
          <Table>
            <TableBody>
              {recommendedItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="w-[60px]">
                    {addRemoveShoppingListItem(item)}
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </>
    )
  } else {
    return <p>Invalid params</p>
  }
}

export default NewShoppingListItem
