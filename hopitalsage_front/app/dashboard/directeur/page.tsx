'use client';

import HeaderSuperuser from '@/components/HeaderSuperuser';
import SidebarSuperuser from '@/components/SidebarSuperuser';

export default function DirecteurDashboardPage() {
  return (
    <div className="relative flex h-screen overflow-hidden text-white">
      {/* Image de fond */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('/logo.png')" }}
      ></div>

      {/* Filtre sombre */}
      <div className="absolute inset-0 bg-[#0a1a33]/90 backdrop-blur-sm z-0"></div>

      {/* Contenu avec sidebar et header */}
      <div className="relative flex flex-1 z-10">
        <SidebarSuperuser />
        <div className="flex-1 flex flex-col">
          <HeaderSuperuser />

          <main className="flex-1 p-6 overflow-y-auto space-y-6">
            <h1 className="text-2xl font-bold text-blue-100">🎯 Bienvenue sur le Dashboard Directeur</h1>
            <p className="text-gray-200">
              Vous avez accès aux ressources liées à la gestion de l’entreprise Starbit.
            </p>

            {/* Cartes info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashboardCard title="📊 Rapports Mensuels" value="3 disponibles" />
              <DashboardCard title="👥 Équipes" value="2 départements" />
              <DashboardCard title="💼 Contrats actifs" value="7 en cours" />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white bg-opacity-90 dark:bg-zinc-800 dark:bg-opacity-90 text-black dark:text-white rounded-2xl shadow p-5 border border-gray-300 dark:border-zinc-700">
      <h5 className="text-lg font-semibold">{title}</h5>
      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">{value}</p>
    </div>
  );
}
