import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"

export default function Navbar({ page, setPage }) {
  // 1. On récupère "removeFromCart" depuis le contexte useAuth
  const { user, logout, cart, removeFromCart, coins, addCoins } = useAuth()
  const [showCart, setShowCart] = useState(false)
  const [showCoins, setShowCoins] = useState(false)
  const [showMobile, setShowMobile] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6">
      <div className="max-w-7xl mx-auto flex items-center gap-4 h-16">

        {/* Logo */}
        <div
          onClick={() => setPage("home")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
              <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.939.69 5.25 1.936V4.533z" />
              <path d="M12.75 4.533v16.153a8.215 8.215 0 015.25-1.936 8.237 8.237 0 012.75.462.75.75 0 001-.707V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533z" />
            </svg>
          </div>
          <span className="font-bold text-xl text-slate-900 tracking-tight">
            e-<span className="text-blue-600">Qraa</span>
          </span>
        </div>

        {/* Liens desktop */}
        <div className="hidden md:flex gap-1 ml-4">
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
          {user && user.role === 'admin' && (
            <button
              onClick={() => setPage("admin")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                page === "admin"
                  ? "bg-red-50 text-red-600"
                  : "text-red-500 hover:bg-red-50"
              }`}
            >
              ⚙️ Admin
            </button>
          )}
        </div>

        {/* Barre de recherche desktop */}
        <div className="hidden md:block flex-1 max-w-md">
          <input
            type="text"
            placeholder="Rechercher cours, formateurs..."
            className="w-full px-4 py-2 text-sm border border-slate-200 rounded-full focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Panier + Auth */}
        <div className="flex gap-2 ml-auto items-center">

          {/* Icône Coins (Recharge) - Uniquement pour les étudiants */}
          {user && user.role === 'student' && (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowCoins(!showCoins)
                  setShowCart(false)
                }}
                className="flex items-center gap-4 px-4 py-2 bg-yellow-400 text-slate-900 rounded-xl hover:bg-yellow-500 transition shadow-sm border border-yellow-500/20"
              >
                <span className="text-lg leading-none filter drop-shadow-sm">🟡</span>
                <span className="font-bold text-sm leading-none">{coins}</span>
                <span className="hidden md:inline text-[10px] font-bold uppercase opacity-70 ml-2">Recharger</span>
              </button>

              {showCoins && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-12 w-80 md:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl p-5 z-50"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                      <span className="text-xl">🟡</span> Boutique Coins
                    </h3>
                    <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      SOLDE: {coins}
                    </span>
                  </div>

                  {/* Packs */}
                  <div className="space-y-2 mb-6">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Packs de recharge</p>
                    {[
                      { coins: 1490, price: "1200 DA", label: "Pack Découverte" },
                      { coins: 3990, price: "2900 DA", bonus: "Plus Populaire", label: "+990 offerts" },
                      { coins: 9990, price: "6500 DA", bonus: "Meilleure Valeur", label: "+3490 offerts" },
                    ].map((pack, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-yellow-300 transition-colors cursor-pointer group">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-yellow-600">{pack.coins} 🟡</span>
                            {pack.bonus && <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-bold uppercase">{pack.bonus}</span>}
                          </div>
                          <span className="text-[9px] text-slate-400 font-medium">{pack.label}</span>
                        </div>
                        <button 
                          onClick={() => alert(`Redirection vers paiement sécurisé pour ${pack.price}`)}
                          className="px-3 py-1 bg-white border border-slate-200 text-xs font-bold rounded-lg group-hover:bg-yellow-500 group-hover:text-white group-hover:border-yellow-500 transition-all"
                        >
                          {pack.price}
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Code Promo / Scratch Card */}
                  <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                    <p className="text-[10px] font-bold text-yellow-800 uppercase tracking-wider mb-2">Carte prépayée / Code promo</p>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="QRAA-XXXX-XXXX" 
                        className="flex-1 px-3 py-2 text-sm border border-yellow-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white uppercase font-mono"
                      />
                      <button 
                        onClick={() => {
                          addCoins(500)
                          alert("Code validé ! +500 Coins ajoutés à votre compte.")
                          setShowCoins(false)
                        }}
                        className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        Activer
                      </button>
                    </div>
                    <p className="text-[9px] text-yellow-600 mt-2 italic text-center">
                      Les codes sont disponibles chez nos points de vente partenaires.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Icône panier - Masquée pour les formateurs */}
          {(!user || user.role === 'student') && (
            <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowCart(!showCart)
                setShowCoins(false)
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
                          <div className="text-xs text-yellow-600 font-semibold">
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
                      <span className="text-yellow-600 font-bold">
                        {cart.reduce((sum, c) => {
                          const price = parseInt(c.price.toString().replace(/\D/g, "")) || 0
                          return sum + price
                        }, 0)} Coins
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
          )}

          {/* Auth */}
          {user ? (
            <>
              <button
                onClick={() => setPage("dashboard")}
                className="hidden md:block px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                👤 {user.name.split(" ")[0]}
              </button>
              <button
                onClick={() => { logout(); setPage("home") }}
                className="hidden md:block px-4 py-2 text-sm font-medium border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setPage("login")}
                className="hidden md:block px-4 py-2 text-sm font-medium border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
              >
                Connexion
              </button>
              <button
                onClick={() => setPage("register")}
                className="hidden md:block px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                S'inscrire
              </button>
            </>
          )}

          {/* Hamburger mobile */}
          <button
            onClick={() => setShowMobile(!showMobile)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-slate-700">
              {showMobile ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>

      </div>

      {/* Menu mobile */}
      {showMobile && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pb-4">
          {/* Recherche mobile */}
          <div className="py-3">
            <input
              type="text"
              placeholder="Rechercher cours, formateurs..."
              className="w-full px-4 py-2 text-sm border border-slate-200 rounded-full focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Liens */}
          <div className="flex flex-col gap-1">
            {[
              { key: "home", label: "Accueil" },
              { key: "courses", label: "Cours" },
              { key: "instructors", label: "Formateurs" },
              { key: "about", label: "À propos" },
            ].map((link) => (
              <button
                key={link.key}
                onClick={() => { setPage(link.key); setShowMobile(false) }}
                className={`px-3 py-2 rounded-lg text-sm font-medium text-left transition-all ${
                  page === link.key
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Auth mobile */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <>
                {user.role === 'student' && (
                  <div className="flex items-center justify-between px-3 py-2 bg-yellow-50 rounded-xl">
                    <span className="text-sm font-bold text-yellow-700">🟡 {coins} Coins</span>
                  </div>
                )}
                <button
                  onClick={() => { setPage("dashboard"); setShowMobile(false) }}
                  className="px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg text-left"
                >
                  👤 {user.name} &mdash; Tableau de bord
                </button>
                <button
                  onClick={() => { logout(); setPage("home"); setShowMobile(false) }}
                  className="px-4 py-2 text-sm font-medium border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setPage("login"); setShowMobile(false) }}
                  className="px-4 py-2 text-sm font-medium border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
                >
                  Connexion
                </button>
                <button
                  onClick={() => { setPage("register"); setShowMobile(false) }}
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  S'inscrire
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}