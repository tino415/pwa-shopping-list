import React from 'react'

import { Link } from 'react-router-dom'
import { DropdownMenuItem } from './DropdownMenu'

export default function ({
  to,
  children,
}: {
  to: string
  children: React.ReactNode
}) {
  return (
    <Link to={to}>
      <DropdownMenuItem>{children}</DropdownMenuItem>
    </Link>
  )
}
