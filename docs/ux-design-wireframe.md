# Gestão de Acessos - UX Design & Wireframe

## Design Principles

### 1. Clarity
- Clear labeling and grouping of related functions
- Consistent terminology throughout the interface
- Obvious primary actions with secondary actions de-emphasized
- Breadcrumb navigation for context awareness

### 2. Efficiency
- Quick access to most common operations
- Keyboard shortcuts for power users
- Bulk operations to reduce repetitive tasks
- Smart defaults based on context

### 3. Safety
- Confirmation dialogs for destructive actions
- Preview of impact before applying changes
- Undo capabilities where possible
- Clear visual distinction for dangerous actions

### 4. Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus indicators on interactive elements

## Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER                                                           │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Logo    Gestão de Acessos                    User Menu  [?] │ │
│ └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ TITLE & DESCRIPTION                                             │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Gestão de Acessos                                           │ │
│ │ Gerencie usuários, papéis, permissões, grupos, solicit... │ │
│ └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ TABS                                                             │
│ [Usuários] [Papéis] [Grupos] [Solicitações] [Políticas] ...   │
├─────────────────────────────────────────────────────────────────┤
│ FILTERS (Persistent)                                             │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ [Search: _____________] [Status: All ▾] [Role: All ▾] ...  │ │
│ └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ BULK ACTIONS BAR (Conditional - appears when items selected)    │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 5 selected  [Assign Role] [Require MFA] [Lock] [✕ Clear]  │ │
│ └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ MAIN CONTENT AREA                                               │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ TABLE / DATA GRID                                           │ │
│ │ ┌───┬────────┬─────────┬────────┬──────┬────────┬─────────┐ │ │
│ │ │[✓]│ Name   │ Email   │ Status │Roles │ Groups │ Actions │ │ │
│ │ ├───┼────────┼─────────┼────────┼──────┼────────┼─────────┤ │ │
│ │ │[ ]│ admin  │admin@.. │🟢Active│Admin │IT Dept │[Details]│ │ │
│ │ │[ ]│johndoe │user@... │🟢Active│User  │Eng...  │[Details]│ │ │
│ │ └───┴────────┴─────────┴────────┴──────┴────────┴─────────┘ │ │
│ │                                                             │ │
│ │ PAGINATION                                                  │ │
│ │ Showing 1-20 of 100        [← Previous] [1] [2] [Next →]  │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

