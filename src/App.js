import React, { Component } from 'react'
import { Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore, compose } from 'redux'
// import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogicMiddleware } from 'redux-logic'
import { createBrowserHistory } from 'history'
import { routerMiddleware } from 'react-router-redux'

import AppRoutes from './routes'
import arrLogic from './logic'
import AppReducer from './reducers'

const logicMiddleware = createLogicMiddleware(arrLogic)
const history = createBrowserHistory()
const middlewares = [logicMiddleware, routerMiddleware(history)]
const isDev = process.env.NODE_ENV === 'development'
if (isDev) {
  // middlewares.push(logger)
}

const composeEnhancers =
  typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    }) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(...middlewares),
);


export const store = createStore(AppReducer, enhancer)

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <AppRoutes />
        </Router>
      </Provider>
    )
  }
}

// eslint-disable-next-line no-extend-native
String.prototype.trimAllSpace = function () {
  const input = String(this)
  return input.replace(/\s/g, '')
}




export default App
