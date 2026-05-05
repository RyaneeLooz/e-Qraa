import { useState } from "react"

const CATEGORIES = [
  "Développement Web",
  "Design",
  "Data & IA",
  "Dev Mobile",
  "Cours Universitaires"
]

export default function CourseForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      description: "",
      category: "",
      duration: "",
      price: "",
      location: "",
      startDate: "",
      status: "Actif"
    }
  )

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
    if (!formData.title.trim()) newErrors.title = "Le titre est requis."
    if (!formData.description.trim()) newErrors.description = "La description est requise."
    if (!formData.category) newErrors.category = "Veuillez sélectionner une catégorie."
    if (!formData.duration.trim()) newErrors.duration = "La durée est requise (ex: 30h)."
    
    if (!formData.price) {
      newErrors.price = "Le prix est requis."
    } else if (isNaN(formData.price) || Number(formData.price) < 0) {
      newErrors.price = "Le prix doit être un nombre positif."
    }

    if (!formData.location.trim()) newErrors.location = "La localisation (ou 'En ligne') est requise."
    if (!formData.startDate) newErrors.startDate = "La date de début est requise."

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  // Calculs liés au prix (Commission 20%)
  const priceNum = Number(formData.price) || 0
  const commission = priceNum * 0.20
  const netIncome = priceNum - commission

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        {initialData ? "Modifier le cours" : "Créer un nouveau cours"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Titre et Catégorie */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Titre du cours
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:outline-none transition-colors ${
                errors.title ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-blue-100 focus:border-blue-600'
              }`}
              placeholder="Ex: React pour les débutants"
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Catégorie
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:outline-none transition-colors bg-white ${
                errors.category ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-blue-100 focus:border-blue-600'
              }`}
            >
              <option value="">Sélectionner une catégorie</option>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:outline-none transition-colors resize-none ${
              errors.description ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-blue-100 focus:border-blue-600'
            }`}
            placeholder="Décrivez le contenu et les objectifs du cours..."
          />
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
        </div>

        {/* Durée, Localisation, Date de début, Statut */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Durée
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:outline-none transition-colors ${
                errors.duration ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-blue-100 focus:border-blue-600'
              }`}
              placeholder="Ex: 30h, 4 semaines"
            />
            {errors.duration && <p className="mt-1 text-sm text-red-500">{errors.duration}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Localisation
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:outline-none transition-colors ${
                errors.location ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-blue-100 focus:border-blue-600'
              }`}
              placeholder="Ex: En ligne, Alger, Oran..."
            />
            {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Date de début
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:outline-none transition-colors ${
                errors.startDate ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-blue-100 focus:border-blue-600'
              }`}
            />
            {errors.startDate && <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Statut
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-colors bg-white"
            >
              <option value="Actif">Actif</option>
              <option value="Terminé">Terminé</option>
            </select>
          </div>
        </div>

        {/* Prix et Modèle économique */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">Modèle économique</h3>
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Prix (DA)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:outline-none transition-colors ${
                  errors.price ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-blue-100 focus:border-blue-600'
                }`}
                placeholder="Ex: 2500"
              />
              {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
            </div>

            {formData.price && !errors.price && (
              <div className="flex-1 flex gap-4 text-sm">
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex-1">
                  <div className="text-slate-500">Commission e-Qraa (20%)</div>
                  <div className="font-bold text-red-500">-{commission.toFixed(2)} DA</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex-1">
                  <div className="text-slate-500">Vos revenus nets</div>
                  <div className="font-bold text-green-600">{netIncome.toFixed(2)} DA</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm"
          >
            {initialData ? "Enregistrer les modifications" : "Créer le cours"}
          </button>
        </div>
      </form>
    </div>
  )
}
