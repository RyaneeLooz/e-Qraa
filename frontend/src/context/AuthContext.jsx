import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { authAPI, usersAPI } from "../services/api"

const AuthContext = createContext()

// Clés localStorage
const TOKEN_KEY = "eqraa_token"
const USER_KEY  = "eqraa_user"

export function AuthProvider({ children }) {
  // ── Initialiser depuis le localStorage (session persistante) ──
  const [user, setUser]   = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)) } catch { return null }
  })
  const [cart, setCart]   = useState([])
  const [coins, setCoins] = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY))?.coins ?? 0 } catch { return 0 }
  })
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState(null)

  // ── Synchroniser les coins quand le user change ──
  useEffect(() => {
    if (user?.coins !== undefined) setCoins(user.coins)
  }, [user])

  // ── REGISTER ─────────────────────────────────────────────────
  const register = useCallback(async ({ name, email, password, role }) => {
    setLoading(true)
    setAuthError(null)
    try {
      const data = await authAPI.register({ name, email, password, role })
      // Sauvegarder le token
      localStorage.setItem(TOKEN_KEY, data.token)
      localStorage.setItem(USER_KEY, JSON.stringify(data.user))
      setUser(data.user)
      setCoins(data.user.coins ?? 0)
      return { success: true, user: data.user }
    } catch (err) {
      setAuthError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  // ── LOGIN ─────────────────────────────────────────────────────
  const login = useCallback(async ({ email, password }) => {
    setLoading(true)
    setAuthError(null)
    try {
      const data = await authAPI.login({ email, password })
      localStorage.setItem(TOKEN_KEY, data.token)
      localStorage.setItem(USER_KEY, JSON.stringify(data.user))
      setUser(data.user)
      setCoins(data.user.coins ?? 0)
      return { success: true, user: data.user }
    } catch (err) {
      setAuthError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  // ── LOGOUT ────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
    setCart([])
    setCoins(0)
  }, [])

  // ── REFRESH PROFILE depuis l'API ──────────────────────────────
  const refreshProfile = useCallback(async () => {
    if (!localStorage.getItem(TOKEN_KEY)) return
    try {
      const profile = await usersAPI.getProfile()
      const updated = { ...user, ...profile }
      localStorage.setItem(USER_KEY, JSON.stringify(updated))
      setUser(updated)
      setCoins(updated.coins ?? 0)
    } catch {
      // Token expiré → déconnexion silencieuse
      logout()
    }
  }, [user, logout])

  // ── PANIER ────────────────────────────────────────────────────
  const addToCart = useCallback((course) => {
    setCart((prev) => {
      const exists = prev.find((c) => c.id === course.id || c.title === course.title)
      if (exists) return prev
      return [...prev, course]
    })
  }, [])

  const removeFromCart = useCallback((courseId) => {
    setCart((prev) => prev.filter((c) => c.id !== courseId && c.title !== courseId))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  // ── COINS (local) ─────────────────────────────────────────────
  const spendCoins = useCallback((amount) => {
    setCoins((prev) => prev - amount)
    setUser((prev) => {
      if (!prev) return prev
      const updated = { ...prev, coins: (prev.coins ?? 0) - amount }
      localStorage.setItem(USER_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const addCoins = useCallback(async (amount) => {
    try {
      const data = await usersAPI.addCoins(amount)
      setCoins(data.coins)
      setUser((prev) => {
        if (!prev) return prev
        const updated = { ...prev, coins: data.coins }
        localStorage.setItem(USER_KEY, JSON.stringify(updated))
        return updated
      })
      return { success: true, coins: data.coins }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }, [])

  // ── UPDATE USER (après modif profil) ─────────────────────────
  const updateUser = useCallback((data) => {
    setUser((prev) => {
      const updated = { ...prev, ...data }
      localStorage.setItem(USER_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        coins,
        cart,
        loading,
        authError,
        login,
        logout,
        register,
        refreshProfile,
        updateUser,
        addToCart,
        removeFromCart,
        clearCart,
        spendCoins,
        addCoins,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}