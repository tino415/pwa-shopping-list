import React, { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  type SubmitHandler,
  type WatchObserver,
  useForm,
} from 'react-hook-form'
import { z } from 'zod'

import { type ShoppingListItem } from '../lib/db'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/Form'

import { Input } from '../components/ui/Input'

import { Button } from './ui/Button'
import LinkCancel from './ui/LinkCancel'

export type InputData = z.infer<typeof formSchema>

type Properties = {
  shoppingListItem?: ShoppingListItem
  cancelLink: string
  onSubmit: SubmitHandler<InputData>
  onChange?: WatchObserver<InputData>
}

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(512),
  quantity: z.coerce.number().min(0).max(1000),
  unit: z.string().min(1).max(10),
})

export default function (properties: Properties) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      quantity: 1,
      unit: 'pieces',
    },
  })

  if (properties.shoppingListItem) {
    form.setValue('name', properties.shoppingListItem.name)
    form.setValue('quantity', properties.shoppingListItem.quantity || 1)
    form.setValue('unit', properties.shoppingListItem.unit || 'pieces')
  }

  if (properties.onChange !== undefined) {
    useEffect(() => {
      if (properties.onChange) {
        const subscription = form.watch(properties.onChange)
        return () => subscription.unsubscribe()
      }
    }, [form.watch])
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(properties.onSubmit)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Tomatoes" {...field} />
              </FormControl>
              <FormDescription>Name of item to add to list</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem className="grow">
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="1" {...field} />
                </FormControl>
                <FormDescription>Count of items to buy</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem className="w-20">
                <FormLabel>Unit</FormLabel>
                <FormControl>
                  <Input placeholder="pieces" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-row gap-2">
          <Button type="submit">Submit</Button>
          <LinkCancel to={properties.cancelLink} />
        </div>
      </form>
    </Form>
  )
}
