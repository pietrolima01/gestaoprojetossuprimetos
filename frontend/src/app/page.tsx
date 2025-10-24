export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Gestão de Acessos</h1>
        <p className="text-muted-foreground mb-8">
          Sistema de Gestão de Acessos e Permissões
        </p>
        <a
          href="/access-management"
          className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Acessar Sistema
        </a>
      </div>
    </main>
  )
}
