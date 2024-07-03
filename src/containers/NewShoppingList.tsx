import React from 'react'
import { useNavigate } from 'react-router-dom'
import { createShoppingList } from '../lib/db'

import LinkCancel from '../components/ui/LinkCancel'

import ShoppingListForm, {
  type InputData,
} from '../components/ShoppingListForm'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../components/ui/Breadcrumb'

import Header from '../components/ui/Header'

function NewShoppingList() {
  const navigate = useNavigate()

  function onSubmit(values: InputData) {
    createShoppingList(values)
    navigate('/')
  }

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>New</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Header name="Add new shopping list"></Header>

      <ShoppingListForm onSubmit={onSubmit} cancelLink="/" />
    </>
  )
}

export default NewShoppingList
