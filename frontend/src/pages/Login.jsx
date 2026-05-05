import { useState } from "react"
import { useAuth } from "../context/AuthContext"

export default function Login({ setPage }) {
  const { login } = useAuth()
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student"
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.email) {
      newErrors.email = "L'email est requis."
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide."
    }
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis."
    } else if (formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères."
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      // Mock user login
      const user = {
        name: formData.email.split("@")[0],
        email: formData.email,
        role: formData.role
      }
      login(user)
      setPage("home")
    }
  }

  return (
    <div className="flex justify-center items-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow border border-slate-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Connexion</h2>
          <p className="mt-2 text-sm text-slate-500">
            Connectez-vous pour accéder à votre compte e-Qraa
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Rôle
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleChange({ target: { name: 'role', value: 'student' } })}
                className={`py-2 px-4 rounded-xl border text-sm font-medium transition-colors ${
                  formData.role === 'student'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Étudiant
              </button>
              <button
                type="button"
                onClick={() => handleChange({ target: { name: 'role', value: 'instructor' } })}
                className={`py-2 px-4 rounded-xl border text-sm font-medium transition-colors ${
                  formData.role === 'instructor'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Formateur
              </button>
            </div>
          </div>

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
              className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:outline-none transition-colors ${
                errors.email
                  ? 'border-red-400 focus:ring-red-100 focus:border-red-500'
                  : 'border-slate-200 focus:ring-blue-100 focus:border-blue-600'
              }`}
              placeholder="vous@exemple.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:outline-none transition-colors ${
                errors.password
                  ? 'border-red-400 focus:ring-red-100 focus:border-red-500'
                  : 'border-slate-200 focus:ring-blue-100 focus:border-blue-600'
              }`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm"
          >
            Se connecter
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Pas encore de compte ?{' '}
            <button
              onClick={() => setPage("register")}
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              S'inscrire
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
