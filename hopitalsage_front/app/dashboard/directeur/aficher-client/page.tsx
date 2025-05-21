'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import HeaderSuperuser from '@/components/HeaderSuperuser';
import SidebarSuperuser from '@/components/SidebarSuperuser';

interface Client {
  id: number;
  nom: string;
  telephone: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchClients = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('Token manquant');
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/api/clients/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Échec de la récupération des clients');
      const data = await res.json();
      setClients(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    if (!confirm('Confirmer la suppression ?')) return;

    try {
      const res = await fetch(`http://localhost:8000/api/clients/${id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setClients(clients.filter(client => client.id !== id));
      }
    } catch (err) {
      console.error('Erreur suppression client', err);
    }
  };

    return (
    <div
  className="relative flex h-screen text-white overflow-hidden"
>
  <div
    className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
    style={{ backgroundImage: "url('/logo.png')" }}
  ></div>

  <div className="relative flex flex-1 backdrop-blur-sm bg-[#0a1a33]/90 z-10">
    <SidebarSuperuser />

    <div className="flex flex-col flex-1">
      <HeaderSuperuser />

      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">📋 Liste des Clients</h1>
          <Link
            href="/dashboard/directeur/clients"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            ➕ Ajouter un client
          </Link>
        </div>

        {error && <div className="text-red-400 mb-4">{error}</div>}
        {loading ? (
          <div>Chargement...</div>
        ) : (
          <div className="overflow-x-auto rounded-xl bg-white text-black">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Nom</th>
                  <th className="px-4 py-3 text-left">Téléphone</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map(client => (
                  <tr
                    key={client.id}
                    className="border-t hover:bg-blue-50 dark:hover:bg-zinc-800 transition"
                  >
                    <td className="px-4 py-3">{client.nom}</td>
                    <td className="px-4 py-3">{client.telephone}</td>
                    <td className="px-4 py-3 flex flex-wrap gap-2">
                      <Link
                        href={`/dashboard/directeur/clients/modifier/${client.id}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        ✏️ Modifier
                      </Link>
                      <button
                        onClick={() => handleDelete(client.id)}
                        className="text-red-600 hover:underline font-medium"
                      >
                        🗑️ Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  </div>
</div>

    );
}