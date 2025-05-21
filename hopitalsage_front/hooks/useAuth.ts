// hooks/useAuth.ts
export const useAuth = () => {
  // Remplace ça par un vrai appel API ou contexte utilisateur
  return {
    user: {
      username: 'admin',
      is_superuser: true, // false si ce n’est pas un superuser
    },
  };
};
