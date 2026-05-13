import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { enrollmentsAPI } from "../services/api"
import { useGlobalToast } from "../App"
import Spinner from "../components/Spinner"

export default function Cart({ setPage }) {
  const { cart, removeFromCart, user, coins, refreshUser } = useAuth()
  const toast = useGlobalToast()
  const [isProcessing, setIsProcessing] = useState(false)

  // Calcul du total
  const totalPrice = cart.reduce((sum, course) => {
    return sum + (course.price || 0)
  }, 0)

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Veuillez vous connecter pour passer commande.")
      setPage("login")
      return
    }
    
    if (coins < totalPrice) {
      toast.error(`Solde insuffisant ! Vous avez ${coins} 🟡 mais le total est de ${totalPrice} 🟡.`)
      return
    }

    setIsProcessing(true)
    try {
      // On boucle sur le panier
      for (const course of cart) {
        await enrollmentsAPI.enroll(course.id)
      }
      
      toast.success("Commande réussie ! Vos cours ont été ajoutés à votre compte.")
      
      // Vider le panier
      cart.forEach(c => removeFromCart(c.id))
      
      // Rafraîchir les infos utilisateur (coins)
      await refreshUser()
      
      setPage("dashboard")
    } catch (err) {
      toast.error(err.message || "Erreur lors du paiement")
    } finally {
      setIsProcessing(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="py-20 px-4 text-center max-w-xl mx-auto">
        <div className="text-6xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Votre panier est vide</h2>
        <p className="text-slate-500 mb-8">
          Découvrez nos formations et ajoutez des cours pour commencer à apprendre.
        </p>
        <button
          onClick={() => setPage("courses")}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm"
        >
          Explorer les cours
        </button>
      </div>
    )
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Mon Panier</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Liste des cours */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((course) => (
            <div 
              key={course.id} 
              className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
            >
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 bg-blue-50 text-3xl rounded-xl flex items-center justify-center overflow-hidden">
                  {course.thumbnail_url ? (
                    <img src={`http://localhost:5000${course.thumbnail_url}`} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <span>🎓</span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{course.title}</h3>
                  <div className="text-sm text-slate-500 mt-1">
                    <span className="inline-block px-2 py-1 bg-slate-100 rounded-md mr-2 text-xs font-medium">
                      {course.category}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between w-full sm:w-auto gap-6 mt-4 sm:mt-0">
                <div className="text-xl font-bold text-yellow-500">{course.price} 🟡</div>
                <button
                  onClick={() => removeFromCart(course.id)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Retirer du panier"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Résumé de la commande */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Résumé de la commande</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-slate-600">
                <span>Total partiel ({cart.length} cours)</span>
                <span>{totalPrice} 🟡</span>
              </div>
              <div className="flex justify-between text-green-600 text-sm font-medium">
                <span>Frais de plateforme</span>
                <span>Inclus</span>
              </div>
              <div className="border-t border-slate-100 pt-4 mt-4">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-slate-900">Total à payer</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-500">{totalPrice} 🟡</div>
                  </div>
                </div>
              </div>
            </div>

            {user ? (
              <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-700">Mon solde e-Qraa :</span>
                  <span className="font-bold text-yellow-500">{coins} 🟡</span>
                </div>
                {coins < totalPrice && (
                  <p className="text-xs text-red-500 font-medium">
                    Solde insuffisant. Vous devez recharger {totalPrice - coins} 🟡.
                  </p>
                )}
              </div>
            ) : (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-100 text-blue-800 text-sm rounded-xl">
                Connectez-vous pour payer avec vos Coins.
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={isProcessing || (user && coins < totalPrice)}
              className={`w-full py-3 px-4 font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 ${
                user && coins >= totalPrice
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-slate-800 hover:bg-slate-900 text-white disabled:opacity-50'
              }`}
            >
              {isProcessing ? <Spinner size="sm" color="white" /> : (user && coins >= totalPrice ? "Payer avec mes Coins" : "Passer à la caisse")}
            </button>
            
            <p className="text-xs text-center text-slate-400 mt-4">
              Paiement 100% sécurisé via e-Qraa. 
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
