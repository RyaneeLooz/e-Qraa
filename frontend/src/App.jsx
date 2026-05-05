import { useState } from "react"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Courses from "./pages/Courses"
import Dashboard from "./pages/Dashboard"
import Cart from "./pages/Cart"
import Instructors from "./pages/Instructors"
import About from "./pages/About"

export default function App() {
  const [page, setPage] = useState("home")

  const renderPage = () => {
    switch (page) {
      case "home": return <Home setPage={setPage} />
      case "login": return <Login setPage={setPage} />
      case "register": return <Register setPage={setPage} />
      case "courses": return <Courses />
      case "dashboard": return <Dashboard />
      case "cart": return <Cart setPage={setPage} />
      case "instructors": return <Instructors setPage={setPage} />
      case "about": return <About setPage={setPage} />
      default: return <div className="p-8 text-slate-500">Page en construction...</div>
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar page={page} setPage={setPage} />
      {renderPage()}
    </div>
  )
}