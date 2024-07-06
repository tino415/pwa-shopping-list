import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'

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
import LinkButton from '../components/ui/LinkButton'
import CircularLink from '../components/ui/CircularLink'

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
    <div className="flex flex-col h-full">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Home</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Header name="">
        <div className="hidden sm:block">
          <Actions actions={[ActionLink('/new', 'New')]} />
        </div>
      </Header>
      <div className="grow">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right"></TableHead>
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
      </div>

      <div className="flex items-center justify-center p-2 sm:hidden">
        <CircularLink to="/new">
          <Plus />
        </CircularLink>
      </div>
    </div>
  )
}

export default ShoppingLists
