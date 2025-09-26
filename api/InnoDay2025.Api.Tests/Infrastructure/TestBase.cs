using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using InnoDay2025.Api.Data;
using System.Text;
using System.Text.Json;
using Xunit;

namespace InnoDay2025.Api.Tests.Infrastructure;

/// <summary>
/// Base class for integration tests with common functionality
/// </summary>
public abstract class TestBase : IClassFixture<CustomWebApplicationFactory<Program>>, IDisposable
{
    protected readonly CustomWebApplicationFactory<Program> Factory;
    protected readonly HttpClient Client;
    protected readonly JsonSerializerOptions JsonOptions;

    protected TestBase(CustomWebApplicationFactory<Program> factory)
    {
        Factory = factory;
        Client = factory.CreateClient();

        JsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            PropertyNameCaseInsensitive = true
        };
    }

    /// <summary>
    /// Get the database context for test operations
    /// </summary>
    /// <returns>Application database context</returns>
    protected ApplicationDbContext GetDbContext()
    {
        var scope = Factory.Services.CreateScope();
        return scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    }

    /// <summary>
    /// Create HTTP content from an object
    /// </summary>
    /// <param name="obj">Object to serialize</param>
    /// <returns>StringContent with JSON</returns>
    protected StringContent CreateJsonContent(object obj)
    {
        var json = JsonSerializer.Serialize(obj, JsonOptions);
        return new StringContent(json, Encoding.UTF8, "application/json");
    }

    /// <summary>
    /// Deserialize HTTP response content to an object
    /// </summary>
    /// <typeparam name="T">Target type</typeparam>
    /// <param name="response">HTTP response</param>
    /// <returns>Deserialized object</returns>
    protected async Task<T?> DeserializeResponseAsync<T>(HttpResponseMessage response)
    {
        var content = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<T>(content, JsonOptions);
    }

    /// <summary>
    /// Set API version header
    /// </summary>
    /// <param name="version">API version</param>
    protected void SetApiVersion(string version)
    {
        Client.DefaultRequestHeaders.Remove("X-Version");
        Client.DefaultRequestHeaders.Add("X-Version", version);
    }

    /// <summary>
    /// Reset the database to a clean state
    /// </summary>
    protected void ResetDatabase()
    {
        using var context = GetDbContext();
        context.Products.RemoveRange(context.Products);
        context.Users.RemoveRange(context.Users);
        context.SaveChanges();

        // Re-seed with test data
        CustomWebApplicationFactory<Program>.SeedTestData(context);
    }

    public virtual void Dispose()
    {
        Client?.Dispose();
        GC.SuppressFinalize(this);
    }
}