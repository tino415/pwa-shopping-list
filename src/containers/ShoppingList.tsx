import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'

import {
  getShoppingList,
  type ShoppingList as List,
  listShoppingListItems,
  type ShoppingListItem,
  deleteShoppingListItem,
  deleteShoppingList,
  updateShoppingListItem,
} from '../lib/db'

import Actions, { ActionLink, ActionDelete } from '../components/ui/Actions'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/Table'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../components/ui/Breadcrumb'

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../components/ui/DropdownMenu'

import Header from '../components/ui/Header'
import { Checkbox } from '../components/ui/Checkbox'

function ShoppingList() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [shoppingList, setShoppingList] = useState<List | null>(null)
  const [shoppingListItems, setShoppingListItems] = useState<
    ShoppingListItem[]
  >([])

  useEffect(() => {
    if (id) {
      getShoppingList(parseInt(id)).then((list) => {
        setShoppingList(list)
      })
      listShoppingListItems(parseInt(id)).then((items) => {
        setShoppingListItems(items)
      })
    }
  }, [id])

  async function submitDeleteShoppingListItem(itemId: number) {
    deleteShoppingListItem(itemId).then(() => {
      if (id) {
        listShoppingListItems(parseInt(id)).then((items) => {
          setShoppingListItems(items)
        })
      }
    })
  }

  async function submitDeleteShoppingList(id: number) {
    deleteShoppingList(id).then(() => {
      navigate('/')
    })
  }

  async function toggle(item: ShoppingListItem) {
    await updateShoppingListItem({ ...item, checked: !item.checked })
    const items = await listShoppingListItems(item.shoppingListId)
    setShoppingListItems(items)
  }

  const strikeText = (is_striked: boolean, text: string) => {
    if (is_striked) {
      return <span className="line-through">{text}</span>
    } else {
      return <span>{text}</span>
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
              <BreadcrumbPage>{shoppingList.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Header name={shoppingList.name}>
          <Actions
            actions={[
              ActionLink(`/${shoppingList.id}/new`, 'New'),
              ActionLink(`/${shoppingList.id}/edit`, 'Edit'),
              ActionDelete(() => submitDeleteShoppingList(shoppingList.id)),
            ]}
          />
        </Header>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shoppingListItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox
                      checked={item.checked}
                      onCheckedChange={() => toggle(item)}
                    />
                  </TableCell>
                  <TableCell>{strikeText(item.checked, item.name)}</TableCell>
                  <TableCell className="text-right">
                    <Actions
                      actions={[
                        ActionLink(
                          `/${shoppingList.id}/${item.id}/edit`,
                          'Edit',
                        ),
                        ActionDelete(() =>
                          submitDeleteShoppingListItem(item.id),
                        ),
                      ]}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </>
    )
  } else {
    return <p>Loading</p>
  }
}

export default ShoppingList
