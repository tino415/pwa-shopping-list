import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  updateShoppingListItem,
  getShoppingList,
  getShoppingListItem,
  type ShoppingListItem,
  type ShoppingList,
} from '../lib/db'

import LinkCancel from '../components/ui/LinkCancel'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../components/ui/Breadcrumb'

import ShoppingListItemForm, { InputData } from '../components/ShoppingListItemForm'

function EditShoppingListItem() {
  const navigate = useNavigate()
  const { id, shoppingListId } = useParams()
  const [shoppingListItem, setShoppingListItem] =
    useState<ShoppingListItem | null>(null)
  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null)

  useEffect(() => {
    if (id && shoppingListId) {
      getShoppingListItem(parseInt(id)).then((item) => {
        setShoppingListItem(item)
      })
      getShoppingList(parseInt(shoppingListId)).then((list) => {
        setShoppingList(list)
      })
    }
  }, [id])

  function onSubmit(values: InputData) {
    if (shoppingListItem && shoppingListId) {
      updateShoppingListItem({ ...shoppingListItem, ...values })
      navigate(`/${shoppingListId}`)
    }
  }

  if (shoppingListItem && shoppingList) {
    return (
      <>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
            <BreadcrumbLink href={`/${shoppingList.id}`}>{shoppingList.name}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{shoppingListItem.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1>{shoppingList.name} item</h1>

        <ShoppingListItemForm shoppingListItem={shoppingListItem} onSubmit={onSubmit}/>

        <LinkCancel to={`/${shoppingListId}`}/>
      </>
    )
  } else {
    return <p>Invalid params</p>
  }
}

export default EditShoppingListItem
