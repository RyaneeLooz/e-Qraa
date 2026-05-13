import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { coursesAPI, enrollmentsAPI } from "../services/api"
import { useGlobalToast } from "../App"
import Spinner from "../components/Spinner"

export default function CourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, coins, addToCart, spendCoins, isAuthenticated } = useAuth()
  const toast = useGlobalToast()

  const [course, setCourse]       = useState(null)
  const [loading, setLoading]     = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [enrolled, setEnrolled]   = useState(false)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const [data, enrollStatus] = await Promise.all([
          coursesAPI.getById(id),
          isAuthenticated ? enrollmentsAPI.checkEnrollment(id) : Promise.resolve({ enrolled: false })
        ])
        setCourse(data)
        setEnrolled(enrollStatus.enrolled)
      } catch {
        toast.error("Cours introuvable.")
        navigate("/courses")
      } finally {
        setLoading(false)
      }
    }
    fetchCourse()
  }, [id, isAuthenticated])

  const isGratuit = course?.price === 0
  const canAfford = coins >= (course?.price ?? 0)

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.info("Connectez-vous pour vous inscrire.")
      navigate("/login")
      return
    }
    if (!canAfford && !isGratuit) {
      toast.warning("Solde insuffisant. Rechargez vos Coins.")
      return
    }

    setEnrolling(true)
    try {
      await enrollmentsAPI.enroll(course.id)
      if (!isGratuit) spendCoins(course.price)
      setEnrolled(true)
      toast.success(`🎉 Inscription à "${course.title}" réussie !`)
    } catch (err) {
      toast.error(err.message || "Erreur lors de l'inscription.")
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) return <Spinner fullPage />

  if (!course) return null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
        <Link to="/" className="hover:text-blue-600">Accueil</Link>
        <span>/</span>
        <Link to="/courses" className="hover:text-blue-600">Cours</Link>
        <span>/</span>
        <span className="text-slate-800 font-medium truncate">{course.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* ── Infos principales ────────────────────────────── */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div>
            <span className="inline-block text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full mb-4">
              {course.category}
            </span>
            <h1 className="text-3xl font-black text-slate-900 mb-4">{course.title}</h1>
            <p className="text-slate-600 leading-relaxed text-lg">
              {course.description || "Aucune description disponible pour ce cours."}
            </p>
          </div>

          {/* Formateur */}
          <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
              {course.instructor_name?.[0] ?? "?"}
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-1">Formateur</p>
              <p className="font-bold text-slate-900 text-lg">{course.instructor_name}</p>
              {course.instructor_bio && (
                <p className="text-sm text-slate-500 mt-1">{course.instructor_bio}</p>
              )}
            </div>
          </div>

          {/* Vidéo de présentation */}
          {course.video_url && (
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-black aspect-video">
              <video
                controls
                className="w-full h-full"
                src={`http://localhost:5000${course.video_url}`}
              />
            </div>
          )}

          {/* Ce que vous apprendrez */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Ce que vous apprendrez</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Maîtriser les concepts fondamentaux",
                "Réaliser des projets pratiques",
                "Obtenir une certification reconnue",
                "Accéder aux ressources à vie",
                "Support de l'instructeur inclus",
                "Contenu mis à jour régulièrement",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-blue-600 font-bold mt-0.5">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Carte d'achat ─────────────────────────────────── */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
            {/* Miniature */}
            <div className="h-44 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-6xl">
              {course.thumbnail_url
                ? <img src={`http://localhost:5000${course.thumbnail_url}`} alt={course.title} className="h-full w-full object-cover" />
                : "📚"
              }
            </div>

            <div className="p-6 space-y-5">
              {/* Prix */}
              <div className="flex items-baseline gap-2">
                {isGratuit ? (
                  <span className="text-3xl font-black text-green-600">Gratuit 🎓</span>
                ) : (
                  <>
                    <span className="text-3xl font-black text-yellow-600">{course.price}</span>
                    <span className="text-lg font-bold text-yellow-500">Coins</span>
                  </>
                )}
              </div>

              {/* Solde utilisateur */}
              {isAuthenticated && user?.role === "student" && !isGratuit && (
                <div className={`text-sm p-3 rounded-xl font-medium ${canAfford ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                  {canAfford
                    ? `✓ Votre solde est suffisant (${coins} Coins)`
                    : `⚠️ Solde insuffisant — il vous manque ${course.price - coins} Coins`
                  }
                </div>
              )}

              {/* Bouton inscription */}
              {enrolled ? (
                <div className="w-full py-3 bg-green-100 text-green-700 font-bold rounded-xl text-center">
                  ✓ Inscrit avec succès !
                </div>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling || (!isGratuit && !canAfford && isAuthenticated)}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {enrolling
                    ? <><Spinner size="sm" color="white" /> Inscription...</>
                    : isGratuit
                      ? "S'inscrire gratuitement"
                      : isAuthenticated
                        ? `S'inscrire pour ${course.price} Coins`
                        : "Se connecter pour s'inscrire"
                  }
                </button>
              )}

              <button
                onClick={() => { addToCart(course); toast.success("Ajouté au panier !") }}
                className="w-full py-3 border-2 border-blue-600 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition"
              >
                + Ajouter au panier
              </button>

              {/* Détails rapides */}
              <div className="space-y-2 pt-4 border-t border-slate-100">
                {[
                  { icon: "🏷️", label: "Catégorie", value: course.category },
                  { icon: "👨‍🏫", label: "Formateur", value: course.instructor_name },
                  { icon: "📅", label: "Ajouté le", value: course.created_at ? new Date(course.created_at).toLocaleDateString("fr-DZ") : "N/A" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 flex items-center gap-1.5">{item.icon} {item.label}</span>
                    <span className="font-medium text-slate-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
