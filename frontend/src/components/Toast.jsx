import { useEffect, useState } from "react"

// ─── Toast individuel ─────────────────────────────────────────
function ToastItem({ id, type, message, onClose }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Animation d'entrée
    const enterTimer = setTimeout(() => setVisible(true), 10)
    // Auto-fermeture après 4s
    const exitTimer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onClose(id), 300)
    }, 4000)
    return () => { clearTimeout(enterTimer); clearTimeout(exitTimer) }
  }, [id, onClose])

  const styles = {
    success: { bg: "bg-green-600", icon: "✓" },
    error:   { bg: "bg-red-600",   icon: "✕" },
    info:    { bg: "bg-blue-600",  icon: "ℹ" },
    warning: { bg: "bg-yellow-500", icon: "⚠" },
  }
  const s = styles[type] || styles.info

  return (
    <div
      className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl text-white text-sm font-medium
        transition-all duration-300 ${s.bg}
        ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
      style={{ minWidth: "260px", maxWidth: "380px" }}
    >
      <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold shrink-0">
        {s.icon}
      </span>
      <span className="flex-1">{message}</span>
      <button
        onClick={() => { setVisible(false); setTimeout(() => onClose(id), 300) }}
        className="ml-2 opacity-70 hover:opacity-100 transition-opacity text-lg leading-none"
      >
        ×
      </button>
    </div>
  )
}

// ─── Conteneur de Toasts ──────────────────────────────────────
export function ToastContainer({ toasts, onClose }) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem {...t} onClose={onClose} />
        </div>
      ))}
    </div>
  )
}

// ─── Hook useToast ────────────────────────────────────────────
import { useCallback } from "react"

let _toastCounter = 0

export function useToast() {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = "info") => {
    const id = ++_toastCounter
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = {
    success: (msg) => addToast(msg, "success"),
    error:   (msg) => addToast(msg, "error"),
    info:    (msg) => addToast(msg, "info"),
    warning: (msg) => addToast(msg, "warning"),
  }

  return { toasts, toast, removeToast }
}
