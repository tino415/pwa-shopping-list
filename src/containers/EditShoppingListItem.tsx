import React, { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useNavigate, useParams } from 'react-router-dom'

import {
  updateShoppingListItem,
  getShoppingList,
  getShoppingListItem,
  type ShoppingListItem,
  type ShoppingList,
} from '../lib/db'

import { Button } from '../components/ui/Button'
import LinkCancel from '../components/ui/LinkCancel'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/Form'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../components/ui/Breadcrumb'

import { Input } from '../components/ui/Input'

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
})

function EditShoppingListItem() {
  const navigate = useNavigate()
  const { id, shoppingListId } = useParams()
  const [shoppingListItem, setShoppingListItem] =
    useState<ShoppingListItem | null>(null)
  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  })

  useEffect(() => {
    if (id && shoppingListId) {
      getShoppingListItem(parseInt(id)).then((item) => {
        setShoppingListItem(item)
        form.setValue('name', item.name)
      })
      getShoppingList(parseInt(shoppingListId)).then((list) => {
        setShoppingList(list)
      })
    }
  }, [id])

  function onSubmit(values: z.infer<typeof formSchema>) {
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
        <LinkCancel to={`/${shoppingListId}`}/>
      </>
    )
  } else {
    return <p>Invalid params</p>
  }
}

export default EditShoppingListItem
