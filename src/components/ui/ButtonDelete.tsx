import React from 'react'

import { Button } from './Button'
import AlertDialogDelete from './AlertDialogDelete'

export default function({onDelete} : {onDelete : () => void}) {
  return (
    <AlertDialogDelete onDelete={onDelete}>
      <Button variant="destructive">
        Delete
      </Button>
    </AlertDialogDelete>
  )
}
