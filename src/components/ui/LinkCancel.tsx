import React from 'react'
import { buttonVariants } from './Button'
import { Link, useNavigate, useParams } from 'react-router-dom'

export default function({to} : {to : string}) {
  return (
    <Link className={buttonVariants({variant: "secondary"})} to={to}>
      Cancel
    </Link>
  )
}
