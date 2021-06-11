import React from 'react'
import { RouteComponentProps } from '@reach/router'
import { Link } from '@reach/router'

const Header: React.FC<RouteComponentProps> = () => {
  return (
    <header data-cy="header" className="w-full border-b border-gray-200">
      <div className="container mx-auto py-3 flex gap-4 items-center">
        <Link to="/">
          <h1 className="font-bold text-2xl">Digital Strength(β)</h1>
        </Link>
        <p className="text-base text-gray-500">Just putting Today I Learned</p>
      </div>
    </header>
  )
}

export default React.memo(Header)