SIDE DRAWER (Details - slides in from right when item clicked)
┌─────────────────────────┐
│ [✕]  USER DETAILS       │
├─────────────────────────┤
│ johndoe                 │
│ user@example.com        │
│                         │
│ QUICK ACTIONS           │
│ [Edit] [Assign Role]    │
│ [Manage MFA] [Lock]     │
├─────────────────────────┤
│ ▼ User Info             │
│   Status: Active        │
│   Last Login: 2h ago    │
│                         │
│ ▼ Roles                 │
│   • User (Global)       │
│     [Revoke]            │
│                         │
│ ▼ Groups                │
│   • Engineering         │
│     Member since: Jan 1 │
│     [Remove]            │
│                         │
│ ▼ Effective Permissions │
│   Projects: Read,Create │
│                         │
│ ▼ Active Sessions (2)   │
│   192.168.1.100         │
│   Last: 5 min ago       │
│   [Terminate]           │
│                         │
│ ▼ Audit Timeline        │
│   ● Role Assigned       │
│     Manager added       │
│     by admin            │
│     Yesterday, 3:15 PM  │
│   ○ MFA Enabled         │
│     2 days ago          │
└─────────────────────────┘
```

## Users Tab - Detailed Wireframe

### Search & Filters
```
┌─────────────────────────────────────────────────────────────────┐
│ Search & Filters                                                │
├─────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────┬────────┬────────┬────────┐ │
│ │ 🔍 Search by name, email, ID...  │Status ▾│Role   ▾│MFA    ▾│ │
│ └──────────────────────────────────┴────────┴────────┴────────┘ │
│ ┌────────┬────────┬───────────────┐                            │
│ │Group  ▾│Unit   ▾│[Clear Filters]│                            │
│ └────────┴────────┴───────────────┘                            │
└─────────────────────────────────────────────────────────────────┘
```

### Data Table
```
┌─────────────────────────────────────────────────────────────────┐
│ Users Table                                              [+ New]│
├─────────────────────────────────────────────────────────────────┤
│ [✓] Name      Email           Status  Roles    Groups  MFA  ... │
├─────────────────────────────────────────────────────────────────┤
│ [ ] admin     admin@ex.com    🟢      Admin    IT      ✓   ... │
│ [ ] johndoe   user@ex.com     🟢      User     Eng     ✗   ... │
│ [ ] janedoe   manager@ex.com  🟢      Manager  Eng     ✓   ... │
│ [ ] bob       bob@ex.com      🔒      User     Sales   ✓   ... │
│ [ ] alice     alice@ex.com    ⚫      Viewer   -       ✗   ... │
└─────────────────────────────────────────────────────────────────┘
```

### Status Indicators
- 🟢 Green: Active
- 🔒 Red: Locked
- ⚫ Gray: Inactive
- ⏸️ Orange: Suspended

### Role & Permission Badges
```
┌──────────┐  ┌─────────┐  ┌──────────┐
│ Admin    │  │ Manager │  │ User     │
│ (Global) │  │ (Team)  │  │ (Global) │
└──────────┘  └─────────┘  └──────────┘
```

## Roles & Permissions Tab - Matrix View

```
┌─────────────────────────────────────────────────────────────────┐
│ Permissions Matrix                                              │
├─────────────────────────────────────────────────────────────────┤
│                    │ SuperAdmin │ Admin │ Manager │ User │View │
├────────────────────┼────────────┼───────┼─────────┼──────┼─────┤
│ Users              │            │       │         │      │     │
│  Create            │     ✓      │   ✓   │    -    │  -   │  -  │
│  Read              │     ✓      │   ✓   │    ✓    │  ✓   │  ✓  │
│  Update            │     ✓      │   ✓   │   ⚠️1   │  -   │  -  │
│  Delete            │     ✓      │  ⚠️2  │    -    │  -   │  -  │
├────────────────────┼────────────┼───────┼─────────┼──────┼─────┤
│ Roles              │            │       │         │      │     │
│  Create            │     ✓      │   ✓   │    -    │  -   │  -  │
│  Read              │     ✓      │   ✓   │    ✓    │  ✓   │  ✓  │
│  Update            │     ✓      │   ✓   │    -    │  -   │  -  │
│  Delete            │     ✓      │   -   │    -    │  -   │  -  │
└────────────────────────────────────────────────────────────────┘

⚠️ Conflicts:
  1. Manager can update users only within their team (Team scope)
  2. Admin can delete only non-admin users (Conditional)

Resolution: Higher priority role takes precedence
```

## Access Requests Tab - Workflow View

```
┌─────────────────────────────────────────────────────────────────┐
│ Access Requests                                   [+ New Request]│
├─────────────────────────────────────────────────────────────────┤
│ Filters: [Pending ▾] [My Requests ▾] [Needs My Approval ▾]     │
├─────────────────────────────────────────────────────────────────┤
│ Request                 Requester  Type         Status    SLA    │
├─────────────────────────────────────────────────────────────────┤
│ Manager → Team Alpha    johndoe    Role Assign  Pending  ⏰2d  │
│   Justification: Promotion to team lead                         │
│   Approvals: ✓ Level 1 (manager1) · ⏸️ Level 2 (manager2)     │
│   [View Details] [Approve] [Reject]                            │
├─────────────────────────────────────────────────────────────────┤
│ Access to Projects      janedoe    Permission   Approved ✓     │
│   Justification: Need to review Q4 projects                     │
│   Approved by: admin on Oct 23, 2:30 PM                        │
│   [View Details]                                               │
└─────────────────────────────────────────────────────────────────┘

SLA Indicators:
  🟢 On time
  ⏰ Approaching deadline (< 2 days)
  🔴 Overdue
