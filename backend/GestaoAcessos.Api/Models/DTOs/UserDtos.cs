using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace GestaoAcessos.Api.Models.DTOs
{
    // Common response wrapper
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public T? Data { get; set; }
        public ErrorInfo? Error { get; set; }
        public ResponseMeta? Meta { get; set; }
    }
    
    public class ErrorInfo
    {
        public string Code { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public List<string>? Details { get; set; }
    }
    
    public class ResponseMeta
    {
        public DateTime Timestamp { get; set; }
        public string RequestId { get; set; } = string.Empty;
    }
    
    // Pagination
    public class PagedResult<T>
    {
        public List<T> Data { get; set; } = new();
        public PaginationInfo Pagination { get; set; } = new();
    }
    
    public class PaginationInfo
    {
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public int TotalItems { get; set; }
        public bool HasNext { get; set; }
        public bool HasPrevious { get; set; }
    }
    
    // User DTOs
    public class UserDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public bool IsLocked { get; set; }
        public DateTime? LastLoginAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<UserRoleDto> Roles { get; set; } = new();
        public List<string> Groups { get; set; } = new();
        public bool MfaEnabled { get; set; }
    }
    
    public class UserRoleDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string ScopeType { get; set; } = string.Empty;
        public Guid? ScopeId { get; set; }
    }
    
    public class UserDetailDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public bool IsLocked { get; set; }
        public DateTime? LockedUntil { get; set; }
        public DateTime? LastLoginAt { get; set; }
        public int FailedLoginAttempts { get; set; }
        public bool MustChangePwd { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<UserRoleDetailDto> Roles { get; set; } = new();
        public List<GroupMembershipDto> Groups { get; set; } = new();
        public List<EffectivePermissionDto> EffectivePermissions { get; set; } = new();
        public List<SessionDto> ActiveSessions { get; set; } = new();
        public List<MfaEnrollmentDto> MfaEnrollments { get; set; } = new();
    }
    
    public class UserRoleDetailDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime AssignedAt { get; set; }
        public Guid? AssignedBy { get; set; }
        public DateTime? ExpiresAt { get; set; }
        public string ScopeType { get; set; } = string.Empty;
        public Guid? ScopeId { get; set; }
    }
    
    public class GroupMembershipDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public bool IsManager { get; set; }
        public DateTime JoinedAt { get; set; }
    }
    
    public class EffectivePermissionDto
    {
        public string Resource { get; set; } = string.Empty;
        public List<string> Actions { get; set; } = new();
        public string ScopeType { get; set; } = string.Empty;
        public Guid? ScopeId { get; set; }
    }
    
    public class SessionDto
    {
        public Guid Id { get; set; }
        public string IpAddress { get; set; } = string.Empty;
        public string UserAgent { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime LastActivityAt { get; set; }
    }
    
    public class MfaEnrollmentDto
    {
        public Guid Id { get; set; }
        public string MfaType { get; set; } = string.Empty;
        public bool IsEnabled { get; set; }
        public bool IsVerified { get; set; }
        public DateTime EnrolledAt { get; set; }
        public DateTime? LastUsedAt { get; set; }
    }
    
    // Request DTOs
    public class CreateUserRequestDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string UserName { get; set; } = string.Empty;
        
        public bool MustChangePwd { get; set; } = true;
        
        public List<RoleAssignmentDto>? Roles { get; set; }
        
        public List<Guid>? Groups { get; set; }
        
        [Required]
        public string Reason { get; set; } = string.Empty;
    }
    
    public class RoleAssignmentDto
    {
        [Required]
        public Guid RoleId { get; set; }
        
        [Required]
        public string ScopeType { get; set; } = "Global";
        
        public Guid? ScopeId { get; set; }
        
        public DateTime? ExpiresAt { get; set; }
    }
    
    public class CreateUserResponseDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string TemporaryPassword { get; set; } = string.Empty;
        public bool MustChangePwd { get; set; }
    }
    
    public class UpdateUserRequestDto
    {
        public string? UserName { get; set; }
        public bool? IsActive { get; set; }
        
        [Required]
        public string Reason { get; set; } = string.Empty;
    }
    
    public class AssignRolesRequestDto
    {
        [Required]
        public List<RoleAssignmentDto> Roles { get; set; } = new();
        
        [Required]
        public string Reason { get; set; } = string.Empty;
    }
    
    public class LockUserRequestDto
    {
        [Required]
        public string Reason { get; set; } = string.Empty;
        
        public DateTime? LockUntil { get; set; }
    }
    
    public class UnlockUserRequestDto
    {
        [Required]
        public string Reason { get; set; } = string.Empty;
    }
    
    public class TerminateSessionsRequestDto
    {
        public List<Guid>? SessionIds { get; set; } // null/empty = all sessions
        
        [Required]
        public string Reason { get; set; } = string.Empty;
    }
    
    public class RequireMfaRequestDto
    {
        [Required]
        public string MfaType { get; set; } = "TOTP";
        
        [Required]
        public string Reason { get; set; } = string.Empty;
    }
    
    public class ResetMfaRequestDto
    {
        [Required]
        public string Reason { get; set; } = string.Empty;
    }
    
    public class BulkOperationRequestDto
    {
        [Required]
        public string Operation { get; set; } = string.Empty; // assignRole, requireMfa, lock, unlock, delete
        
        [Required]
        public List<Guid> UserIds { get; set; } = new();
        
        public Dictionary<string, object>? Parameters { get; set; }
        
        [Required]
        public string Reason { get; set; } = string.Empty;
    }
    
    public class BulkOperationResultDto
    {
        public int TotalProcessed { get; set; }
        public int SuccessCount { get; set; }
        public int FailureCount { get; set; }
        public List<BulkOperationError> Errors { get; set; } = new();
    }
    
    public class BulkOperationError
    {
        public Guid UserId { get; set; }
        public string ErrorCode { get; set; } = string.Empty;
        public string ErrorMessage { get; set; } = string.Empty;
    }
}
