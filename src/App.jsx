import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './component/navbar/navbar'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
     <Navbar></Navbar>
     <div>Hello Spotify</div>
    </>
  )
}

export default App
