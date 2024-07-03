import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { type ShoppingList } from '../lib/db'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/Form'

import { Input } from './ui/Input'

import { Button } from './ui/Button'
import LinkButton from './ui/LinkButton'
import LinkCancel from './ui/LinkCancel'

export type InputData = z.infer<typeof formSchema>

type Properties = {
  cancelLink: string
  shoppingList?: ShoppingList
  onSubmit: SubmitHandler<InputData>
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
})

export default function (properties: Properties) {
  const form = useForm<InputData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  })

  if (properties.shoppingList) {
    form.setValue('name', properties.shoppingList.name)
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
                <Input placeholder="Groceries" {...field} />
              </FormControl>
              <FormDescription>Name of list</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row gap-2">
          <Button type="submit">Submit</Button>
          <LinkCancel to={properties.cancelLink} />
        </div>
      </form>
    </Form>
  )
}
