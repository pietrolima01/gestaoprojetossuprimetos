using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace GestaoAcessos.Api.Authorization
{
    // Custom authorization requirements
    public class PermissionRequirement : IAuthorizationRequirement
    {
        public string Resource { get; }
        public string Action { get; }
        public string ScopeType { get; }
        
        public PermissionRequirement(string resource, string action, string scopeType = "Global")
        {
            Resource = resource;
            Action = action;
            ScopeType = scopeType;
        }
    }
    
    public class RoleRequirement : IAuthorizationRequirement
    {
        public string[] Roles { get; }
        
        public RoleRequirement(params string[] roles)
        {
            Roles = roles;
        }
    }
    
    public class MfaRequirement : IAuthorizationRequirement
    {
    }
    
    // Authorization handlers
    public class PermissionAuthorizationHandler : AuthorizationHandler<PermissionRequirement>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILogger<PermissionAuthorizationHandler> _logger;
        
        public PermissionAuthorizationHandler(
            IHttpContextAccessor httpContextAccessor,
            ILogger<PermissionAuthorizationHandler> logger)
        {
            _httpContextAccessor = httpContextAccessor;
            _logger = logger;
        }
        
        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            PermissionRequirement requirement)
        {
            var user = context.User;
            
            if (!user.Identity?.IsAuthenticated ?? true)
            {
                _logger.LogWarning("User is not authenticated");
                return Task.CompletedTask;
            }
            
            var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                _logger.LogWarning("User ID claim not found");
                return Task.CompletedTask;
            }
            
            // Check for SuperAdmin role (bypass permission check)
            if (user.IsInRole("SuperAdmin"))
            {
                _logger.LogInformation("SuperAdmin access granted for {Resource}.{Action}", 
                    requirement.Resource, requirement.Action);
                context.Succeed(requirement);
                return Task.CompletedTask;
            }
            
            // Get user permissions from claims
            var permissions = user.Claims
                .Where(c => c.Type == "permission")
                .Select(c => c.Value)
                .ToList();
            
            var requiredPermission = $"{requirement.Resource}.{requirement.Action}";
            
            if (permissions.Contains(requiredPermission))
            {
                _logger.LogInformation("Permission {Permission} granted for user {UserId}", 
                    requiredPermission, userId);
                context.Succeed(requirement);
            }
            else
            {
                _logger.LogWarning("Permission {Permission} denied for user {UserId}", 
                    requiredPermission, userId);
            }
            
            return Task.CompletedTask;
        }
    }
    
    public class RoleAuthorizationHandler : AuthorizationHandler<RoleRequirement>
    {
        private readonly ILogger<RoleAuthorizationHandler> _logger;
        
        public RoleAuthorizationHandler(ILogger<RoleAuthorizationHandler> logger)
        {
            _logger = logger;
        }
        
        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            RoleRequirement requirement)
        {
            var user = context.User;
            
            if (!user.Identity?.IsAuthenticated ?? true)
            {
                return Task.CompletedTask;
            }
            
            foreach (var role in requirement.Roles)
            {
                if (user.IsInRole(role))
                {
                    _logger.LogInformation("Role {Role} check passed", role);
                    context.Succeed(requirement);
                    return Task.CompletedTask;
                }
            }
            
            _logger.LogWarning("User does not have any of the required roles: {Roles}", 
                string.Join(", ", requirement.Roles));
            
            return Task.CompletedTask;
        }
    }
    
    public class MfaAuthorizationHandler : AuthorizationHandler<MfaRequirement>
    {
        private readonly ILogger<MfaAuthorizationHandler> _logger;
        
        public MfaAuthorizationHandler(ILogger<MfaAuthorizationHandler> logger)
        {
            _logger = logger;
        }
        
        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            MfaRequirement requirement)
        {
            var user = context.User;
            
            if (!user.Identity?.IsAuthenticated ?? true)
            {
                return Task.CompletedTask;
            }
            
            var mfaVerified = user.FindFirst("mfa_verified")?.Value;
            
            if (mfaVerified == "true")
            {
                _logger.LogInformation("MFA verification check passed");
                context.Succeed(requirement);
            }
            else
            {
                _logger.LogWarning("MFA verification required but not completed");
            }
            
            return Task.CompletedTask;
        }
    }
    
    // Authorization policy provider
    public static class AuthorizationPolicies
    {
        // Standard policies
        public const string RequireSuperAdmin = "RequireSuperAdmin";
        public const string RequireAdmin = "RequireAdmin";
        public const string RequireManager = "RequireManager";
        public const string RequireMfa = "RequireMfa";
        
        // Permission-based policies
        public const string UsersRead = "Users.Read";
        public const string UsersCreate = "Users.Create";
        public const string UsersUpdate = "Users.Update";
        public const string UsersDelete = "Users.Delete";
        
        public const string RolesRead = "Roles.Read";
        public const string RolesCreate = "Roles.Create";
        public const string RolesUpdate = "Roles.Update";
        public const string RolesDelete = "Roles.Delete";
        
        public const string GroupsRead = "Groups.Read";
        public const string GroupsCreate = "Groups.Create";
        public const string GroupsUpdate = "Groups.Update";
        public const string GroupsDelete = "Groups.Delete";
        
        public const string AccessRequestsRead = "AccessRequests.Read";
        public const string AccessRequestsApprove = "AccessRequests.Approve";
        
        public const string PoliciesRead = "Policies.Read";
        public const string PoliciesManage = "Policies.Manage";
        
        public const string AuditLogsRead = "AuditLogs.Read";
        
        public const string ApiKeysManage = "ApiKeys.Manage";
        
        public static void AddAuthorizationPolicies(this IServiceCollection services)
        {
            services.AddAuthorization(options =>
            {
                // Role-based policies
                options.AddPolicy(RequireSuperAdmin, policy =>
                    policy.Requirements.Add(new RoleRequirement("SuperAdmin")));
                
                options.AddPolicy(RequireAdmin, policy =>
                    policy.Requirements.Add(new RoleRequirement("SuperAdmin", "Admin")));
                
                options.AddPolicy(RequireManager, policy =>
                    policy.Requirements.Add(new RoleRequirement("SuperAdmin", "Admin", "Manager")));
                
                options.AddPolicy(RequireMfa, policy =>
                    policy.Requirements.Add(new MfaRequirement()));
                
                // Permission-based policies for Users
                options.AddPolicy(UsersRead, policy =>
                    policy.Requirements.Add(new PermissionRequirement("Users", "Read")));
                
                options.AddPolicy(UsersCreate, policy =>
                    policy.Requirements.Add(new PermissionRequirement("Users", "Create")));
                
                options.AddPolicy(UsersUpdate, policy =>
                    policy.Requirements.Add(new PermissionRequirement("Users", "Update")));
                
                options.AddPolicy(UsersDelete, policy =>
                    policy.Requirements.Add(new PermissionRequirement("Users", "Delete")));
                
                // Permission-based policies for Roles
                options.AddPolicy(RolesRead, policy =>
                    policy.Requirements.Add(new PermissionRequirement("Roles", "Read")));
                
                options.AddPolicy(RolesCreate, policy =>
                    policy.Requirements.Add(new PermissionRequirement("Roles", "Create")));
                
                options.AddPolicy(RolesUpdate, policy =>
                    policy.Requirements.Add(new PermissionRequirement("Roles", "Update")));
                
                options.AddPolicy(RolesDelete, policy =>
                    policy.Requirements.Add(new PermissionRequirement("Roles", "Delete")));
                
                // Permission-based policies for Groups
                options.AddPolicy(GroupsRead, policy =>
                    policy.Requirements.Add(new PermissionRequirement("Groups", "Read")));
                
                options.AddPolicy(GroupsCreate, policy =>
                    policy.Requirements.Add(new PermissionRequirement("Groups", "Create")));
                
                options.AddPolicy(GroupsUpdate, policy =>
                    policy.Requirements.Add(new PermissionRequirement("Groups", "Update")));
                
                options.AddPolicy(GroupsDelete, policy =>
                    policy.Requirements.Add(new PermissionRequirement("Groups", "Delete")));
                
                // Access Requests policies
                options.AddPolicy(AccessRequestsRead, policy =>
                    policy.Requirements.Add(new PermissionRequirement("AccessRequests", "Read")));
                
                options.AddPolicy(AccessRequestsApprove, policy =>
                    policy.Requirements.Add(new PermissionRequirement("AccessRequests", "Approve")));
                
                // Policies management
                options.AddPolicy(PoliciesRead, policy =>
                    policy.Requirements.Add(new PermissionRequirement("Policies", "Read")));
                
                options.AddPolicy(PoliciesManage, policy =>
                    policy.Requirements.Add(new PermissionRequirement("Policies", "Manage")));
                
                // Audit logs
                options.AddPolicy(AuditLogsRead, policy =>
                    policy.Requirements.Add(new PermissionRequirement("AuditLogs", "Read")));
                
                // API Keys
                options.AddPolicy(ApiKeysManage, policy =>
                    policy.Requirements.Add(new PermissionRequirement("ApiKeys", "Manage")));
            });
            
            // Register authorization handlers
            services.AddScoped<IAuthorizationHandler, PermissionAuthorizationHandler>();
            services.AddScoped<IAuthorizationHandler, RoleAuthorizationHandler>();
            services.AddScoped<IAuthorizationHandler, MfaAuthorizationHandler>();
        }
    }
    
    // Attribute for easier policy application
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true)]
    public class RequirePermissionAttribute : AuthorizeAttribute
    {
        public RequirePermissionAttribute(string resource, string action)
        {
            Policy = $"{resource}.{action}";
        }
    }
}
