export function RolesPermissionsTab() {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-xl font-semibold mb-4">Papéis e Permissões</h2>
      <p className="text-muted-foreground">
        Gerencie papéis, permissões e visualize a matriz de permissões por recurso.
      </p>
      <div className="mt-6 p-4 bg-muted rounded">
        <p className="text-sm text-muted-foreground">
          Componente em desenvolvimento: matriz de permissões, gestão de papéis e resolução de conflitos.
        </p>
      </div>
    </div>
  );
}

export function GroupsTeamsTab() {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-xl font-semibold mb-4">Grupos e Equipes</h2>
      <p className="text-muted-foreground">
        Gerencie grupos, equipes e associação de usuários com herança de papéis.
      </p>
      <div className="mt-6 p-4 bg-muted rounded">
        <p className="text-sm text-muted-foreground">
          Componente em desenvolvimento: gestão de grupos, membros e herança em cascata de papéis.
        </p>
      </div>
    </div>
  );
}

export function AccessRequestsTab() {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-xl font-semibold mb-4">Solicitações de Acesso</h2>
      <p className="text-muted-foreground">
        Gerencie solicitações de acesso com workflow de aprovação em dois estágios.
      </p>
      <div className="mt-6 p-4 bg-muted rounded">
        <p className="text-sm text-muted-foreground">
          Componente em desenvolvimento: workflow de aprovação, SLA, justificativas e aprovadores.
        </p>
      </div>
    </div>
  );
}

export function PoliciesTab() {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-xl font-semibold mb-4">Políticas de Acesso</h2>
      <p className="text-muted-foreground">
        Configure políticas baseadas em atributos (ABAC) com regras por unidade, equipe, cargo, região e horário.
      </p>
      <div className="mt-6 p-4 bg-muted rounded">
        <p className="text-sm text-muted-foreground">
          Componente em desenvolvimento: builder de políticas, condições por atributos e priorização.
        </p>
      </div>
    </div>
  );
}

export function AuditLogsTab() {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-xl font-semibold mb-4">Auditoria e Logs</h2>
      <p className="text-muted-foreground">
        Visualize trilhas de auditoria com informações sobre quem fez o quê, quando e onde.
      </p>
      <div className="mt-6 p-4 bg-muted rounded">
        <p className="text-sm text-muted-foreground">
          Componente em desenvolvimento: logs imutáveis, filtros avançados, exportação CSV e verificação de integridade.
        </p>
      </div>
    </div>
  );
}

export function TokensIntegrationsTab() {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-xl font-semibold mb-4">Tokens e Integrações</h2>
      <p className="text-muted-foreground">
        Gerencie chaves de API, SCIM, SSO com rotação e escopos configuráveis.
      </p>
      <div className="mt-6 p-4 bg-muted rounded">
        <p className="text-sm text-muted-foreground">
          Componente em desenvolvimento: gestão de API keys, rotação automática, escopos e integrações SSO.
        </p>
      </div>
    </div>
  );
}
