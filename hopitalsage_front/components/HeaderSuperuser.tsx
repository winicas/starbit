'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

interface UserProfile {
  first_name: string;
  last_name: string;
  profile_picture: string | null;
}

export default function HeaderSuperuser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      try {
        const res = await fetch('${process.env.NEXT_PUBLIC_API_URL}/api/me/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Échec du chargement de l’utilisateur');

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.push('/login');
  };

  return (
    <header className="w-full px-4 py-3 bg-[#0A2342] text-white flex items-center justify-between shadow-md">
      <h1 className="text-2xl md:text-3xl font-bold tracking-wide flex items-center gap-1">
        <span className="text-yellow-400">★</span> <span className="drop-shadow">STARBIT</span>
      </h1>

      {user && (
        <div className="flex items-center gap-4">
          {/* Avatar + nom */}
          <div className="flex items-center gap-2">
            {user.profile_picture ? (
              <Image
                src={user.profile_picture}
                alt="Photo de profil"
                width={40}
                height={40}
                className="rounded-full object-cover border-2 border-white"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-white text-[#0A2342] flex items-center justify-center font-bold uppercase">
                {user.first_name[0]}
              </div>
            )}
            <span className="font-medium text-sm sm:text-base truncate">
              {user.first_name} {user.last_name}
            </span>
          </div>

          {/* Bouton de déconnexion */}
          <button
            onClick={handleLogout}
            title="Se déconnecter"
            className="p-2 rounded-full hover:bg-white/10 transition"
          >
            <LogOut className="w-5 h-5 text-white" />
          </button>
        </div>
      )}
    </header>
  );
}
