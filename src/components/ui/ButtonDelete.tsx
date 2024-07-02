import React from 'react'

import { Button } from './Button'

export default function({onClick} : {onClick : () => void}) {
  return (
    <Button variant="destructive" onClick={onClick}>
      Delete
    </Button>
  )
}
