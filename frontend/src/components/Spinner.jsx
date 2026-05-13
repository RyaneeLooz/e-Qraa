// Spinner réutilisable — sizes: sm | md | lg | xl
export default function Spinner({ size = "md", color = "blue", fullPage = false }) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-[3px]",
    xl: "w-16 h-16 border-4",
  }
  const colors = {
    blue:   "border-blue-600 border-t-transparent",
    white:  "border-white border-t-transparent",
    yellow: "border-yellow-500 border-t-transparent",
    slate:  "border-slate-400 border-t-transparent",
  }

  const spinner = (
    <div
      className={`rounded-full animate-spin ${sizes[size]} ${colors[color]}`}
      role="status"
      aria-label="Chargement..."
    />
  )

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full animate-spin border-4 border-blue-600 border-t-transparent" />
          <p className="text-slate-600 font-medium text-sm">Chargement...</p>
        </div>
      </div>
    )
  }

  return spinner
}

// Skeleton loader pour les cards de cours
export function CourseCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse flex flex-col">
      <div className="h-28 rounded-xl bg-slate-200 mb-4" />
      <div className="h-4 w-24 bg-slate-200 rounded-full mb-3" />
      <div className="h-5 w-full bg-slate-200 rounded mb-1" />
      <div className="h-4 w-16 bg-slate-200 rounded mb-4" />
      <div className="flex justify-between items-center mt-auto">
        <div className="h-5 w-20 bg-slate-200 rounded" />
        <div className="h-8 w-16 bg-slate-200 rounded-lg" />
      </div>
    </div>
  )
}

// Skeleton pour les stats
export function StatSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center animate-pulse">
      <div className="w-10 h-10 bg-slate-200 rounded-full mx-auto mb-3" />
      <div className="h-8 w-20 bg-slate-200 rounded mx-auto mb-2" />
      <div className="h-4 w-28 bg-slate-200 rounded mx-auto" />
    </div>
  )
}
