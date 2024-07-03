import React from 'react'

import { Button } from './Button'
import AlertDialogDelete from './AlertDialogDelete'

export default function(props : {onDelete : () => void, className?: string}) {
  return (
    <AlertDialogDelete onDelete={props.onDelete}>
      <Button variant="destructive" className={props.className}>
        Delete
      </Button>
    </AlertDialogDelete>
  )
}
