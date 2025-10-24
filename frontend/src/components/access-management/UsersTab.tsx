'use client';

import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { UserDetailsDrawer } from './UserDetailsDrawer';
import { UserFilters } from './UserFilters';

export interface User {
  id: string;
  email: string;
  userName: string;
  isActive: boolean;
  isLocked: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  roles: Array<{ id: string; name: string; scopeType: string }>;
  groups: string[];
  mfaEnabled: boolean;
}

export function UsersTab() {
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    role: null,
    group: null,
    mfaEnabled: null,
  });

  // Mock data - replace with actual API call
  const users: User[] = [
    {
      id: '1',
      email: 'admin@example.com',
      userName: 'admin',
      isActive: true,
      isLocked: false,
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date(2024, 0, 1).toISOString(),
      roles: [{ id: '1', name: 'Admin', scopeType: 'Global' }],
      groups: ['IT Department'],
      mfaEnabled: true,
    },
    {
      id: '2',
      email: 'user@example.com',
      userName: 'johndoe',
      isActive: true,
      isLocked: false,
      lastLoginAt: new Date(Date.now() - 3600000).toISOString(),
      createdAt: new Date(2024, 1, 15).toISOString(),
      roles: [{ id: '2', name: 'User', scopeType: 'Global' }],
      groups: ['Engineering', 'Team Alpha'],
      mfaEnabled: false,
    },
    {
      id: '3',
      email: 'manager@example.com',
      userName: 'janedoe',
      isActive: true,
      isLocked: false,
      lastLoginAt: new Date(Date.now() - 7200000).toISOString(),
      createdAt: new Date(2024, 0, 20).toISOString(),
      roles: [
        { id: '3', name: 'Manager', scopeType: 'Team' },
        { id: '2', name: 'User', scopeType: 'Global' },
      ],
      groups: ['Engineering'],
      mfaEnabled: true,
    },
  ];

  const handleSelectAll = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(users.map(u => u.id)));
    }
  };

  const handleSelectUser = (userId: string) => {
    const newSelection = new Set(selectedUsers);
    if (newSelection.has(userId)) {
      newSelection.delete(userId);
    } else {
      newSelection.add(userId);
    }
    setSelectedUsers(newSelection);
  };

  const handleBulkAction = (action: string) => {
    console.log(`Performing bulk action: ${action} on ${selectedUsers.size} users`);
    // TODO: Implement bulk action logic
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <UserFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Bulk Actions */}
      {selectedUsers.size > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm font-medium">
            {selectedUsers.size} usuário(s) selecionado(s)
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkAction('assignRole')}
              className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Atribuir Papel
            </button>
            <button
              onClick={() => handleBulkAction('requireMfa')}
              className="px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
            >
              Exigir MFA
            </button>
            <button
              onClick={() => handleBulkAction('lock')}
              className="px-3 py-1.5 text-sm bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
            >
              Bloquear
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="w-12 p-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.size === users.length}
                    onChange={handleSelectAll}
                    className="rounded border-border"
                    aria-label="Selecionar todos os usuários"
                  />
                </th>
                <th className="text-left p-4 text-sm font-semibold">Nome</th>
                <th className="text-left p-4 text-sm font-semibold">E-mail</th>
                <th className="text-left p-4 text-sm font-semibold">Status</th>
                <th className="text-left p-4 text-sm font-semibold">Papéis</th>
                <th className="text-left p-4 text-sm font-semibold">Grupos</th>
                <th className="text-left p-4 text-sm font-semibold">MFA</th>
                <th className="text-left p-4 text-sm font-semibold">Último Acesso</th>
                <th className="text-left p-4 text-sm font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.has(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="rounded border-border"
                      aria-label={`Selecionar ${user.userName}`}
                    />
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => setSelectedUser(user.id)}
                      className="text-primary hover:underline font-medium"
                    >
                      {user.userName}
                    </button>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{user.email}</td>
                  <td className="p-4">
                    <StatusBadge isActive={user.isActive} isLocked={user.isLocked} />
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role) => (
                        <span
                          key={role.id}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary"
                        >
                          {role.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {user.groups.slice(0, 2).map((group) => (
                        <span
                          key={group}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground"
                        >
                          {group}
                        </span>
                      ))}
                      {user.groups.length > 2 && (
                        <span className="text-xs text-muted-foreground">
                          +{user.groups.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <MfaBadge enabled={user.mfaEnabled} />
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Nunca'}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => setSelectedUser(user.id)}
                      className="text-sm text-primary hover:underline"
                    >
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-border p-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando 1-{users.length} de {users.length} usuários
          </div>
          <div className="flex gap-2">
            <button
              disabled
              className="px-3 py-1.5 text-sm border border-border rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              disabled
              className="px-3 py-1.5 text-sm border border-border rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo
            </button>
          </div>
        </div>
      </div>

      {/* User Details Drawer */}
      {selectedUser && (
        <UserDetailsDrawer
          userId={selectedUser}
          open={!!selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}

function StatusBadge({ isActive, isLocked }: { isActive: boolean; isLocked: boolean }) {
  if (isLocked) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-destructive/10 text-destructive">
        Bloqueado
      </span>
    );
  }
  if (isActive) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
        Ativo
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
      Inativo
    </span>
  );
}

function MfaBadge({ enabled }: { enabled: boolean }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
        enabled
          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
          : 'bg-muted text-muted-foreground'
      }`}
    >
      {enabled ? 'Ativado' : 'Desativado'}
    </span>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `${diffMins} min atrás`;
  } else if (diffHours < 24) {
    return `${diffHours}h atrás`;
  } else if (diffDays < 30) {
    return `${diffDays}d atrás`;
  } else {
    return date.toLocaleDateString('pt-BR');
  }
}
