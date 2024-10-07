import 'react-toastify/dist/ReactToastify.css'
import App from './App'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { ToastContainer } from 'react-toastify'


const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <App />
    <ToastContainer position="top-right" autoClose={5000} />
  </Provider>
)
