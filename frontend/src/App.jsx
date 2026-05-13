import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"
import { ToastContainer, useToast } from "./components/Toast"
import { createContext, useContext } from "react"

import Navbar    from "./components/Navbar"
import Footer    from "./components/Footer"
import Home      from "./pages/Home"
import Login     from "./pages/Login"
import Register  from "./pages/Register"
import Courses   from "./pages/Courses"
import CourseDetail from "./pages/CourseDetail"
import Dashboard from "./pages/Dashboard"
import Cart      from "./pages/Cart"
import Instructors from "./pages/Instructors"
import About     from "./pages/About"
import Admin     from "./pages/Admin"
import Profile   from "./pages/Profile"

// ── Contexte global pour les toasts ────────────────────────────
export const ToastContext = createContext(null)
export const useGlobalToast = () => useContext(ToastContext)

// ── Route protégée ─────────────────────────────────────────────
function ProtectedRoute({ children, roles }) {
  const { user, isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user?.role)) return <Navigate to="/" replace />
  return children
}

// ── Layout principal ───────────────────────────────────────────
function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  const { toasts, toast, removeToast } = useToast()

  return (
    <ToastContext.Provider value={toast}>
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* Pages publiques */}
            <Route path="/"            element={<Home />} />
            <Route path="/courses"     element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/instructors" element={<Instructors />} />
            <Route path="/about"       element={<About />} />
            <Route path="/login"       element={<Login />} />
            <Route path="/register"    element={<Register />} />

            {/* Pages protégées */}
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/cart" element={
              <ProtectedRoute><Cart /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute roles={["admin"]}><Admin /></ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>

        {/* Toast notifications globales */}
        <ToastContainer toasts={toasts} onClose={removeToast} />
      </BrowserRouter>
    </ToastContext.Provider>
  )
}