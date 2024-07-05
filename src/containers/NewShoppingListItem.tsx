import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import ShoppingListItemForm, {
  type InputData,
} from '../components/ShoppingListItemForm'

import {
  createShoppingListItem,
  getShoppingList,
  type ShoppingList as List,
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

function NewShoppingListItem() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [shoppingList, setShoppingList] = useState<List | null>(null)

  useEffect(() => {
    if (id) {
      getShoppingList(parseInt(id)).then((list) => {
        setShoppingList(list)
      })
    }
  }, [id])

  function onSubmit(values: InputData) {
    if (id) {
      createShoppingListItem({ ...values, shoppingListId: parseInt(id) })
      navigate(`/${id}`)
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

        <ShoppingListItemForm onSubmit={onSubmit} cancelLink={`/${id}`} />
      </>
    )
  } else {
    return <p>Invalid params</p>
  }
}

export default NewShoppingListItem
