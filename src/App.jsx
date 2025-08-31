import { useState } from 'react'
import './App.css'
import Hero from './components/custom/Hero'
import { Analytics } from "@vercel/analytics/react"
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* Hero */}
      <Hero/>
    </>
  )
}

export default App
