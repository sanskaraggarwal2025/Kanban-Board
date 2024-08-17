
import Login from "./components/Login";
import Signup from "./components/Signup.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./components/Home.tsx";

function App() {

  return (
      <>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/' element={<Home />} />
        </Routes>
      </BrowserRouter>
      
      
        </>
  )
}

export default App