```

## Audit Logs Tab

```
┌─────────────────────────────────────────────────────────────────┐
│ Audit Logs & Timeline                          [Export to CSV] │
├─────────────────────────────────────────────────────────────────┤
│ Filters:                                                        │
│ [User: All ▾] [Action: All ▾] [Date: Last 7 days ▾]           │
├─────────────────────────────────────────────────────────────────┤
│ Timeline View                                                   │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ ● Oct 24, 3:45 PM  |  admin  |  192.168.1.100              │ │
│ │   Users.Update                                              │ │
│ │   Assigned "Manager" role to johndoe for Team Alpha        │ │
│ │   Reason: Promotion                                         │ │
│ │                                                             │ │
│ │ ● Oct 24, 2:30 PM  |  johndoe  |  192.168.1.101            │ │
│ │   MFA.Enabled                                               │ │
│ │   TOTP MFA enabled                                          │ │
│ │                                                             │ │
│ │ ● Oct 23, 5:15 PM  |  admin  |  192.168.1.100              │ │
│ │   AccessRequest.Approved                                    │ │
│ │   Approved access request #123                              │ │
│ │   Justification: Required for project delivery              │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Design Tokens

### Colors
- **Primary**: Blue (#3B82F6) - Primary actions, active states
- **Success**: Green (#10B981) - Active status, approved
- **Warning**: Orange (#F59E0B) - Approaching deadline, caution
- **Danger**: Red (#EF4444) - Locked, rejected, destructive actions
- **Muted**: Gray (#6B7280) - Secondary text, inactive states

### Typography
- **Headings**: Inter, semibold
- **Body**: Inter, regular
- **Monospace**: Fira Code (for IDs, hashes)

### Spacing
- Base unit: 4px
- Compact: 8px (2 units)
- Default: 16px (4 units)
- Relaxed: 24px (6 units)

### Borders
- Default: 1px solid #E5E7EB
- Focus: 2px solid #3B82F6
- Radius: 6px

## Interaction Patterns

### Confirmation Dialog
```
┌─────────────────────────────────────┐
│ ⚠️  Confirm Action                  │
├─────────────────────────────────────┤
│ You are about to lock 5 users:     │
│                                     │
│ • johndoe                           │
│ • janedoe                           │
│ • bob                               │
│ • alice                             │
│ • charlie                           │
│                                     │
│ This will:                          │
│ • Terminate all active sessions     │
│ • Prevent login until unlocked      │
│ • Generate audit log entry          │
│                                     │
│ Reason (required):                  │
│ [_________________________]         │
│                                     │
│         [Cancel] [Confirm Lock]     │
└─────────────────────────────────────┘
```

### Empty States
```
┌─────────────────────────────────────┐
│                                     │
│           📭                        │
│                                     │
│     No users found                  │
│                                     │
│  Try adjusting your filters or      │
│  search criteria                    │
│                                     │
│      [Clear Filters]                │
│                                     │
└─────────────────────────────────────┘
```

### Loading States
```
┌─────────────────────────────────────┐
│   ⏳ Loading users...               │
│   [████████░░░░] 60%                │
└─────────────────────────────────────┘
```

### Error States
```
┌─────────────────────────────────────┐
│   ❌ Failed to load users           │
│                                     │
│   Error: Connection timeout         │
│                                     │
│   [Retry] [Contact Support]         │
└─────────────────────────────────────┘
```

## Keyboard Shortcuts

- `Ctrl/Cmd + K`: Global search
- `Ctrl/Cmd + N`: New user
- `Ctrl/Cmd + E`: Edit selected user
- `Ctrl/Cmd + F`: Focus filters
- `Esc`: Close drawer/dialog
- `Tab`: Navigate through form fields
- `Enter`: Submit form
- `Arrow keys`: Navigate table rows
- `Space`: Select/deselect checkbox

## Responsive Breakpoints

- **Mobile**: < 640px - Stacked layout, simplified table
- **Tablet**: 640px - 1024px - Adaptive layout, some columns hidden
- **Desktop**: > 1024px - Full layout with all features

## Accessibility Features

1. **Keyboard Navigation**: Full keyboard support for all interactions
2. **Screen Reader**: ARIA labels on all interactive elements
3. **Focus Indicators**: Visible focus rings with 2px border
4. **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
5. **Error Association**: Error messages linked to form fields with aria-describedby
6. **Skip Links**: Skip to main content link for screen readers
7. **Landmarks**: Proper HTML5 semantic elements and ARIA landmarks

---

**Last Updated**: 2025-10-24  
**Design Version**: 1.0  
**Next Review**: 2025-11-24
