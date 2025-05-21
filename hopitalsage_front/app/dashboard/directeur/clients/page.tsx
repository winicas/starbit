'use client';

import { useState } from 'react';
import HeaderSuperuser from '@/components/HeaderSuperuser';
import SidebarSuperuser from '@/components/SidebarSuperuser';

export default function CreateClientPage() {
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('accessToken');
    if (!token) return alert('Veuillez vous connecter.');

    try {
      const res = await fetch('http://localhost:8000/api/clients/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nom, telephone }),
      });

      if (!res.ok) throw new Error('Erreur lors de la création');

      setSuccess(true);
      setNom('');
      setTelephone('');
    } catch (err) {
      console.error(err);
      alert("Échec de l'ajout.");
    }
  };

  return (
    <div className="relative flex h-screen overflow-hidden text-white">
      {/* Image de fond plein écran */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('/logo.png')" }}
      ></div>

      {/* Filtre sombre */}
      <div className="absolute inset-0 bg-[#0a1a33]/90 backdrop-blur-sm z-0"></div>

      <div className="relative flex flex-1 z-10">
        <SidebarSuperuser />
        <div className="flex-1 flex flex-col">
          <HeaderSuperuser />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-md mx-auto bg-white bg-opacity-95 dark:bg-zinc-800 dark:bg-opacity-90 text-black dark:text-white p-6 rounded-lg shadow-lg">
              <h1 className="text-2xl font-bold mb-4 text-blue-700 dark:text-white">
                ➕ Ajouter un client
              </h1>

              {success && (
                <p className="text-green-600 dark:text-green-400 mb-4">
                  Client ajouté avec succès !
                </p>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                  className="w-full border border-gray-300 dark:border-zinc-600 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-900"
                />
                <input
                  type="text"
                  placeholder="Téléphone"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  required
                  className="w-full border border-gray-300 dark:border-zinc-600 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-900"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Enregistrer
                </button>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
