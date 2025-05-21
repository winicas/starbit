'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Users,
  PlusCircle,
  Settings,
  Home,
  Package,
  FileText,
  Receipt,
  DollarSign,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth'; // adapte le chemin selon ton projet

export default function SidebarSuperuser() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [openClients, setOpenClients] = useState(pathname.includes('/clients'));
  const { user } = useAuth(); // Utilisateur connecté

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center p-4 bg-[#0A2342] text-white">
        <Image src="/logo.png" alt="Logo Starbit" width={50} height={50} className="rounded-full" />
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#0A2342] text-white shadow-lg z-40 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0`}
      >
        <div className="p-6 space-y-6">
          <div className="flex justify-center">
            <Image src="/logo.png" alt="Logo Starbit" width={80} height={80} className="rounded-full" />
          </div>

          <Link
            href="/dashboard/directeur"
            className={`block py-2 px-4 rounded-lg transition font-semibold text-center ${
              isActive('/dashboard/directeur') ? 'bg-white text-[#0A2342]' : 'hover:bg-white/10'
            }`}
            onClick={() => setIsOpen(false)}
          >
            <Home className="inline mr-2" /> Accueil
          </Link>

          <nav className="space-y-3">
            {/* Clients */}
            <div>
              <button
                onClick={() => setOpenClients(!openClients)}
                className="w-full flex items-center justify-between py-2 px-4 rounded-lg hover:bg-white/10 transition"
              >
                <span className="flex items-center gap-2 font-medium">
                  <Users size={18} /> Clients
                </span>
                {openClients ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {openClients && (
                <div className="ml-6 mt-2 space-y-2 text-sm">
                  <Link
                    href="/dashboard/directeur/clients"
                    className={`block py-1 px-3 rounded transition ${
                      isActive('/dashboard/directeur/clients') ? 'bg-white text-[#0A2342]' : 'hover:bg-white/10'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <PlusCircle size={14} className="inline mr-2" />
                    Ajouter client
                  </Link>
                  <Link
                    href="/dashboard/directeur/aficher-client"
                    className={`block py-1 px-3 rounded transition ${
                      isActive('/superuser/clients') ? 'bg-white text-[#0A2342]' : 'hover:bg-white/10'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings size={14} className="inline mr-2" />
                    Gérer client
                  </Link>
                </div>
              )}
            </div>

            {/* Superuser uniquement : Créer directeur */}
            {user?.is_superuser && (
              <Link
                href="/dashboard/superadmin/create-directeur"
                className={`block py-2 px-4 rounded-lg flex items-center gap-2 transition ${
                  isActive('/dashboard/superadmin/create-directeur') ? 'bg-white text-[#0A2342]' : 'hover:bg-white/10'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <UserPlus size={18} />
                Ajouter directeur
              </Link>
            )}

            {/* Autres liens */}
            <SidebarLink href="/superuser/conteneurs" icon={<Package size={18} />} label="Conteneurs" />
            <SidebarLink href="/superuser/contrats" icon={<FileText size={18} />} label="Contrats" />
            <SidebarLink href="/superuser/produits" icon={<Receipt size={18} />} label="Produits" />
            <SidebarLink href="/superuser/paiements" icon={<DollarSign size={18} />} label="Paiements" />
          </nav>
        </div>
      </aside>
    </>
  );

  function SidebarLink({
    href,
    icon,
    label,
  }: {
    href: string;
    icon: React.ReactNode;
    label: string;
  }) {
    return (
      <Link
        href={href}
        className={`block py-2 px-4 rounded-lg flex items-center gap-2 transition ${
          isActive(href) ? 'bg-white text-[#0A2342]' : 'hover:bg-white/10'
        }`}
        onClick={() => setIsOpen(false)}
      >
        {icon}
        {label}
      </Link>
    );
  }
}
