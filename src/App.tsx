import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

import './App.css'
import NewShoppingList from './containers/NewShoppingList'
import ShoppingList from './containers/ShoppingList'
import ShoppingLists from './containers/ShoppingLists'
import NewShoppingListItem from './containers/NewShoppingListItem'
import EditShoppingList from './containers/EditShoppingList'
import EditShoppingListItem from './containers/EditShoppingListItem'

function App() {
  return (
    <Router>
      <div className="container mx-auto">
        <Routes>
          <Route path="/" Component={ShoppingLists} />
          <Route path="/new" Component={NewShoppingList} />
          <Route path="/:id" Component={ShoppingList} />
          <Route path="/:id/edit" Component={EditShoppingList} />
          <Route path="/:id/new" Component={NewShoppingListItem} />
          <Route
            path="/:shoppingListId/:id/edit"
            Component={EditShoppingListItem}
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
