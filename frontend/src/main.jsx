import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App.jsx'
import './index.css'
import store from './store/store.js'
import { BrowserRouter, Route, Routes,useNavigate } from 'react-router-dom'
import { Home } from './components/index.js';
import { SocketProvider } from './components/Socket/SocketProvider.jsx';

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <SocketProvider>
      <ToastContainer/>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<App/>}/>
            <Route path='/home' element={<Home/>}/>
          </Routes>
        </BrowserRouter>
        </SocketProvider>
    </Provider>
)
