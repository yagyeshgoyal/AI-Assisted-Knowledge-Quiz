import { useState } from 'react'
import {Routes, Route} from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './Pages/Home'


function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='px-4 sm:px-[5vw]  md:px-[7vw] lg-px[9vw]' >
      
      <Routes>
        <Route path='/' element ={<Home/>} />
        
      </Routes>

    </div>
  )
}

export default App
