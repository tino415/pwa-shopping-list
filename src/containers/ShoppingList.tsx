import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

import {
  getShoppingList,
  type ShoppingList as List,
  listShoppingListItems,
  type ShoppingListItem,
  deleteShoppingListItem,
} from '../lib/db'

import { Button, buttonVariants } from '../components/ui/Button'
import ButtonDelete from '../components/ui/ButtonDelete'

import {
  Table,
  TableBody,
  TableCaption,
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

import LinkNew from '../components/ui/LinkNew'
import LinkEdit from '../components/ui/LinkEdit'

function ShoppingList() {
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
        <LinkNew to={`/${shoppingList.id}/new`}/>
        <LinkEdit to={`/${shoppingList.id}/edit`}/>
        <ul>
          <li>{shoppingList.id}</li>
          <li>{shoppingList.name}</li>
        </ul>
        <Table>
          <TableCaption>Shopping list items</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shoppingListItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-right">
                  <Link className={buttonVariants()} to={`/${shoppingList.id}/${item.id}/edit`}>
                    Edit
                  </Link>
                  <ButtonDelete onDelete={() => submitDeleteShoppingListItem(item.id)}/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </>
    )
  } else {
    return <p>Loading</p>
  }
}

export default ShoppingList
