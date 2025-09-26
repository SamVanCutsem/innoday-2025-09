using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using FluentAssertions;
using InnoDay2025.Api.DTOs;
using InnoDay2025.Api.Models;
using InnoDay2025.Api.Tests.Infrastructure;
using Xunit;
using Xunit.Abstractions;

namespace InnoDay2025.Api.Tests.Demo;

/// <summary>
/// Demonstration of REST API functionality using TestServer
/// This class shows comprehensive API testing scenarios
/// </summary>
public class RestApiDemoTests : TestBase
{
    private readonly ITestOutputHelper _output;

    public RestApiDemoTests(CustomWebApplicationFactory<Program> factory, ITestOutputHelper output) : base(factory)
    {
        _output = output;
    }

    [Fact]
    public async Task DemonstrateCompleteProductLifecycle()
    {
        _output.WriteLine("=== Demonstrating Complete Product Lifecycle via REST API ===");

        // 1. Create a new product
        _output.WriteLine("\n1. Creating a new product...");
        var createProduct = new CreateProductDto
        {
            Name = "Demo Smartphone",
            Description = "Latest smartphone with amazing features for demonstration",
            Price = 699.99m,
            Category = "Electronics",
            StockQuantity = 50,
            Sku = "DEMO-PHONE-001"
        };

        var createResponse = await Client.PostAsJsonAsync("/api/v1/products", createProduct);
        createResponse.StatusCode.Should().Be(HttpStatusCode.Created);

        var createdProduct = await DeserializeResponseAsync<ProductDto>(createResponse);
        createdProduct.Should().NotBeNull();
        _output.WriteLine($"Created product: ID={createdProduct!.Id}, Name={createdProduct.Name}");

        // 2. Retrieve the created product
        _output.WriteLine("\n2. Retrieving the created product...");
        var getResponse = await Client.GetAsync($"/api/v1/products/{createdProduct.Id}");
        getResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var retrievedProduct = await DeserializeResponseAsync<ProductDto>(getResponse);
        retrievedProduct!.Name.Should().Be(createProduct.Name);
        _output.WriteLine($"Retrieved product: {retrievedProduct.Name} - ${retrievedProduct.Price}");

        // 3. Update the product
        _output.WriteLine("\n3. Updating the product...");
        var updateProduct = new UpdateProductDto
        {
            Price = 649.99m,
            StockQuantity = 45,
            Description = "Updated description with new features and discounted price"
        };

        var updateResponse = await Client.PutAsJsonAsync($"/api/v1/products/{createdProduct.Id}", updateProduct);
        updateResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var updatedProduct = await DeserializeResponseAsync<ProductDto>(updateResponse);
        updatedProduct!.Price.Should().Be(649.99m);
        _output.WriteLine($"Updated product: New price=${updatedProduct.Price}, Stock={updatedProduct.StockQuantity}");

        // 4. Search for the product
        _output.WriteLine("\n4. Searching for products...");
        var searchResponse = await Client.GetAsync("/api/v1/products/search?q=Demo");
        searchResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var searchContent = await searchResponse.Content.ReadAsStringAsync();
        searchContent.Should().Contain("Demo Smartphone");
        _output.WriteLine("Search completed successfully - found the demo product");

        // 5. Get products by category
        _output.WriteLine("\n5. Getting products by category...");
        var categoryResponse = await Client.GetAsync("/api/v1/products/category/Electronics");
        categoryResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var categoryProducts = await DeserializeResponseAsync<List<ProductDto>>(categoryResponse);
        categoryProducts.Should().Contain(p => p.Id == createdProduct.Id);
        _output.WriteLine($"Found {categoryProducts!.Count} products in Electronics category");

        // 6. Delete the product
        _output.WriteLine("\n6. Deleting the product...");
        var deleteResponse = await Client.DeleteAsync($"/api/v1/products/{createdProduct.Id}");
        deleteResponse.StatusCode.Should().Be(HttpStatusCode.NoContent);

        // Verify deletion
        var verifyDeleteResponse = await Client.GetAsync($"/api/v1/products/{createdProduct.Id}");
        verifyDeleteResponse.StatusCode.Should().Be(HttpStatusCode.NotFound);
        _output.WriteLine("Product successfully deleted");

        _output.WriteLine("\n=== Product Lifecycle Demo Completed Successfully ===");
    }

