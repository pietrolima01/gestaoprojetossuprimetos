'use client';

import React, { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { UsersTab } from '@/components/access-management/UsersTab';
import {
  RolesPermissionsTab,
  GroupsTeamsTab,
  AccessRequestsTab,
  PoliciesTab,
  AuditLogsTab,
  TokensIntegrationsTab,
} from '@/components/access-management/TabStubs';

export default function AccessManagementPage() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Gestão de Acessos
          </h1>
          <p className="text-muted-foreground">
            Gerencie usuários, papéis, permissões, grupos, solicitações e políticas de acesso
          </p>
        </div>

        {/* Tabs */}
        <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="w-full">
          <Tabs.List 
            className="flex border-b border-border mb-6 overflow-x-auto"
            aria-label="Gestão de Acessos tabs"
          >
            <TabTrigger value="users">Usuários</TabTrigger>
            <TabTrigger value="roles">Papéis e Permissões</TabTrigger>
            <TabTrigger value="groups">Grupos e Equipes</TabTrigger>
            <TabTrigger value="requests">Solicitações de Acesso</TabTrigger>
            <TabTrigger value="policies">Políticas de Acesso</TabTrigger>
            <TabTrigger value="audit">Auditoria e Logs</TabTrigger>
            <TabTrigger value="tokens">Tokens e Integrações</TabTrigger>
          </Tabs.List>

          <Tabs.Content value="users" className="focus:outline-none">
            <UsersTab />
          </Tabs.Content>

          <Tabs.Content value="roles" className="focus:outline-none">
            <RolesPermissionsTab />
          </Tabs.Content>

          <Tabs.Content value="groups" className="focus:outline-none">
            <GroupsTeamsTab />
          </Tabs.Content>

          <Tabs.Content value="requests" className="focus:outline-none">
            <AccessRequestsTab />
          </Tabs.Content>

          <Tabs.Content value="policies" className="focus:outline-none">
            <PoliciesTab />
          </Tabs.Content>

          <Tabs.Content value="audit" className="focus:outline-none">
            <AuditLogsTab />
          </Tabs.Content>

          <Tabs.Content value="tokens" className="focus:outline-none">
            <TokensIntegrationsTab />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
}

function TabTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <Tabs.Trigger
      value={value}
      className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      {children}
    </Tabs.Trigger>
  );
}
