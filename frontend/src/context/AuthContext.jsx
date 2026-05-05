import { createContext, useContext, useState } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [cart, setCart] = useState([])

  const login = (userData) => {
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
    setCart([])
  }

  const addToCart = (course) => {
    setCart((prev) => {
      const exists = prev.find((c) => c.title === course.title)
      if (exists) return prev
      return [...prev, course]
    })
  }

  const removeFromCart = (title) => {
    setCart((prev) => prev.filter((c) => c.title !== title))
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, cart, addToCart, removeFromCart }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
  