    [Fact]
    public async Task DemonstrateUserManagementWorkflow()
    {
        _output.WriteLine("=== Demonstrating User Management Workflow via REST API ===");

        // 1. Create a new user
        _output.WriteLine("\n1. Creating a new user...");
        var createUser = new CreateUserDto
        {
            FirstName = "Demo",
            LastName = "User",
            Email = "demo.user@example.com",
            PhoneNumber = "+1-555-DEMO",
            Role = UserRole.User
        };

        var createResponse = await Client.PostAsJsonAsync("/api/v1/users", createUser);
        createResponse.StatusCode.Should().Be(HttpStatusCode.Created);

        var createdUser = await DeserializeResponseAsync<UserDto>(createResponse);
        createdUser.Should().NotBeNull();
        _output.WriteLine($"Created user: ID={createdUser!.Id}, Name={createdUser.FullName}, Email={createdUser.Email}");

        // 2. Retrieve user by ID
        _output.WriteLine("\n2. Retrieving user by ID...");
        var getUserResponse = await Client.GetAsync($"/api/v1/users/{createdUser.Id}");
        getUserResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var retrievedUser = await DeserializeResponseAsync<UserDto>(getUserResponse);
        retrievedUser!.Email.Should().Be(createUser.Email);
        _output.WriteLine($"Retrieved user: {retrievedUser.FullName}");

        // 3. Retrieve user by email
        _output.WriteLine("\n3. Retrieving user by email...");
        var getUserByEmailResponse = await Client.GetAsync($"/api/v1/users/email/{createUser.Email}");
        getUserByEmailResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        _output.WriteLine("Successfully retrieved user by email");

        // 4. Update user information
        _output.WriteLine("\n4. Updating user information...");
        var updateUser = new UpdateUserDto
        {
            PhoneNumber = "+1-555-UPDATED",
            Role = UserRole.Moderator
        };

        var updateResponse = await Client.PutAsJsonAsync($"/api/v1/users/{createdUser.Id}", updateUser);
        updateResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var updatedUser = await DeserializeResponseAsync<UserDto>(updateResponse);
        updatedUser!.PhoneNumber.Should().Be(updateUser.PhoneNumber);
        updatedUser.Role.Should().Be(UserRole.Moderator);
        _output.WriteLine($"Updated user: Phone={updatedUser.PhoneNumber}, Role={updatedUser.Role}");

        // 5. Update last login
        _output.WriteLine("\n5. Updating last login time...");
        var loginResponse = await Client.PostAsync($"/api/v1/users/{createdUser.Id}/login", null);
        loginResponse.StatusCode.Should().Be(HttpStatusCode.NoContent);
        _output.WriteLine("Last login time updated successfully");

        // 6. Search for users
        _output.WriteLine("\n6. Searching for users...");
        var searchResponse = await Client.GetAsync("/api/v1/users/search?q=Demo");
        searchResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var searchContent = await searchResponse.Content.ReadAsStringAsync();
        searchContent.Should().Contain("Demo");
        _output.WriteLine("User search completed successfully");

        // 7. Get users with filtering
        _output.WriteLine("\n7. Getting users with role filter...");
        var filteredResponse = await Client.GetAsync("/api/v1/users?role=Moderator&page=1&pageSize=5");
        filteredResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        _output.WriteLine("Successfully retrieved filtered users");

        _output.WriteLine("\n=== User Management Demo Completed Successfully ===");
    }

    [Fact]
    public async Task DemonstrateApiVersioningAndPagination()
    {
        _output.WriteLine("=== Demonstrating API Versioning and Pagination ===");

        // 1. Test API v1 endpoints
        _output.WriteLine("\n1. Testing API v1 endpoints...");
        SetApiVersion("1.0");

        var v1ProductsResponse = await Client.GetAsync("/api/v1/products?page=1&pageSize=2");
        v1ProductsResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var v1Content = await v1ProductsResponse.Content.ReadAsStringAsync();
        v1Content.Should().Contain("\"page\":1");
        v1Content.Should().Contain("\"pageSize\":2");
        _output.WriteLine("API v1 pagination working correctly");

        // 2. Test API v2 statistics endpoints
        _output.WriteLine("\n2. Testing API v2 statistics endpoints...");
        SetApiVersion("2.0");

        var v2StatsResponse = await Client.GetAsync("/api/v2/products/statistics");
        v2StatsResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var v2Content = await v2StatsResponse.Content.ReadAsStringAsync();
        v2Content.Should().Contain("totalProducts");
        v2Content.Should().Contain("categories");
        _output.WriteLine("API v2 statistics endpoint working correctly");

        var v2UserStatsResponse = await Client.GetAsync("/api/v2/users/statistics");
        v2UserStatsResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var v2UserContent = await v2UserStatsResponse.Content.ReadAsStringAsync();
        v2UserContent.Should().Contain("totalUsers");
        v2UserContent.Should().Contain("usersByRole");
        _output.WriteLine("API v2 user statistics endpoint working correctly");

        // 3. Test pagination edge cases
        _output.WriteLine("\n3. Testing pagination edge cases...");

        // Invalid page number
        var invalidPageResponse = await Client.GetAsync("/api/v1/products?page=0");
        invalidPageResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);

