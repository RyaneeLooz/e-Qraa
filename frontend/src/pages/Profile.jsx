import { useState, useRef } from "react"
import { useAuth } from "../context/AuthContext"
import { usersAPI } from "../services/api"
import { useGlobalToast } from "../App"
import Spinner from "../components/Spinner"

export default function Profile() {
  const { user, updateUser } = useAuth()
  const toast = useGlobalToast()
  const fileInputRef = useRef()

  const [formData, setFormData] = useState({
    name:       user?.name       ?? "",
    bio:        user?.bio        ?? "",
    university: user?.university ?? "",
    specialty:  user?.specialty  ?? "",
  })
  const [saving, setSaving]           = useState(false)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar_url ? `http://localhost:5000${user.avatar_url}` : null
  )

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) { toast.error("Le nom est requis."); return }
    setSaving(true)
    try {
      const updated = await usersAPI.updateProfile(formData)
      updateUser(updated)
      toast.success("Profil mis à jour avec succès !")
    } catch (err) {
      toast.error(err.message || "Erreur lors de la mise à jour.")
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith("image/")) { toast.error("Veuillez sélectionner une image."); return }
    if (file.size > 5 * 1024 * 1024) { toast.error("L'image ne doit pas dépasser 5 Mo."); return }

    // Aperçu local immédiat
    setAvatarPreview(URL.createObjectURL(file))
    setAvatarLoading(true)

    try {
      const fd = new FormData()
      fd.append("avatar", file)
      const result = await usersAPI.uploadAvatar(fd)
      updateUser({ avatar_url: result.avatar_url })
      toast.success("Photo de profil mise à jour !")
    } catch (err) {
      toast.error(err.message || "Erreur lors du téléchargement.")
      setAvatarPreview(null)
    } finally {
      setAvatarLoading(false)
    }
  }

  const roleLabel = {
    student:    { label: "Étudiant",  color: "bg-blue-100 text-blue-700" },
    instructor: { label: "Formateur", color: "bg-green-100 text-green-700" },
    admin:      { label: "Admin",     color: "bg-red-100 text-red-700" },
  }
  const role = roleLabel[user?.role] ?? roleLabel.student

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Mon Profil</h1>
        <p className="text-slate-500 mt-1">Gérez vos informations personnelles et votre photo.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* ── Header avec avatar ─────────────────────────────── */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-500 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-blue-100 flex items-center justify-center overflow-hidden">
                {avatarLoading ? (
                  <Spinner size="md" color="blue" />
                ) : avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-blue-600">
                    {user?.name?.[0]?.toUpperCase() ?? "?"}
                  </span>
                )}
              </div>
              {/* Bouton changer photo */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition shadow-md"
                title="Changer la photo"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/>
                  <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                </svg>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>
          </div>
        </div>

        {/* ── Infos ───────────────────────────────────────────── */}
        <div className="pt-16 px-8 pb-8">
          <div className="flex items-center gap-3 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
              <p className="text-slate-500 text-sm">{user?.email}</p>
            </div>
            <span className={`ml-2 text-xs font-bold px-3 py-1 rounded-full ${role.color}`}>
              {role.label}
            </span>
            {user?.is_verified && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-700">
                ✓ Vérifié
              </span>
            )}
          </div>

          {/* ── Formulaire ──────────────────────────────────── */}
          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nom complet *</label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-600 focus:outline-none transition"
                  placeholder="Votre nom"
                />
              </div>

              {/* Université (étudiant/instructeur) */}
              {(user?.role === "student" || user?.role === "instructor") && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Université / Établissement</label>
                  <input
                    name="university"
                    type="text"
                    value={formData.university}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-600 focus:outline-none transition"
                    placeholder="Ex: USTHB, ESI..."
                  />
                </div>
              )}
            </div>

            {/* Spécialité (formateur) */}
            {user?.role === "instructor" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Spécialité / Matière enseignée</label>
                <input
                  name="specialty"
                  type="text"
                  value={formData.specialty}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-600 focus:outline-none transition"
                  placeholder="Ex: Développement Web, Mathématiques..."
                />
              </div>
            )}

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Bio / À propos</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-600 focus:outline-none transition resize-none"
                placeholder="Parlez de vous en quelques mots..."
              />
            </div>

            {/* Email (lecture seule) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Adresse email</label>
              <input
                type="email"
                value={user?.email ?? ""}
                readOnly
                className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-400 cursor-not-allowed"
              />
              <p className="text-xs text-slate-400 mt-1">L'email ne peut pas être modifié.</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition flex items-center gap-2 disabled:opacity-60"
              >
                {saving ? <><Spinner size="sm" color="white" /> Enregistrement...</> : "Enregistrer les modifications"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ── Zone danger ─────────────────────────────────────── */}
      <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-6">
        <h3 className="text-base font-bold text-red-800 mb-1">Zone de danger</h3>
        <p className="text-sm text-red-600 mb-4">
          La suppression du compte est irréversible. Toutes vos données seront perdues.
        </p>
        <button
          onClick={() => toast.warning("Contactez l'administrateur pour supprimer votre compte.")}
          className="px-5 py-2 border border-red-400 text-red-600 text-sm font-bold rounded-xl hover:bg-red-100 transition"
        >
          Supprimer mon compte
        </button>
      </div>
    </div>
  )
}
