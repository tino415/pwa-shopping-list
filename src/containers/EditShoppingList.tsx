import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  updateShoppingList,
  getShoppingList,
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

import ShoppingListForm, {
  type InputData,
} from '../components/ShoppingListForm'
import Header from '../components/ui/Header'

function EditShoppingList() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null)

  useEffect(() => {
    if (id) {
      getShoppingList(parseInt(id)).then((list) => {
        setShoppingList(list)
      })
    }
  }, [id])

  function onSubmit(values: InputData) {
    if (shoppingList) {
      updateShoppingList({ ...shoppingList, ...values })
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
              <BreadcrumbPage>Edit</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Header name={`Edit shopping list ${shoppingList.name}`}></Header>

        <ShoppingListForm
          shoppingList={shoppingList}
          onSubmit={onSubmit}
          cancelLink={`/${shoppingList.id}`}
        />
      </>
    )
  } else {
    return <p>Loading</p>
  }
}

export default EditShoppingList
