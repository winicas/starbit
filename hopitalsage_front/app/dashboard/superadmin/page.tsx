'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

interface DashboardData {
  clients_count: number;
  conteneurs_count: number;
  contrats_count: number;
  produits_count: number;
  paiements_total: number;
  paiements_en_attente: number;
}

// Corriger ici : version typée de motion.div
const MotionDiv = motion.div as React.ComponentType<React.HTMLAttributes<HTMLDivElement> & any>;

export default function SuperuserDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Token manquant. Veuillez vous connecter.');
        return;
      }

      try {
        const response = await axios.get('https://starbit.onrender.com/api/admin-dashboard/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data);
      } catch (err: any) {
        setError("Erreur lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <MotionDiv
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
        />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-6">{error}</div>;
  }

  if (!data) {
    return <div className="text-gray-500 p-6">Aucune donnée disponible.</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-blue-600">Dashboard Superuser</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Clients" value={data.clients_count} />
        <Card title="Conteneurs" value={data.conteneurs_count} />
        <Card title="Contrats" value={data.contrats_count} />
        <Card title="Produits" value={data.produits_count} />
        <Card title="Paiements Payés (USD)" value={data.paiements_total.toFixed(2)} />
        <Card title="Paiements en Attente (USD)" value={data.paiements_en_attente.toFixed(2)} />
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: number | string }) {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-zinc-800 rounded-2xl shadow p-5 border border-gray-200 dark:border-zinc-700"
    >
      <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{title}</h5>
      <p className="text-3xl font-bold text-blue-500 mt-2">{value}</p>
    </MotionDiv>
  );
}

