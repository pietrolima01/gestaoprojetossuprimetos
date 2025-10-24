using Microsoft.AspNetCore.Mvc;

namespace GestaoAcessos.Api.Controllers;

/// <summary>
/// Health check and system status controller
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
public class HealthController : ControllerBase
{
    private readonly ILogger<HealthController> _logger;
    private readonly IConfiguration _configuration;

    public HealthController(ILogger<HealthController> logger, IConfiguration configuration)
    {
        _logger = logger;
        _configuration = configuration;
    }

    /// <summary>
    /// Basic health check endpoint
    /// </summary>
    /// <returns>Health status</returns>
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            status = "healthy",
            timestamp = DateTime.UtcNow,
            service = "Gestao de Acessos API",
            version = "1.0.0"
        });
    }

    /// <summary>
    /// Detailed system readiness check
    /// </summary>
    /// <returns>Detailed readiness status</returns>
    [HttpGet("ready")]
    public IActionResult Ready()
    {
        var checks = new List<HealthCheck>();

        // Check if configuration is loaded
        checks.Add(new HealthCheck
        {
            Component = "Configuration",
            Status = _configuration != null ? "healthy" : "unhealthy",
            Message = _configuration != null ? "Configuration loaded" : "Configuration not available"
        });

        // Check database connection string
        var connectionString = _configuration.GetConnectionString("DefaultConnection");
        checks.Add(new HealthCheck
        {
            Component = "DatabaseConfiguration",
            Status = !string.IsNullOrEmpty(connectionString) ? "healthy" : "warning",
            Message = !string.IsNullOrEmpty(connectionString) 
                ? "Database connection string configured" 
                : "Database connection string not configured"
        });

        // Check if running in development or production
        var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Unknown";
        checks.Add(new HealthCheck
        {
            Component = "Environment",
            Status = "healthy",
            Message = $"Running in {environment} mode"
        });

        // Overall status
        var overallStatus = checks.All(c => c.Status == "healthy") ? "ready" : 
                           checks.Any(c => c.Status == "unhealthy") ? "not_ready" : "ready_with_warnings";

        return Ok(new
        {
            status = overallStatus,
            timestamp = DateTime.UtcNow,
            service = "Gestao de Acessos API",
            version = "1.0.0",
            environment,
            checks = checks,
            warnings = new[]
            {
                "System is NOT production-ready",
                "Critical security features must be implemented",
                "See docs/SYSTEM_READINESS_REPORT.md for details"
            }
        });
    }

    /// <summary>
    /// Live check - always returns OK if service is running
    /// </summary>
    /// <returns>Live status</returns>
    [HttpGet("live")]
    public IActionResult Live()
    {
        return Ok(new
        {
            status = "alive",
            timestamp = DateTime.UtcNow
        });
    }

    /// <summary>
    /// System information and capabilities
    /// </summary>
    /// <returns>System information</returns>
    [HttpGet("info")]
    public IActionResult Info()
    {
        return Ok(new
        {
            service = "Gestao de Acessos API",
            version = "1.0.0",
            description = "Access Management System",
            environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Unknown",
            timestamp = DateTime.UtcNow,
            capabilities = new
            {
                userManagement = true,
                roleBasedAccessControl = true,
                attributeBasedAccessControl = true,
                groupManagement = true,
                accessRequestWorkflow = true,
                policyManagement = true,
                auditLogging = true,
                mfaSupport = true,
                sessionManagement = true,
                apiKeyManagement = true
            },
            productionReady = false,
            developmentReady = true,
            documentation = new
            {
                readme = "/README.md",
                api = "/docs/api-endpoints.md",
                security = "/docs/security-checklist.md",
                quickStart = "/docs/quick-start-guide.md",
                readinessReport = "/docs/SYSTEM_READINESS_REPORT.md"
            }
        });
    }
}

/// <summary>
/// Health check result model
/// </summary>
public class HealthCheck
{
    public string Component { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}