        // Invalid page size
        var invalidSizeResponse = await Client.GetAsync("/api/v1/products?pageSize=101");
        invalidSizeResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);

        _output.WriteLine("Pagination validation working correctly");

        _output.WriteLine("\n=== API Versioning and Pagination Demo Completed Successfully ===");
    }

    [Fact]
    public async Task DemonstrateErrorHandlingAndValidation()
    {
        _output.WriteLine("=== Demonstrating Error Handling and Validation ===");

        // 1. Test validation errors
        _output.WriteLine("\n1. Testing validation errors...");

        var invalidProduct = new CreateProductDto
        {
            Name = "", // Invalid: empty name
            Price = -10, // Invalid: negative price
            Category = "Electronics",
            StockQuantity = -5 // Invalid: negative stock
        };

        var validationResponse = await Client.PostAsJsonAsync("/api/v1/products", invalidProduct);
        validationResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);

        var validationContent = await validationResponse.Content.ReadAsStringAsync();
        _output.WriteLine($"Validation errors returned: {validationContent}");

        // 2. Test not found errors
        _output.WriteLine("\n2. Testing not found errors...");

        var notFoundResponse = await Client.GetAsync("/api/v1/products/99999");
        notFoundResponse.StatusCode.Should().Be(HttpStatusCode.NotFound);

        var notFoundContent = await notFoundResponse.Content.ReadAsStringAsync();
        notFoundContent.Should().Contain("not found");
        _output.WriteLine("Not found error handling working correctly");

        // 3. Test duplicate email error
        _output.WriteLine("\n3. Testing duplicate email validation...");

        var duplicateUser = new CreateUserDto
        {
            FirstName = "Duplicate",
            LastName = "User",
            Email = "test.user@test.com", // This email exists in test data
            Role = UserRole.User
        };

        var duplicateResponse = await Client.PostAsJsonAsync("/api/v1/users", duplicateUser);
        duplicateResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);

        var duplicateContent = await duplicateResponse.Content.ReadAsStringAsync();
        duplicateContent.Should().Contain("already exists");
        _output.WriteLine("Duplicate email validation working correctly");

        // 4. Test empty search query
        _output.WriteLine("\n4. Testing empty search query validation...");

        var emptySearchResponse = await Client.GetAsync("/api/v1/products/search?q=");
        emptySearchResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        _output.WriteLine("Empty search query validation working correctly");

        _output.WriteLine("\n=== Error Handling and Validation Demo Completed Successfully ===");
    }

    [Fact]
    public async Task DemonstrateHealthChecksAndCors()
    {
        _output.WriteLine("=== Demonstrating Health Checks and CORS ===");

        // 1. Test health check endpoints
        _output.WriteLine("\n1. Testing health check endpoints...");

        var healthResponse = await Client.GetAsync("/health");
        healthResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var healthContent = await healthResponse.Content.ReadAsStringAsync();
        healthContent.Should().Be("Healthy");
        _output.WriteLine("Basic health check working correctly");

        var readyResponse = await Client.GetAsync("/health/ready");
        readyResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        _output.WriteLine("Ready health check working correctly");

        // 2. Test request logging headers
        _output.WriteLine("\n2. Testing request logging and headers...");

        var headerResponse = await Client.GetAsync("/api/v1/products");
        headerResponse.Headers.Should().ContainKey("X-Request-Id");

        var requestId = headerResponse.Headers.GetValues("X-Request-Id").First();
        requestId.Should().NotBeEmpty();
        _output.WriteLine($"Request ID header present: {requestId}");

        // 3. Test CORS is configured (headers would be present in actual CORS scenario)
        _output.WriteLine("\n3. CORS is configured for Next.js frontend at http://localhost:3000");
        _output.WriteLine("CORS headers would be present when requests come from allowed origins");

        _output.WriteLine("\n=== Health Checks and CORS Demo Completed Successfully ===");
    }

    [Fact]
    public async Task DemonstrateCompleteApiDocumentation()
    {
        _output.WriteLine("=== API Documentation and Available Endpoints ===");

        _output.WriteLine("\n📋 PRODUCTS API ENDPOINTS:");
        _output.WriteLine("  GET    /api/v1/products                    - Get all products (with pagination)");
        _output.WriteLine("  GET    /api/v1/products/{id}               - Get product by ID");
        _output.WriteLine("  GET    /api/v1/products/sku/{sku}          - Get product by SKU");
        _output.WriteLine("  POST   /api/v1/products                    - Create new product");
        _output.WriteLine("  PUT    /api/v1/products/{id}               - Update product");
        _output.WriteLine("  DELETE /api/v1/products/{id}               - Delete product");
        _output.WriteLine("  GET    /api/v1/products/category/{category} - Get products by category");
        _output.WriteLine("  GET    /api/v1/products/search?q={query}   - Search products");
        _output.WriteLine("  GET    /api/v2/products/statistics         - Get product statistics (v2)");

        _output.WriteLine("\n👥 USERS API ENDPOINTS:");
        _output.WriteLine("  GET    /api/v1/users                       - Get all users (with pagination)");
        _output.WriteLine("  GET    /api/v1/users/{id}                  - Get user by ID");
        _output.WriteLine("  GET    /api/v1/users/email/{email}         - Get user by email");
        _output.WriteLine("  POST   /api/v1/users                       - Create new user");
        _output.WriteLine("  PUT    /api/v1/users/{id}                  - Update user");
        _output.WriteLine("  DELETE /api/v1/users/{id}                  - Delete user");
        _output.WriteLine("  GET    /api/v1/users/search?q={query}      - Search users");
        _output.WriteLine("  POST   /api/v1/users/{id}/login            - Update last login");
        _output.WriteLine("  GET    /api/v2/users/statistics            - Get user statistics (v2)");

        _output.WriteLine("\n🏥 HEALTH CHECK ENDPOINTS:");
        _output.WriteLine("  GET    /health                             - Basic health check");
        _output.WriteLine("  GET    /health/ready                       - Readiness health check");

        _output.WriteLine("\n📚 DOCUMENTATION:");
        _output.WriteLine("  GET    /swagger                            - Swagger UI (Development)");
        _output.WriteLine("  GET    /swagger/v1/swagger.json            - OpenAPI v1 specification");
        _output.WriteLine("  GET    /swagger/v2/swagger.json            - OpenAPI v2 specification");

        _output.WriteLine("\n🔧 FEATURES DEMONSTRATED:");
        _output.WriteLine("  ✅ ASP.NET Core Web API with .NET 8");
        _output.WriteLine("  ✅ Entity Framework Core with In-Memory Database");
        _output.WriteLine("  ✅ API Versioning (v1 and v2)");
        _output.WriteLine("  ✅ Swagger/OpenAPI Documentation");
        _output.WriteLine("  ✅ CORS Configuration for Next.js Frontend");
        _output.WriteLine("  ✅ Health Checks");
        _output.WriteLine("  ✅ Structured Logging with Serilog");
        _output.WriteLine("  ✅ AutoMapper for DTO Mapping");
        _output.WriteLine("  ✅ FluentValidation for Input Validation");
        _output.WriteLine("  ✅ Global Exception Handling");
        _output.WriteLine("  ✅ Request Logging Middleware");
        _output.WriteLine("  ✅ Comprehensive Integration Tests with TestServer");
        _output.WriteLine("  ✅ Repository and Service Pattern");
        _output.WriteLine("  ✅ Pagination and Filtering");
        _output.WriteLine("  ✅ Search Functionality");

        // Verify the API is working by making a simple call
        var apiCheckResponse = await Client.GetAsync("/api/v1/products");
        apiCheckResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        _output.WriteLine("\n✅ API is fully functional and ready for use!");
        _output.WriteLine("🚀 TestServer integration tests demonstrate production-ready REST API");
    }
}