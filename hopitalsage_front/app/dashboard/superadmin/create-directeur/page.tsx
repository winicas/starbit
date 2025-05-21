'use client';

import { useState } from 'react';
import axios from 'axios';

export default function CreateDirecteurPage() {
  const [form, setForm] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    profile_picture: null as File | null,
  });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'profile_picture' && files) {
      setForm((prev) => ({ ...prev, profile_picture: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('accessToken');
    if (!token) return setMessage('Token manquant. Veuillez vous connecter.');

    const formData = new FormData();
    for (const key in form) {
      const value = (form as any)[key];
      if (value) formData.append(key, value);
    }
    formData.append('role', 'directeur');

    try {
      const res = await axios.post('https://starbit.onrender.com/api/create-directeur/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Directeur créé avec succès.');
      setForm({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        profile_picture: null,
      });
    } catch (err: any) {
      setMessage('Erreur : ' + (err.response?.data?.detail || 'Impossible de créer.'));
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h1 className="text-xl font-bold mb-4">Créer un Directeur</h1>

      {message && <p className="mb-4 text-blue-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="username" value={form.username} onChange={handleChange} placeholder="Nom d'utilisateur" required className="input" />
        <input type="text" name="first_name" value={form.first_name} onChange={handleChange} placeholder="Prénom" className="input" />
        <input type="text" name="last_name" value={form.last_name} onChange={handleChange} placeholder="Nom" className="input" />
        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="input" />
        <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Mot de passe" required className="input" />
        <input type="file" name="profile_picture" onChange={handleChange} className="input" />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Créer</button>
      </form>
    </div>
  );
}

// Ajoutez ceci à votre global.css ou utilisez Tailwind pour un meilleur style
