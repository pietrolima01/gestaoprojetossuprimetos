'use client';

import React from 'react';

interface UserFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: {
    status: string;
    role: string | null;
    group: string | null;
    mfaEnabled: boolean | null;
  };
  onFiltersChange: (filters: any) => void;
}

export function UserFilters({ searchTerm, onSearchChange, filters, onFiltersChange }: UserFiltersProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="md:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium mb-2">
            Buscar
          </label>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Nome, e-mail ou ID..."
            className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="status-filter" className="block text-sm font-medium mb-2">
            Status
          </label>
          <select
            id="status-filter"
            value={filters.status}
            onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">Todos</option>
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
            <option value="locked">Bloqueado</option>
          </select>
        </div>

        {/* MFA Filter */}
        <div>
          <label htmlFor="mfa-filter" className="block text-sm font-medium mb-2">
            MFA
          </label>
          <select
            id="mfa-filter"
            value={filters.mfaEnabled === null ? 'all' : filters.mfaEnabled ? 'enabled' : 'disabled'}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                mfaEnabled: e.target.value === 'all' ? null : e.target.value === 'enabled',
              })
            }
            className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">Todos</option>
            <option value="enabled">Ativado</option>
            <option value="disabled">Desativado</option>
          </select>
        </div>
      </div>

      {/* Additional Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div>
          <label htmlFor="role-filter" className="block text-sm font-medium mb-2">
            Papel
          </label>
          <select
            id="role-filter"
            value={filters.role || 'all'}
            onChange={(e) =>
              onFiltersChange({ ...filters, role: e.target.value === 'all' ? null : e.target.value })
            }
            className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">Todos os Papéis</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="user">User</option>
          </select>
        </div>

        <div>
          <label htmlFor="group-filter" className="block text-sm font-medium mb-2">
            Grupo
          </label>
          <select
            id="group-filter"
            value={filters.group || 'all'}
            onChange={(e) =>
              onFiltersChange({ ...filters, group: e.target.value === 'all' ? null : e.target.value })
            }
            className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">Todos os Grupos</option>
            <option value="engineering">Engineering</option>
            <option value="it">IT Department</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={() =>
              onFiltersChange({
                status: 'all',
                role: null,
                group: null,
                mfaEnabled: null,
              })
            }
            className="w-full px-4 py-2 text-sm border border-border rounded hover:bg-muted"
          >
            Limpar Filtros
          </button>
        </div>
      </div>
    </div>
  );
}
