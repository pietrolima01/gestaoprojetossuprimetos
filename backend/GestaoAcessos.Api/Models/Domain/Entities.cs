using System;
using System.ComponentModel.DataAnnotations;

namespace GestaoAcessos.Api.Models.Domain
{
    public class User
    {
        public Guid Id { get; set; }
        
        [Required]
        [EmailAddress]
        [MaxLength(256)]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(256)]
        public string NormalizedEmail { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(256)]
        public string UserName { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(256)]
        public string NormalizedUserName { get; set; } = string.Empty;
        
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        
        public string? SecurityStamp { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        public bool IsLocked { get; set; } = false;
        
        public DateTime? LockedUntil { get; set; }
        
        public DateTime? LastLoginAt { get; set; }
        
        public int FailedLoginAttempts { get; set; } = 0;
        
        public bool MustChangePwd { get; set; } = false;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        public Guid? CreatedBy { get; set; }
        
        public Guid? UpdatedBy { get; set; }
        
        public byte[] RowVersion { get; set; } = Array.Empty<byte>();
        
        // Navigation properties
        public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
        public virtual ICollection<GroupMember> GroupMemberships { get; set; } = new List<GroupMember>();
        public virtual ICollection<Session> Sessions { get; set; } = new List<Session>();
        public virtual ICollection<MfaEnrollment> MfaEnrollments { get; set; } = new List<MfaEnrollment>();
    }
    
    public class Role
    {
        public Guid Id { get; set; }
        
        [Required]
        [MaxLength(256)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(256)]
        public string NormalizedName { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        
        public bool IsSystemRole { get; set; } = false;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        public Guid? CreatedBy { get; set; }
        
        public Guid? UpdatedBy { get; set; }
        
        public byte[] RowVersion { get; set; } = Array.Empty<byte>();
        
        // Navigation properties
        public virtual ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
        public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
        public virtual ICollection<GroupRole> GroupRoles { get; set; } = new List<GroupRole>();
    }
    
    public class Resource
    {
        public Guid Id { get; set; }
        
