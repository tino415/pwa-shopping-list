import React from 'react'

import { Link } from 'react-router-dom'
import { buttonVariants } from './Button'

export default function ({
  to,
  children,
}: {
  to: string
  children: React.ReactNode
}) {
  return (
    <Link className={buttonVariants({ variant: 'ghost' })} to={to}>
      {children}
    </Link>
  )
}
