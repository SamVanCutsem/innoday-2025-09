using System.Diagnostics;

namespace InnoDay2025.Api.Middleware;

/// <summary>
/// Middleware for logging HTTP requests and responses
/// </summary>
public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;

    public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var stopwatch = Stopwatch.StartNew();
        var requestId = Guid.NewGuid().ToString("N")[..8];

        // Add request ID to response headers
        context.Response.Headers.TryAdd("X-Request-Id", requestId);

        // Log request
        _logger.LogInformation(
            "Request {RequestId}: {Method} {Path}{QueryString} from {RemoteIpAddress}",
            requestId,
            context.Request.Method,
            context.Request.Path,
            context.Request.QueryString,
            context.Connection.RemoteIpAddress?.ToString() ?? "unknown");

        // Continue to next middleware
        await _next(context);

        stopwatch.Stop();

        // Log response
        _logger.LogInformation(
            "Response {RequestId}: {StatusCode} in {ElapsedMilliseconds}ms",
            requestId,
            context.Response.StatusCode,
            stopwatch.ElapsedMilliseconds);

        // Log slow requests as warnings
        if (stopwatch.ElapsedMilliseconds > 5000) // 5 seconds
        {
            _logger.LogWarning(
                "Slow request {RequestId}: {Method} {Path} took {ElapsedMilliseconds}ms",
                requestId,
                context.Request.Method,
                context.Request.Path,
                stopwatch.ElapsedMilliseconds);
        }
    }
}