        [Required]
        [MaxLength(256)]
        public string Name { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string ResourceType { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        public Guid? CreatedBy { get; set; }
        
        public Guid? UpdatedBy { get; set; }
        
        public byte[] RowVersion { get; set; } = Array.Empty<byte>();
        
        // Navigation properties
        public virtual ICollection<Permission> Permissions { get; set; } = new List<Permission>();
    }
    
    public class Permission
    {
        public Guid Id { get; set; }
        
        [Required]
        public Guid ResourceId { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string Action { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(256)]
        public string Name { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        public Guid? CreatedBy { get; set; }
        
        public Guid? UpdatedBy { get; set; }
        
        public byte[] RowVersion { get; set; } = Array.Empty<byte>();
        
        // Navigation properties
        public virtual Resource Resource { get; set; } = null!;
        public virtual ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
    }
    
    public class RolePermission
    {
        public Guid Id { get; set; }
        
        [Required]
        public Guid RoleId { get; set; }
        
        [Required]
        public Guid PermissionId { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string ScopeType { get; set; } = "Global";
        
        public Guid? ScopeId { get; set; }
        
        public DateTime GrantedAt { get; set; } = DateTime.UtcNow;
        
        public Guid? GrantedBy { get; set; }
        
        // Navigation properties
        public virtual Role Role { get; set; } = null!;
        public virtual Permission Permission { get; set; } = null!;
    }
    
    public class UserRole
    {
        public Guid Id { get; set; }
        
        [Required]
        public Guid UserId { get; set; }
        
        [Required]
        public Guid RoleId { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string ScopeType { get; set; } = "Global";
        
        public Guid? ScopeId { get; set; }
        
        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
        
        public Guid? AssignedBy { get; set; }
        
        public DateTime? ExpiresAt { get; set; }
        
        public string? Reason { get; set; }
        
        // Navigation properties
        public virtual User User { get; set; } = null!;
        public virtual Role Role { get; set; } = null!;
    }
    
    public class Group
    {
        public Guid Id { get; set; }
        
        [Required]
        [MaxLength(256)]
        public string Name { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string GroupType { get; set; } = string.Empty;
        
        public Guid? ParentGroupId { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        public Guid? CreatedBy { get; set; }
        
        public Guid? UpdatedBy { get; set; }
        
        public byte[] RowVersion { get; set; } = Array.Empty<byte>();
        
        // Navigation properties
        public virtual Group? ParentGroup { get; set; }
        public virtual ICollection<Group> SubGroups { get; set; } = new List<Group>();
        public virtual ICollection<GroupMember> Members { get; set; } = new List<GroupMember>();
        public virtual ICollection<GroupRole> GroupRoles { get; set; } = new List<GroupRole>();
    }
    
    public class GroupMember
    {
        public Guid Id { get; set; }
        
        [Required]
        public Guid GroupId { get; set; }
        
        [Required]
        public Guid UserId { get; set; }
        
        public bool IsManager { get; set; } = false;
        
        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
        
        public Guid? AddedBy { get; set; }
        
        // Navigation properties
        public virtual Group Group { get; set; } = null!;
        public virtual User User { get; set; } = null!;
    }
    
    public class GroupRole
    {
        public Guid Id { get; set; }
        
        [Required]
        public Guid GroupId { get; set; }
        
        [Required]
        public Guid RoleId { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string ScopeType { get; set; } = "Global";
        
        public Guid? ScopeId { get; set; }
        
        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
        
        public Guid? AssignedBy { get; set; }
        
        // Navigation properties
        public virtual Group Group { get; set; } = null!;
        public virtual Role Role { get; set; } = null!;
    }
    
    public class AccessRequest
    {
        public Guid Id { get; set; }
        
        [Required]
        public Guid RequesterId { get; set; }
        
        public Guid? TargetUserId { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string RequestType { get; set; } = string.Empty;
        
        public Guid? TargetRoleId { get; set; }
        
        public Guid? TargetGroupId { get; set; }
        
        [MaxLength(50)]
        public string? ScopeType { get; set; }
        
        public Guid? ScopeId { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string Status { get; set; } = "Pending";
        
        [Required]
        public string Justification { get; set; } = string.Empty;
        
        public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
        
        public int RequiresApprovals { get; set; } = 2;
        
        public DateTime? SlaDeadline { get; set; }
        
        public DateTime? CompletedAt { get; set; }
        
        public DateTime? CancelledAt { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        public byte[] RowVersion { get; set; } = Array.Empty<byte>();
        
        // Navigation properties
        public virtual User Requester { get; set; } = null!;
        public virtual User? TargetUser { get; set; }
        public virtual Role? TargetRole { get; set; }
        public virtual Group? TargetGroup { get; set; }
        public virtual ICollection<Approval> Approvals { get; set; } = new List<Approval>();
    }
    
    public class Approval
    {
        public Guid Id { get; set; }
        
        [Required]
        public Guid AccessRequestId { get; set; }
        
        [Required]
        public Guid ApproverId { get; set; }
        
        public int ApprovalLevel { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string Status { get; set; } = "Pending";
        
        public string? Comments { get; set; }
        
        public DateTime? ApprovedAt { get; set; }
        
        public DateTime? RejectedAt { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual AccessRequest AccessRequest { get; set; } = null!;
        public virtual User Approver { get; set; } = null!;
    }
    
    public class Policy
    {
        public Guid Id { get; set; }
        
        [Required]
        [MaxLength(256)]
        public string Name { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string PolicyType { get; set; } = string.Empty;
        
        public bool IsActive { get; set; } = true;
        
        public int Priority { get; set; } = 0;
        
        [Required]
        public string Conditions { get; set; } = "{}";
        
        [Required]
        [MaxLength(50)]
        public string Effect { get; set; } = "Allow";
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        public Guid? CreatedBy { get; set; }
        
        public Guid? UpdatedBy { get; set; }
        
        public byte[] RowVersion { get; set; } = Array.Empty<byte>();
    }
    
    public class AuditLog
    {
        public Guid Id { get; set; }
        
        public Guid? UserId { get; set; }
        
        [Required]
        [MaxLength(256)]
        public string Action { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(100)]
        public string ResourceType { get; set; } = string.Empty;
        
        [MaxLength(256)]
        public string? ResourceId { get; set; }
        
        public string? Description { get; set; }
        
        public string? OldValues { get; set; }
        
        public string? NewValues { get; set; }
        
        [MaxLength(45)]
        public string? IpAddress { get; set; }
        
        public string? UserAgent { get; set; }
        
        public DateTime PerformedAt { get; set; } = DateTime.UtcNow;
        
        [Required]
        [MaxLength(64)]
        public string IntegrityHash { get; set; } = string.Empty;
        
        // Navigation properties
        public virtual User? User { get; set; }
    }
    
    public class Session
    {
        public Guid Id { get; set; }
        
        [Required]
        public Guid UserId { get; set; }
        
        [Required]
        [MaxLength(256)]
        public string SessionToken { get; set; } = string.Empty;
        
        [MaxLength(256)]
        public string? RefreshToken { get; set; }
        
        [MaxLength(45)]
        public string? IpAddress { get; set; }
        
        public string? UserAgent { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime ExpiresAt { get; set; }
        
        public DateTime LastActivityAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? TerminatedAt { get; set; }
        
        public Guid? TerminatedBy { get; set; }
        
        // Navigation properties
        public virtual User User { get; set; } = null!;
    }
    
    public class MfaEnrollment
    {
        public Guid Id { get; set; }
        
        [Required]
        public Guid UserId { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string MfaType { get; set; } = string.Empty;
        
        public bool IsEnabled { get; set; } = true;
        
        public bool IsVerified { get; set; } = false;
        
        public string? Secret { get; set; }
        
        [MaxLength(20)]
        public string? PhoneNumber { get; set; }
        
        public string? RecoveryCodes { get; set; }
        
        public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? LastUsedAt { get; set; }
        
        // Navigation properties
        public virtual User User { get; set; } = null!;
    }
    
    public class ApiKey
    {
        public Guid Id { get; set; }
        
        public Guid? UserId { get; set; }
        
        [Required]
        [MaxLength(256)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(256)]
        public string KeyHash { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(16)]
        public string Prefix { get; set; } = string.Empty;
        
        [Required]
        public string Scopes { get; set; } = "[]";
        
        public bool IsActive { get; set; } = true;
        
        public DateTime? ExpiresAt { get; set; }
        
        public DateTime? LastUsedAt { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? RevokedAt { get; set; }
        
        public Guid? RevokedBy { get; set; }
        
        // Navigation properties
        public virtual User? User { get; set; }
    }
}
