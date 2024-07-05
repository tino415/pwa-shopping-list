import React from 'react'

export default function (props: { name?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-row items-center py-1">
      <h1 className="grow text-xl font-semibold tracking-tight">
        {props.name || ''}
      </h1>
      <div className="flex flex-row gap-2">{props.children || ''}</div>
    </div>
  )
}
