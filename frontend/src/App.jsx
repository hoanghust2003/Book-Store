
import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvide } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
function App() {
  

  return (
    <>
    <AuthProvide>
    <Navbar></Navbar>
    <main className='min-h-screen max-w-screen-2x1 mx-auto px-4 py-6 font-primary bg-white dark:bg-gray-900 text-black dark:text-white' >
      <Outlet/>
      </main>
    <Footer/>
    </AuthProvide>
    <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick />
    </>
  )
}

export default App
