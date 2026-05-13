import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-400 rounded-xl flex items-center justify-center shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                  <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.939.69 5.25 1.936V4.533z" />
                  <path d="M12.75 4.533v16.153a8.215 8.215 0 015.25-1.936 8.237 8.237 0 012.75.462.75.75 0 001-.707V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533z" />
                </svg>
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                e-<span className="text-blue-400">Qraa</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              La première plateforme éducative algérienne. Apprenez, enseignez et évoluez avec les meilleurs.
            </p>
          </div>

          {/* Liens Plateforme */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Plateforme</h4>
            <ul className="space-y-2">
              {[
                { label: "Accueil",           path: "/" },
                { label: "Catalogue de cours", path: "/courses" },
                { label: "Nos formateurs",     path: "/instructors" },
                { label: "À propos",           path: "/about" },
              ].map(link => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Liens Support */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2">
              {["Centre d'aide", "Conditions d'utilisation", "Politique de confidentialité", "Contact"].map(label => (
                <li key={label}>
                  <span className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Nous contacter</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <span>📧</span> contact@e-qraa.dz
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <span>📍</span> Alger, Algérie
              </li>
            </ul>
            <div className="flex gap-3 mt-5">
              {["Facebook", "Instagram", "LinkedIn"].map(social => (
                <span
                  key={social}
                  className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all cursor-pointer text-xs font-bold"
                >
                  {social.charAt(0)}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © 2026 e-Qraa. Tous droits réservés.
          </p>
          <p className="text-xs text-slate-500">
            Fait avec ❤️ en Algérie 🇩🇿
          </p>
        </div>
      </div>
    </footer>
  )
}
