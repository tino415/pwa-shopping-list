import React from 'react'

import LinkButton from './LinkButton'
import DropdownItemLink from './DropdownItemLink'
import DropdownItemDelete from './DropdownItemDelete'
import ButtonDelete from './ButtonDelete'

import { EllipsisVertical } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from './DropdownMenu'

type Action = {
  renderDropdown : (index : number) => React.ReactNode
  renderButton : (index : number) => React.ReactNode
}

export default function Actions(props : {actions : Action[]}) {
  if (props.actions.length > 1) {
    return (
      <>
        <div className="sm:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisVertical/>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {props.actions.map((action, index) => action.renderDropdown(index))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="hidden sm:flex flex-row gap-2 justify-end">
          {props.actions.map((action, index) => action.renderButton(index))}
        </div>
      </>
    )
  } else {
    return <>{props.actions[0].renderButton(0)}</>
  }
}

export function ActionLink(to : string, text : string) {
  return {
    renderDropdown: (index : number) => {
      return <DropdownItemLink key={index} to={to}>{text}</DropdownItemLink>
    },
    renderButton: (index : number) => {
      return <LinkButton key={index} to={to} >{text}</LinkButton>
    },
  }
}

export function ActionDelete(onDelete : () => void) {
  return {
    renderDropdown: (index : number) => {
      return <DropdownItemDelete key={index} onDelete={onDelete}/>
    },
    renderButton: (index : number) => {
      return <ButtonDelete key={index} onDelete={onDelete}/>
    },
  }
}
