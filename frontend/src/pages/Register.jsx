import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useGlobalToast } from "../App"
import Spinner from "../components/Spinner"

export default function Register() {
  const { register, loading } = useAuth()
  const toast = useGlobalToast()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    university: "",
    specialty: "",
    idCard: ""
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis."
    }
    if (!formData.email) {
      newErrors.email = "L'email est requis."
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide."
    }
    if (formData.role === 'student' && !formData.university) {
      newErrors.university = "Veuillez sélectionner votre université."
    }
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis."
    } else if (formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères."
    }
    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas."
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    })

    if (result.success) {
      toast.success(result.user.role === 'instructor'
        ? 'Compte créé ! En attente de vérification par l\'admin.'
        : 'Compte créé avec succès ! Bienvenue 🎉'
      )
      navigate('/dashboard')
    } else {
      toast.error(result.error || 'Erreur lors de la création du compte.')
    }
  }

  return (
    <div className="flex justify-center items-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full bg-white p-8 rounded-2xl shadow border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Créer un compte</h1>
          <p className="mt-2 text-sm text-slate-500">
            Rejoignez e-Qraa pour apprendre ou enseigner
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sélecteur de rôle visuel (Cards cliquables) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Je souhaite...
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleChange({ target: { name: 'role', value: 'student' } })}
                className={`p-4 rounded-xl border text-left transition-all ${
                  formData.role === 'student'
                    ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold text-slate-900 mb-1">Apprendre</div>
                <div className="text-xs text-slate-500">Acheter et suivre des cours en ligne</div>
              </button>
              
              <button
                type="button"
                onClick={() => handleChange({ target: { name: 'role', value: 'instructor' } })}
                className={`p-4 rounded-xl border text-left transition-all ${
                  formData.role === 'instructor'
                    ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold text-slate-900 mb-1">Enseigner</div>
                <div className="text-xs text-slate-500">Créer et vendre mes propres cours</div>
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
              Nom complet
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:outline-none transition-colors ${
                errors.name
                  ? 'border-red-400 focus:ring-red-100 focus:border-red-500'
                  : 'border-slate-200 focus:ring-blue-100 focus:border-blue-600'
              }`}
              placeholder="Ex: Amine Benali"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          {formData.role === 'instructor' && (
            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Spécialité / Matière enseignée
                </label>
                <input
                  name="specialty"
                  type="text"
                  required
                  value={formData.specialty}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-600 focus:outline-none transition-colors"
                  placeholder="ex: Mathématiques, Développement Web..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Justificatif (Numéro de carte prof / Diplôme)
                </label>
                <input
                  name="idCard"
                  type="text"
                  required
                  value={formData.idCard}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-600 focus:outline-none transition-colors"
                  placeholder="Numéro de document pour vérification"
                />
                <p className="mt-1.5 text-[10px] text-slate-500 italic">
                  🛡️ Votre compte sera vérifié manuellement par nos administrateurs avant toute publication.
                </p>
              </div>
            </div>
          )}

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
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>

          {formData.role === 'student' && (
            <div>
              <label htmlFor="university" className="block text-sm font-medium text-slate-700 mb-1">
                Université / Établissement
              </label>
              <select
                id="university"
                name="university"
                value={formData.university}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:outline-none transition-colors bg-white ${
                  errors.university
                    ? 'border-red-400 focus:ring-red-100 focus:border-red-500'
                    : 'border-slate-200 focus:ring-blue-100 focus:border-blue-600'
                }`}
              >
                <option value="">Sélectionnez votre université</option>
                <option value="USTHB">USTHB (Bab Ezzouar)</option>
                <option value="ESI">ESI (Oued Smar)</option>
                <option value="Univ_Alger1">Université d'Alger 1</option>
                <option value="Univ_Oran">Université d'Oran</option>
                <option value="Autre">Autre / Autodidacte</option>
              </select>
              {errors.university && <p className="mt-1 text-sm text-red-500">{errors.university}</p>}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                Confirmer
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:outline-none transition-colors ${
                  errors.confirmPassword
                    ? 'border-red-400 focus:ring-red-100 focus:border-red-500'
                    : 'border-slate-200 focus:ring-blue-100 focus:border-blue-600'
                }`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <><Spinner size="sm" color="white" /> Création...</> : "S'inscrire"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
