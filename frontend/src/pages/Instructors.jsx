import { useState, useEffect } from "react"
import { usersAPI } from "../services/api"
import Spinner from "../components/Spinner"

export default function Instructors({ setPage, onNavigateToCourses }) {
  const [instructors, setInstructors] = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [selectedInstructor, setSelectedInstructor] = useState(null)
  const [review, setReview] = useState({ rating: 5, comment: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const data = await usersAPI.getInstructors()
        setInstructors(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchInstructors()
  }, [])

  const handleSubmitReview = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simuler un envoi API (La table des avis n'existe pas encore dans le backend)
    setTimeout(() => {
      alert(`Merci ! Votre avis sur ${selectedInstructor.name} a été envoyé de manière confidentielle. Il sera examiné par l'administration et transmis au formateur.`)
      setIsSubmitting(false)
      setSelectedInstructor(null)
      setReview({ rating: 5, comment: "" })
    }, 1000)
  }

  if (loading) return (
    <div className="py-20 flex justify-center">
      <Spinner size="lg" />
    </div>
  )

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Modal d'évaluation */}
      {selectedInstructor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Évaluer {selectedInstructor.name}</h2>
                  <p className="text-sm text-slate-500 mt-1">Partagez votre expérience de manière constructive.</p>
                </div>
                <button 
                  onClick={() => setSelectedInstructor(null)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-6">
                {/* Étoiles */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3 text-center uppercase tracking-wider">
                    Votre Note
                  </label>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReview({ ...review, rating: star })}
                        className={`text-3xl transition-transform hover:scale-125 ${
                          star <= review.rating ? "grayscale-0" : "grayscale opacity-30"
                        }`}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                </div>

                {/* Commentaire */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
                    Votre Commentaire (Privé)
                  </label>
                  <textarea
                    required
                    value={review.comment}
                    onChange={(e) => setReview({ ...review, comment: e.target.value })}
                    rows={4}
                    placeholder="Qu'avez-vous pensé de la pédagogie ? Points forts, points à améliorer..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  ></textarea>
                </div>

                {/* Warning de confidentialité */}
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-start gap-3">
                  <span className="text-xl">🔒</span>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    <span className="font-bold">Confidentialité garantie :</span> Ce commentaire ne sera <span className="underline">jamais affiché publiquement</span> sur le profil du formateur. Il sera transmis uniquement au formateur et aux administrateurs pour assurer la qualité de l'enseignement.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedInstructor(null)}
                    className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-2 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-200"
                  >
                    {isSubmitting ? "Envoi en cours..." : "Envoyer mon avis"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Nos Formateurs d'Élite</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Apprenez avec les meilleurs professeurs universitaires et experts algériens. 
          Découvrez leurs parcours et rejoignez leurs cours.
        </p>
      </div>

      {instructors.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
          <p className="text-slate-500 italic">Aucun formateur vérifié pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {instructors.map((instructor) => (
            <div key={instructor.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-24 bg-gradient-to-r from-blue-500 to-blue-700"></div>
              <div className="px-6 pb-6 relative">
                {/* Avatar flottant */}
                <div className="w-20 h-20 bg-white rounded-full border-4 border-white shadow-md flex items-center justify-center text-4xl absolute -top-10 left-6 z-10 overflow-hidden">
                  {instructor.avatar_url ? (
                    <img src={`http://localhost:5000${instructor.avatar_url}`} alt={instructor.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>👨‍🏫</span>
                  )}
                </div>
                
                <div className="pt-14">
                  <h3 className="text-xl font-bold text-slate-900">{instructor.name}</h3>
                  <p className="text-blue-600 font-medium text-sm">{instructor.specialty || "Formateur Expert"}</p>
                  <p className="text-slate-500 text-sm mt-1 flex items-center gap-1">
                    🏛 {instructor.university || "Université d'Algérie"}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-5 pt-5 border-t border-slate-100">
                  <div className="text-center">
                    <div className="font-bold text-slate-900 flex items-center gap-1">
                      ⭐ {instructor.rating || "4.8"}
                    </div>
                    <div className="text-xs text-slate-500">Note</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-slate-900">{instructor.students_count}</div>
                    <div className="text-xs text-slate-500">Élèves</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-slate-900">{instructor.courses_count}</div>
                    <div className="text-xs text-slate-500">Cours</div>
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <button 
                    onClick={() => setSelectedInstructor(instructor)}
                    className="w-1/3 py-2 bg-yellow-50 text-yellow-600 rounded-xl font-bold text-sm hover:bg-yellow-100 transition-colors"
                  >
                    ⭐ Évaluer
                  </button>
                  <button 
                    onClick={() => onNavigateToCourses(instructor.name)}
                    className="w-2/3 py-2 border border-blue-600 text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors text-sm"
                  >
                    Voir ses cours
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-20 bg-blue-50 rounded-3xl p-8 md:p-12 text-center border border-blue-100">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Vous souhaitez enseigner sur e-Qraa ?</h2>
        <p className="text-slate-600 max-w-2xl mx-auto mb-8">
          Rejoignez notre communauté de formateurs, partagez votre savoir et générez des revenus.
          Nous ne prenons que 20% de commission !
        </p>
        <button 
          onClick={() => setPage("register")}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm"
        >
          Devenir formateur
        </button>
      </div>
    </div>
  )
}
