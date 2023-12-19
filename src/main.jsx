import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

import {Provider} from 'react-redux'
import {store, persistor} from './store.js'
import { PersistGate } from 'redux-persist/integration/react'

import fbconfig from './firebase/FirebaseConfig';
import {initializeApp} from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"

const app = initializeApp(fbconfig);
export const db = getFirestore(app)
export const storage = getStorage(app)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
)
