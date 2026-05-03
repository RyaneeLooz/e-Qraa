import { useState } from "react"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"

export default function App() {
  const [page, setPage] = useState("home")

  const renderPage = () => {
    switch (page) {
      case "home": return <Home setPage={setPage} />
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