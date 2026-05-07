import { useState } from "react"

const CATEGORIES = [
  "Développement Web",
  "Design",
  "Data & IA",
  "Dev Mobile",
  "Cours Universitaires"
]

export default function CourseForm({ initialData, onSubmit, onCancel }) {
  const [activeTab, setActiveTab] = useState("infos")
  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      description: "",
      category: "",
      duration: "",
      price: "",
      location: "En ligne",
      startDate: "",
      status: "Actif",
      videos: [{ title: "", url: "" }],
      quizzes: [{ question: "", options: ["", "", ""], correctAnswer: 0 }]
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

  // --- Gestion Vidéos ---
  const addVideo = () => {
    setFormData(prev => ({
      ...prev,
      videos: [...prev.videos, { title: "", url: "" }]
    }))
  }

  const updateVideo = (index, field, value) => {
    const newVideos = [...formData.videos]
    newVideos[index][field] = value
    setFormData(prev => ({ ...prev, videos: newVideos }))
  }

  const removeVideo = (index) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index)
    }))
  }

  // --- Gestion QCM ---
  const addQuiz = () => {
    setFormData(prev => ({
      ...prev,
      quizzes: [...prev.quizzes, { question: "", options: ["", "", ""], correctAnswer: 0 }]
    }))
  }

  const updateQuiz = (qIdx, field, value) => {
    const newQuizzes = [...formData.quizzes]
    newQuizzes[qIdx][field] = value
    setFormData(prev => ({ ...prev, quizzes: newQuizzes }))
  }

  const updateOption = (qIdx, oIdx, value) => {
    const newQuizzes = [...formData.quizzes]
    newQuizzes[qIdx].options[oIdx] = value
    setFormData(prev => ({ ...prev, quizzes: newQuizzes }))
  }

  const removeQuiz = (index) => {
    setFormData(prev => ({
      ...prev,
      quizzes: prev.quizzes.filter((_, i) => i !== index)
    }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = "Le titre est requis."
    if (!formData.category) newErrors.category = "Veuillez sélectionner une catégorie."
    
    if (!formData.price && formData.category !== "Cours Universitaires") {
      newErrors.price = "Le prix est requis."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  const priceNum = Number(formData.price) || 0
  const commission = priceNum * 0.20
  const netIncome = priceNum - commission

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold text-slate-900">
          {initialData ? "Modifier le cours" : "Créer un nouveau cours"}
        </h2>
        
        {/* Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab("infos")}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === "infos" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            📋 Infos de base
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("content")}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === "content" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            🎥 Vidéos & QCM
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {activeTab === "infos" ? (
          <div className="space-y-6">
            {/* Titre et Catégorie */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Titre du cours</label>
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
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Catégorie</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-colors bg-white"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-colors resize-none"
                placeholder="Décrivez le contenu..."
              />
            </div>

            {/* Prix et Modèle économique */}
            {formData.category !== "Cours Universitaires" && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-4">Modèle économique</h3>
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <div className="w-full md:w-1/3">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Prix (Coins)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-colors"
                      placeholder="Ex: 2500"
                    />
                  </div>
                  {formData.price && (
                    <div className="flex-1 flex gap-4 text-xs font-medium">
                      <div className="bg-white p-3 rounded-lg border border-slate-200 flex-1">
                        <div className="text-slate-500">Commission (20%)</div>
                        <div className="text-red-500">-{commission.toFixed(0)} Coins</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-slate-200 flex-1">
                        <div className="text-slate-500">Net pour vous</div>
                        <div className="text-green-600">+{netIncome.toFixed(0)} Coins</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-10">
            {/* Section Vidéos */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm">1</span>
                  Vidéos du cours
                </h3>
                <button 
                  type="button" 
                  onClick={addVideo}
                  className="text-sm font-bold text-blue-600 hover:text-blue-700"
                >
                  + Ajouter une vidéo
                </button>
              </div>
              
              <div className="space-y-3">
                {formData.videos.map((video, idx) => (
                  <div key={idx} className="flex gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 relative group">
                    <div className="flex-1 space-y-2">
                      <input 
                        type="text" 
                        placeholder="Titre de la vidéo (ex: Introduction)"
                        value={video.title}
                        onChange={(e) => updateVideo(idx, "title", e.target.value)}
                        className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <input 
                        type="text" 
                        placeholder="Lien vidéo (YouTube, Cloudinary, etc.)"
                        value={video.url}
                        onChange={(e) => updateVideo(idx, "url", e.target.value)}
                        className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-xs"
                      />
                    </div>
                    {formData.videos.length > 1 && (
                      <button 
                        onClick={() => removeVideo(idx)}
                        className="text-red-400 hover:text-red-600 p-2"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Section QCM */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center text-sm">2</span>
                  Système de QCM (Quizz)
                </h3>
                <button 
                  type="button" 
                  onClick={addQuiz}
                  className="text-sm font-bold text-yellow-600 hover:text-yellow-700"
                >
                  + Ajouter une question
                </button>
              </div>

              <div className="space-y-6">
                {formData.quizzes.map((quiz, qIdx) => (
                  <div key={qIdx} className="p-5 bg-white border-2 border-slate-100 rounded-2xl relative">
                    <div className="flex justify-between mb-3">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Question {qIdx + 1}</span>
                      {formData.quizzes.length > 1 && (
                        <button onClick={() => removeQuiz(qIdx)} className="text-slate-400 hover:text-red-500 text-xs">Supprimer</button>
                      )}
                    </div>
                    <input 
                      type="text" 
                      placeholder="Posez votre question ici..."
                      value={quiz.question}
                      onChange={(e) => updateQuiz(qIdx, "question", e.target.value)}
                      className="w-full px-4 py-2 mb-4 font-medium text-slate-900 border border-slate-200 rounded-xl focus:ring-1 focus:ring-yellow-500 outline-none transition-all"
                    />
                    
                    <div className="space-y-2">
                      {quiz.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center gap-3">
                          <input 
                            type="radio" 
                            name={`correct-${qIdx}`}
                            checked={quiz.correctAnswer === oIdx}
                            onChange={() => updateQuiz(qIdx, "correctAnswer", oIdx)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <input 
                            type="text" 
                            placeholder={`Option ${oIdx + 1}`}
                            value={opt}
                            onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                            className={`flex-1 px-3 py-1.5 text-sm border rounded-lg focus:outline-none ${
                              quiz.correctAnswer === oIdx ? 'bg-green-50 border-green-200' : 'border-slate-200'
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-slate-500 font-medium hover:text-slate-700 transition"
            >
              Annuler
            </button>
          )}
          <button
            type="submit"
            className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-95"
          >
            {initialData ? "Enregistrer" : "Publier le cours"}
          </button>
        </div>
      </form>
    </div>
  )
}
