export default function About({ setPage }) {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 to-blue-500 py-24 sm:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-b from-blue-400/30 to-transparent blur-3xl rounded-full"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white">
            L'éducation en Algérie,<br />réinventée.
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-blue-50">
            e-Qraa est la première marketplace éducative algérienne pensée par et pour les Algériens. 
            Notre mission : rendre l'éducation de qualité accessible à tous.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-100">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">5K+</div>
            <div className="text-slate-500 font-medium">Étudiants actifs</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">120+</div>
            <div className="text-slate-500 font-medium">Formateurs certifiés</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-slate-500 font-medium">Cours disponibles</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">4.8/5</div>
            <div className="text-slate-500 font-medium">Note moyenne</div>
          </div>
        </div>
      </div>

      {/* Notre Modèle */}
      <div className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Pourquoi choisir e-Qraa ?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Nous avons construit une plateforme transparente, équitable et stimulante pour tout le monde.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                🤝
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Modèle Équitable</h3>
              <p className="text-slate-600 leading-relaxed">
                Contrairement aux autres plateformes qui prennent jusqu'à 50%, e-Qraa ne prend que <strong>20% de commission</strong>. 
                Le formateur garde 80% de ses revenus, ce qui nous permet de proposer des cours à des prix imbattables.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <div className="w-14 h-14 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                🟡
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Système de Coins</h3>
              <p className="text-slate-600 leading-relaxed">
                Achetez vos cours sans friction grâce à nos <strong>e-Qraa Coins</strong>. Rechargez votre solde une seule fois 
                par CCP ou BaridiMob, et dépensez vos coins instantanément sur tous nos cours en un clic.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                🏆
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Gamification</h3>
              <p className="text-slate-600 leading-relaxed">
                L'apprentissage n'est plus solitaire. Entrez en compétition avec vos camarades de la même université 
                et de la même spécialité. Cumulez des points et montez dans le <strong>Leaderboard</strong> !
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 text-center max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">Prêt à transformer votre avenir ?</h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => setPage("courses")}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm"
          >
            Explorer les cours
          </button>
          <button 
            onClick={() => setPage("register")}
            className="px-8 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            Créer un compte
          </button>
        </div>
      </div>
    </div>
  )
}
