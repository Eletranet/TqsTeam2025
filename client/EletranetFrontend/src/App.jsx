import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SignIn from "./pages/SignIn.jsx";
import Home from './pages/Home.jsx';
import { Navbar } from "./components/Navbar.jsx"
import Register from './pages/Register.jsx';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
        <Navbar/>

      <Routes>
        <Route path="/loguin" element={<SignIn /> }> </Route>
        <Route path="/" element={<Home/> }> </Route>
        <Route path="/register" element={<Register/> }> </Route>


      </Routes>  
    {/*<Footer />*/}
    </BrowserRouter>
    </>
  )
}

export default App
