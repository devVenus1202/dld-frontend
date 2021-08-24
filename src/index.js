import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import {initPWA} from "./helpers/pwa";


window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault()
  // Stash the event so it can be triggered later.
  // this.deferredPrompt = e
})


ReactDOM.render(<App/>, document.getElementById('root'))

//PWA
initPWA();


