import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

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

import { Button } from '../components/ui/Button'
import ButtonDelete from '../components/ui/ButtonDelete'

import {
  listShoppingLists,
  deleteShoppingList,
  type ShoppingList,
} from '../lib/db'

function ShoppingLists() {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([])

  useEffect(() => {
    listShoppingLists().then((lists) => {
      setShoppingLists(lists)
    })
  })

  async function submitDeleteShoppingList(id: string) {
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
      <Button>
        <Link to="/new">Add</Link>
      </Button>
      <Table>
        <TableCaption>Your shopping lists</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="w-[100px]">Progress</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shoppingLists.map((list) => (
            <TableRow key={list.id}>
              <TableCell className="font-medium">{list.name}</TableCell>
              <TableCell>100%</TableCell>
              <TableCell className="text-right">
                <Button>
                  <Link to={`/${list.id}`}>Show</Link>
                </Button>
                <ButtonDelete onClick={() => submitDeleteShoppingList(list.id)}/>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default ShoppingLists
