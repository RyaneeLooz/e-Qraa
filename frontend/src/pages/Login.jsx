import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useGlobalToast } from "../App"
import Spinner from "../components/Spinner"

export default function Login() {
  const { login, loading } = useAuth()
  const toast = useGlobalToast()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState({})
  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotLoading, setForgotLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.email) newErrors.email = "L'email est requis."
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email invalide."
    if (!formData.password) newErrors.password = "Le mot de passe est requis."
    else if (formData.password.length < 6) newErrors.password = "Au moins 6 caractères."
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    const result = await login({ email: formData.email, password: formData.password })
    if (result.success) {
      toast.success(`Bienvenue, ${result.user.name} ! 👋`)
      // Redirection selon le rôle
      if (result.user.role === "admin") navigate("/admin")
      else navigate("/dashboard")
    } else {
      toast.error(result.error || "Identifiants incorrects.")
      setErrors({ password: result.error || "Email ou mot de passe incorrect." })
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    if (!forgotEmail) return
    setForgotLoading(true)
    try {
      const { authAPI } = await import("../services/api")
      await authAPI.forgotPassword(forgotEmail)
      toast.success("Email de réinitialisation envoyé !")
      setShowForgot(false)
    } catch (err) {
      toast.error(err.message || "Erreur lors de l'envoi.")
    } finally {
      setForgotLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Connexion</h1>
          <p className="mt-2 text-sm text-slate-500">
            Connectez-vous pour accéder à votre compte e-Qraa
          </p>
        </div>

        {!showForgot ? (
          <>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                  Adresse email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:outline-none transition-colors disabled:opacity-50 ${
                    errors.email
                      ? "border-red-400 focus:ring-red-100 focus:border-red-500"
                      : "border-slate-200 focus:ring-blue-100 focus:border-blue-600"
                  }`}
                  placeholder="vous@exemple.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              {/* Mot de passe */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                    Mot de passe
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:outline-none transition-colors disabled:opacity-50 ${
                    errors.password
                      ? "border-red-400 focus:ring-red-100 focus:border-red-500"
                      : "border-slate-200 focus:ring-blue-100 focus:border-blue-600"
                  }`}
                  placeholder="••••••••"
                />
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? <><Spinner size="sm" color="white" /> Connexion...</> : "Se connecter"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Pas encore de compte ?{" "}
                <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                  S'inscrire
                </Link>
              </p>
            </div>
          </>
        ) : (
          /* Formulaire Mot de passe oublié */
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">🔑</div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Réinitialiser votre mot de passe</h2>
              <p className="text-sm text-slate-500">Entrez votre email. Vous recevrez un lien de réinitialisation.</p>
            </div>
            <input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
              placeholder="votre@email.com"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-600 focus:outline-none"
            />
            <button
              type="submit"
              disabled={forgotLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {forgotLoading ? <><Spinner size="sm" color="white" /> Envoi...</> : "Envoyer le lien"}
            </button>
            <button
              type="button"
              onClick={() => setShowForgot(false)}
              className="w-full py-2 text-sm text-slate-500 hover:text-slate-700"
            >
              ← Retour à la connexion
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
