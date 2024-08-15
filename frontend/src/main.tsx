import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './redux/store.ts'
import {Navbar} from "./components/Header.tsx"
createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <Navbar></Navbar>
    <App />
  </Provider>
)
