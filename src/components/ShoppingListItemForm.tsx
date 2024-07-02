import React, { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { type SubmitHandler, useForm } from 'react-hook-form'
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

export type InputData = z.infer<typeof formSchema>

type Properties = {
  shoppingListItem? : ShoppingListItem,
  onSubmit : SubmitHandler<InputData>
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
})

export default function(properties : Properties) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  })

  if (properties.shoppingListItem) {
    form.setValue('name', properties.shoppingListItem.name)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(properties.onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Tomatoes" {...field} />
              </FormControl>
              <FormDescription>
                Name of item to add to list
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
