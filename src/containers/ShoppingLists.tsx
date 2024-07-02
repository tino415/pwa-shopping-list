import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { EllipsisVertical } from 'lucide-react'

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
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../components/ui/DropdownMenu'

import LinkNew from '../components/ui/LinkNew'

import {
  listShoppingLists,
  deleteShoppingList,
  type ShoppingList,
} from '../lib/db'

import DropdownItemDelete from '../components/ui/DropdownItemDelete'
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
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Home</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Header name="">
        <LinkNew to={'/new'}/>
      </Header>
      <Table>
        <TableCaption>Your shopping lists</TableCaption>
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
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <EllipsisVertical/>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <Link to={`/${list.id}/edit`}>
                      <DropdownMenuItem>
                        Edit
                      </DropdownMenuItem>
                    </Link>
                    <DropdownItemDelete onDelete={() => submitDeleteShoppingList(list.id)}/>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default ShoppingLists
