'use client';

import { useState, useEffect } from 'react';

interface UserPoints {
  total: number;
  level: number;
  nextLevelPoints: number;
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export function useUserPoints() {
  const [userPoints, setUserPoints] = useState<UserPoints>({
    total: 0,
    level: 1,
    nextLevelPoints: 100,
    achievements: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate fetching user points data
    // In a real app, this would be an API call
    const fetchUserPoints = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data
        const mockAchievements: Achievement[] = [
          {
            id: '1',
            title: 'Primeiro Acesso',
            description: 'Realize seu primeiro acesso ao sistema',
            points: 10,
            icon: '🎯',
            unlocked: true,
            unlockedAt: new Date().toISOString(),
          },
          {
            id: '2',
            title: 'Gerenciador de Usuários',
            description: 'Crie seu primeiro usuário',
            points: 25,
            icon: '👤',
            unlocked: true,
            unlockedAt: new Date().toISOString(),
          },
          {
            id: '3',
            title: 'Administrador',
            description: 'Configure 10 permissões diferentes',
            points: 50,
            icon: '⚙️',
            unlocked: false,
          },
          {
            id: '4',
            title: 'Mestre da Segurança',
            description: 'Configure autenticação multi-fator',
            points: 100,
            icon: '🔐',
            unlocked: false,
          },
        ];

        const totalPoints = mockAchievements
          .filter(a => a.unlocked)
          .reduce((sum, a) => sum + a.points, 0);

        setUserPoints({
          total: totalPoints,
          level: Math.floor(totalPoints / 100) + 1,
          nextLevelPoints: ((Math.floor(totalPoints / 100) + 1) * 100) - totalPoints,
          achievements: mockAchievements,
        });
        
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch user points'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPoints();
  }, []);

  return {
    userPoints,
    isLoading,
    error,
  };
}
