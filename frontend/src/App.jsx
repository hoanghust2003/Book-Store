
import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar';
import Footer from './components/Footer';
function App() {
  

  return (
    <>
    <Navbar></Navbar>
    <main className='min-h-screen max-w-screen-2x1 mx-auto px-4 py-6 font-primary bg-white dark:bg-gray-900 text-black dark:text-white' >
      <Outlet/>
      </main>
    <Footer/>
    </>
  )
}

export default App
