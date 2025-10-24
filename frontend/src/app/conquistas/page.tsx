'use client';

import { useUserPoints } from '@/hooks/useUserPoints';

export default function Conquistas() {
  // IMPORTANT: All hooks MUST be called unconditionally at the top level
  // This prevents the "Rendered more hooks than during the previous render" error
  const { userPoints, isLoading, error } = useUserPoints();

  // Early returns should come AFTER all hooks are called
  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erro ao carregar conquistas</h1>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando conquistas...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Conquistas</h1>
          <p className="text-muted-foreground">
            Acompanhe seu progresso e desbloqueie novas conquistas
          </p>
        </div>

        {/* Stats Card */}
        <div className="bg-card rounded-lg shadow-lg p-6 mb-8 border border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {userPoints.total}
              </div>
              <div className="text-sm text-muted-foreground">Pontos Totais</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                Nível {userPoints.level}
              </div>
              <div className="text-sm text-muted-foreground">Nível Atual</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {userPoints.nextLevelPoints}
              </div>
              <div className="text-sm text-muted-foreground">
                Pontos para o próximo nível
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-500 ease-out"
                style={{
                  width: `${
                    ((userPoints.total % 100) / 100) * 100
                  }%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {userPoints.total % 100} / 100 pontos neste nível
            </p>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userPoints.achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`
                bg-card rounded-lg shadow-md p-6 border transition-all duration-200
                ${
                  achievement.unlocked
                    ? 'border-primary/50 hover:shadow-lg hover:scale-105'
                    : 'border-border opacity-60 grayscale'
                }
              `}
            >
              {/* Icon */}
              <div className="text-5xl mb-4 text-center">
                {achievement.icon}
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold mb-2 text-center">
                {achievement.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground text-center mb-4">
                {achievement.description}
              </p>

              {/* Points */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-sm font-medium text-primary">
                  {achievement.points} pontos
                </span>
                {achievement.unlocked && achievement.unlockedAt && (
                  <span className="text-xs text-muted-foreground">
                    ✓ Desbloqueada
                  </span>
                )}
              </div>

              {/* Unlock Status */}
              {!achievement.unlocked && (
                <div className="mt-4 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                    🔒 Bloqueada
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
          >
            ← Voltar ao Início
          </a>
        </div>
      </div>
    </main>
  );
}
