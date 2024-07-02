import React from 'react'

import { Link } from 'react-router-dom'
import { buttonVariants } from './Button'

export default function({to} : {to : string}) {
  return <Link className={buttonVariants()} to={to}>Edit</Link>
}
