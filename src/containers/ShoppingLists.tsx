import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Actions, { ActionLink, ActionDelete } from '../components/ui/Actions'

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
  BreadcrumbList,
  BreadcrumbPage,
} from '../components/ui/Breadcrumb'

import {
  listShoppingLists,
  deleteShoppingList,
  type ShoppingList,
} from '../lib/db'

import Header from '../components/ui/Header'

function ShoppingLists() {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([])

  useEffect(() => {
    listShoppingLists().then((lists) => {
      setShoppingLists(lists)
    })
  })

  async function submitDeleteShoppingList(id: number) {
    deleteShoppingList(id).then(() => {
      listShoppingLists().then((lists) => {
        setShoppingLists(lists)
      })
    })
  }

  return (
    <>
      <div className="p-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Home</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <Header name="">
        <Actions actions={[ActionLink('/new', 'New')]} />
      </Header>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shoppingLists.map((list) => (
              <TableRow key={list.id}>
                <TableCell className="font-medium">
                  <Link to={`/${list.id}`}>{list.name}</Link>
                </TableCell>
                <TableCell className="text-right">
                  <Actions
                    actions={[
                      ActionLink(`/${list.id}/edit`, 'Edit'),
                      ActionDelete(() => submitDeleteShoppingList(list.id)),
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
}

export default ShoppingLists
