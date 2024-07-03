import React from 'react'

import AlertDialogDelete from './AlertDialogDelete'
import { DropdownMenuItem } from './DropdownMenu'

export default function ({ onDelete }: { onDelete: () => void }) {
  return (
    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
      <AlertDialogDelete onDelete={onDelete}>
        <div>Delete</div>
      </AlertDialogDelete>
    </DropdownMenuItem>
  )
}
