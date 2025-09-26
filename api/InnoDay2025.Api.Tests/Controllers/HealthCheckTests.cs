using System.Net;
using FluentAssertions;
using InnoDay2025.Api.Tests.Infrastructure;
using Xunit;

namespace InnoDay2025.Api.Tests.Controllers;

/// <summary>
/// Integration tests for health check endpoints
/// </summary>
public class HealthCheckTests : TestBase
{
    public HealthCheckTests(CustomWebApplicationFactory<Program> factory) : base(factory)
    {
    }

    [Fact]
    public async Task HealthCheck_ReturnsHealthy()
    {
        // Act
        var response = await Client.GetAsync("/health");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var content = await response.Content.ReadAsStringAsync();
        content.Should().Be("Healthy");
    }

    [Fact]
    public async Task HealthCheckReady_ReturnsHealthy()
    {
        // Act
        var response = await Client.GetAsync("/health/ready");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var content = await response.Content.ReadAsStringAsync();
        content.Should().Be("Healthy");
    }

    [Fact]
    public async Task HealthCheck_IncludesCorrectHeaders()
    {
        // Act
        var response = await Client.GetAsync("/health");

        // Assert
        response.Headers.Should().ContainKey("X-Request-Id");
        response.Headers.GetValues("X-Request-Id").Should().HaveCount(1);
        response.Headers.GetValues("X-Request-Id").First().Should().NotBeEmpty();
    }
}