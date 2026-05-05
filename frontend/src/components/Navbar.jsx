import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"

export default function Navbar({ page, setPage }) {
  // 1. On récupère "removeFromCart" depuis le contexte useAuth
  const { user, logout, cart, removeFromCart } = useAuth()
  const [showCart, setShowCart] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6">
      <div className="max-w-7xl mx-auto flex items-center gap-4 h-16">

        {/* Logo */}
        <div
          onClick={() => setPage("home")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">Q</span>
          </div>
          <span className="font-bold text-lg text-slate-900">
            e-<span className="text-blue-600">Qraa</span>
          </span>
        </div>

        {/* Liens */}
        <div className="flex gap-1 ml-4">
          {[
            { key: "home", label: "Accueil" },
            { key: "courses", label: "Cours" },
            { key: "instructors", label: "Formateurs" },
            { key: "about", label: "À propos" },
          ].map((link) => (
            <button
              key={link.key}
              onClick={() => setPage(link.key)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                page === link.key
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Barre de recherche */}
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Rechercher cours, formateurs..."
            className="w-full px-4 py-2 text-sm border border-slate-200 rounded-full focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Panier + Auth */}
        <div className="flex gap-2 ml-auto items-center">

          {/* Icône panier */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowCart(!showCart)
              }}
              className="relative p-2 rounded-lg hover:bg-slate-100 transition"
            >
              <span className="text-xl">🛒</span>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>

            {/* Dropdown panier */}
            {showCart && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-12 w-80 bg-white border border-slate-200 rounded-2xl shadow-lg p-4 z-50"
              >
                <h3 className="font-bold text-slate-900 mb-3">
                  Mon panier ({cart.length})
                </h3>
                {cart.length === 0 ? (
                  <p className="text-slate-400 text-sm text-center py-4">
                    Votre panier est vide
                  </p>
                ) : (
                  <>
                    {cart.map((course) => (
                      <div
                        key={course.title}
                        className="flex items-center justify-between py-2 border-b border-slate-100"
                      >
                        <div>
                          <div className="text-sm font-medium text-slate-900">
                            {course.title}
                          </div>
                          <div className="text-xs text-blue-600 font-semibold">
                            {course.price}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            // 2. On appelle la fonction pour supprimer le produit
                            if (removeFromCart) {
                              removeFromCart(course.title)
                            } else {
                              console.error("La fonction removeFromCart n'existe pas dans AuthContext")
                            }
                          }}
                          className="text-red-400 hover:text-red-600 text-xs font-bold px-2"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-900">Total</span>
                      <span className="text-blue-600 font-bold">
                        {cart.reduce((sum, c) => {
                          const price = parseInt(c.price.toString().replace(/\D/g, "")) || 0
                          return sum + price
                        }, 0)} DA
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setPage("cart")
                        setShowCart(false)
                      }}
                      className="w-full mt-3 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition"
                    >
                      Voir le panier
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Auth */}
          {user ? (
            <>
              <button
                onClick={() => setPage("dashboard")}
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                👤 {user.name.split(" ")[0]}
              </button>
              <button
                onClick={() => { logout(); setPage("home") }}
                className="px-4 py-2 text-sm font-medium border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setPage("login")}
                className="px-4 py-2 text-sm font-medium border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
              >
                Connexion
              </button>
              <button
                onClick={() => setPage("register")}
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                S'inscrire
              </button>
            </>
          )}
        </div>

      </div>
    </nav>
  )
}