import React from 'react'
import { Link } from 'react-router-dom'
import { buttonVariants } from './Button'

export default function CircularLink({
  to,
  children,
}: {
  to: string
  children: React.ReactNode
}) {
  return (
    <Link className={buttonVariants({ size: 'icon' })} to={to}>
      {children}
    </Link>
  )
}
