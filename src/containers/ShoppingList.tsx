import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'

import {
  getShoppingList,
  type ShoppingList as List,
  listShoppingListItems,
  type ShoppingListItem,
  deleteShoppingListItem,
  deleteShoppingList
} from '../lib/db'

import { EllipsisVertical } from 'lucide-react'

import DropdownItemDelete from '../components/ui/DropdownItemDelete'

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

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../components/ui/DropdownMenu'

import LinkNew from '../components/ui/LinkNew'
import LinkEdit from '../components/ui/LinkEdit'
import ButtonDelete from '../components/ui/ButtonDelete'

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
      navigate("/")
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
        <ButtonDelete onDelete={() => submitDeleteShoppingList(shoppingList.id)}/>
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
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <EllipsisVertical/>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <Link to={`/${shoppingList.id}/${item.id}/edit`}>
                        <DropdownMenuItem>
                          Edit
                        </DropdownMenuItem>
                      </Link>
                      <DropdownItemDelete onDelete={() => submitDeleteShoppingListItem(item.id)}/>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
