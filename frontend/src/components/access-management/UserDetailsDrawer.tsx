'use client';

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';

interface UserDetailsDrawerProps {
  userId: string;
  open: boolean;
  onClose: () => void;
}

export function UserDetailsDrawer({ userId, open, onClose }: UserDetailsDrawerProps) {
  // Mock data - replace with actual API call
  const userDetails = {
    id: userId,
    email: 'user@example.com',
    userName: 'johndoe',
    isActive: true,
    isLocked: false,
    lastLoginAt: new Date().toISOString(),
    createdAt: new Date(2024, 0, 1).toISOString(),
    updatedAt: new Date(2024, 9, 20).toISOString(),
    roles: [
      {
        id: '1',
        name: 'User',
        assignedAt: new Date(2024, 0, 1).toISOString(),
        scopeType: 'Global',
      },
    ],
    groups: [
      {
        id: '1',
        name: 'Engineering',
        isManager: false,
        joinedAt: new Date(2024, 0, 15).toISOString(),
      },
    ],
    effectivePermissions: [
      {
        resource: 'Projects',
        actions: ['Read', 'Create', 'Update'],
        scopeType: 'Team',
      },
    ],
    activeSessions: [
      {
        id: '1',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0...',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        lastActivityAt: new Date().toISOString(),
      },
    ],
    mfaEnrollments: [
      {
        id: '1',
        mfaType: 'TOTP',
        isEnabled: true,
        isVerified: true,
        enrolledAt: new Date(2024, 0, 1).toISOString(),
      },
    ],
  };

  const auditTimeline = [
    {
      id: '1',
      action: 'Role Assigned',
      description: 'Manager role assigned to Team Alpha',
      performedBy: 'admin',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '2',
      action: 'MFA Enabled',
      description: 'TOTP MFA enabled',
      performedBy: 'johndoe',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: '3',
      action: 'User Created',
      description: 'User account created',
      performedBy: 'admin',
      timestamp: userDetails.createdAt,
    },
  ];

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content
          className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-background shadow-xl z-50 overflow-y-auto focus:outline-none"
          aria-describedby="user-details-description"
        >
          {/* Header */}
          <div className="sticky top-0 bg-background border-b border-border p-6 z-10">
            <div className="flex items-start justify-between">
              <div>
                <Dialog.Title className="text-2xl font-bold">
                  {userDetails.userName}
                </Dialog.Title>
                <p id="user-details-description" className="text-sm text-muted-foreground mt-1">
                  {userDetails.email}
                </p>
              </div>
              <Dialog.Close className="text-muted-foreground hover:text-foreground">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Dialog.Close>
            </div>

            {/* Quick Actions */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90">
                Editar Usuário
              </button>
              <button className="px-3 py-1.5 text-sm border border-border rounded hover:bg-muted">
                Atribuir Papel
              </button>
              <button className="px-3 py-1.5 text-sm border border-border rounded hover:bg-muted">
                Gerenciar MFA
              </button>
              <button className="px-3 py-1.5 text-sm border border-border rounded hover:bg-muted">
                Encerrar Sessões
              </button>
              {!userDetails.isLocked ? (
                <button className="px-3 py-1.5 text-sm bg-destructive text-destructive-foreground rounded hover:bg-destructive/90">
                  Bloquear
                </button>
              ) : (
                <button className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                  Desbloquear
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* User Info */}
            <section>
              <h3 className="text-lg font-semibold mb-4">Informações do Usuário</h3>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                  <dd className="mt-1">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        userDetails.isActive
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {userDetails.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Último Acesso</dt>
                  <dd className="mt-1 text-sm">
                    {new Date(userDetails.lastLoginAt).toLocaleString('pt-BR')}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Criado em</dt>
                  <dd className="mt-1 text-sm">
                    {new Date(userDetails.createdAt).toLocaleString('pt-BR')}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Atualizado em</dt>
                  <dd className="mt-1 text-sm">
                    {new Date(userDetails.updatedAt).toLocaleString('pt-BR')}
                  </dd>
                </div>
              </dl>
            </section>

            {/* Roles */}
            <section>
              <h3 className="text-lg font-semibold mb-4">Papéis</h3>
              <div className="space-y-2">
                {userDetails.roles.map((role) => (
                  <div
                    key={role.id}
                    className="flex items-center justify-between p-3 bg-muted rounded"
                  >
                    <div>
                      <div className="font-medium">{role.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Escopo: {role.scopeType} • Atribuído em{' '}
                        {new Date(role.assignedAt).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <button className="text-sm text-destructive hover:underline">Revogar</button>
                  </div>
                ))}
              </div>
            </section>

            {/* Groups */}
            <section>
              <h3 className="text-lg font-semibold mb-4">Grupos</h3>
              <div className="space-y-2">
                {userDetails.groups.map((group) => (
                  <div
                    key={group.id}
                    className="flex items-center justify-between p-3 bg-muted rounded"
                  >
                    <div>
                      <div className="font-medium">{group.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {group.isManager ? 'Gerente' : 'Membro'} • Entrou em{' '}
                        {new Date(group.joinedAt).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <button className="text-sm text-destructive hover:underline">Remover</button>
                  </div>
                ))}
              </div>
            </section>

            {/* Effective Permissions */}
            <section>
              <h3 className="text-lg font-semibold mb-4">Permissões Efetivas</h3>
              <div className="space-y-2">
                {userDetails.effectivePermissions.map((perm, index) => (
                  <div key={index} className="p-3 bg-muted rounded">
                    <div className="font-medium">{perm.resource}</div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {perm.actions.map((action) => (
                        <span
                          key={action}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary"
                        >
                          {action}
                        </span>
                      ))}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Escopo: {perm.scopeType}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Active Sessions */}
            <section>
              <h3 className="text-lg font-semibold mb-4">Sessões Ativas</h3>
              <div className="space-y-2">
                {userDetails.activeSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-3 bg-muted rounded"
                  >
                    <div>
                      <div className="font-medium">{session.ipAddress}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {session.userAgent}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Última atividade:{' '}
                        {new Date(session.lastActivityAt).toLocaleString('pt-BR')}
                      </div>
                    </div>
                    <button className="text-sm text-destructive hover:underline">Encerrar</button>
                  </div>
                ))}
              </div>
            </section>

            {/* MFA */}
            <section>
              <h3 className="text-lg font-semibold mb-4">Autenticação Multifator (MFA)</h3>
              <div className="space-y-2">
                {userDetails.mfaEnrollments.map((mfa) => (
                  <div
                    key={mfa.id}
                    className="flex items-center justify-between p-3 bg-muted rounded"
                  >
                    <div>
                      <div className="font-medium">{mfa.mfaType}</div>
                      <div className="text-sm text-muted-foreground">
                        {mfa.isVerified ? 'Verificado' : 'Não verificado'} •{' '}
                        {mfa.isEnabled ? 'Ativado' : 'Desativado'}
                      </div>
                    </div>
                    <button className="text-sm text-destructive hover:underline">
                      Resetar
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Audit Timeline */}
            <section>
              <h3 className="text-lg font-semibold mb-4">Timeline de Auditoria</h3>
              <div className="space-y-4">
                {auditTimeline.map((event, index) => (
                  <div key={event.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-primary rounded-full" />
                      {index < auditTimeline.length - 1 && (
                        <div className="w-0.5 h-full bg-border mt-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="font-medium">{event.action}</div>
                      <div className="text-sm text-muted-foreground">{event.description}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {event.performedBy} •{' '}
                        {new Date(event.timestamp).toLocaleString('pt-BR')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
