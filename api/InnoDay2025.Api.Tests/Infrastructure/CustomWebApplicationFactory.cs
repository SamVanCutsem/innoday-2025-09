using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using InnoDay2025.Api.Data;

namespace InnoDay2025.Api.Tests.Infrastructure;

/// <summary>
/// Custom web application factory for integration tests
/// </summary>
/// <typeparam name="TProgram">The program type</typeparam>
public class CustomWebApplicationFactory<TProgram> : WebApplicationFactory<TProgram> where TProgram : class
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // Remove the existing database context registration
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>));

            if (descriptor != null)
            {
                services.Remove(descriptor);
            }

            // Add a database context using an in-memory database for testing
            services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseInMemoryDatabase("InnoDay2025TestDb");
            });

            // Build the service provider
            var serviceProvider = services.BuildServiceProvider();

            // Create a scope to obtain a reference to the database context
            using var scope = serviceProvider.CreateScope();
            var scopedServices = scope.ServiceProvider;
            var db = scopedServices.GetRequiredService<ApplicationDbContext>();
            var logger = scopedServices.GetRequiredService<ILogger<CustomWebApplicationFactory<TProgram>>>();

            // Ensure the database is created
            db.Database.EnsureCreated();

            try
            {
                // Seed the database with test data
                SeedTestData(db);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred seeding the database with test data");
            }
        });

        builder.UseEnvironment("Testing");
    }

    public static void SeedTestData(ApplicationDbContext context)
    {
        // Clear existing data
        context.Products.RemoveRange(context.Products);
        context.Users.RemoveRange(context.Users);
        context.SaveChanges();

        // Add test users
        var testUsers = new[]
        {
            new InnoDay2025.Api.Models.User
            {
                Id = 1,
                FirstName = "Test",
                LastName = "User",
                Email = "test.user@test.com",
                PhoneNumber = "+1-555-0001",
                Role = InnoDay2025.Api.Models.UserRole.User,
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddDays(-10),
                UpdatedAt = DateTime.UtcNow.AddDays(-10),
                LastLoginAt = DateTime.UtcNow.AddHours(-1)
            },
            new InnoDay2025.Api.Models.User
            {
                Id = 2,
                FirstName = "Admin",
                LastName = "User",
                Email = "admin.user@test.com",
                PhoneNumber = "+1-555-0002",
                Role = InnoDay2025.Api.Models.UserRole.Admin,
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddDays(-15),
                UpdatedAt = DateTime.UtcNow.AddDays(-15),
                LastLoginAt = DateTime.UtcNow.AddHours(-2)
            }
        };

        context.Users.AddRange(testUsers);
        context.SaveChanges();

        // Add test products
        var testProducts = new[]
        {
            new InnoDay2025.Api.Models.Product
            {
                Id = 1,
                Name = "Test Product 1",
                Description = "This is a test product for integration testing",
                Price = 99.99m,
                Category = "Electronics",
                StockQuantity = 10,
                Sku = "TEST-001",
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddDays(-5),
                UpdatedAt = DateTime.UtcNow.AddDays(-5),
                CreatedByUserId = 1
            },
            new InnoDay2025.Api.Models.Product
            {
                Id = 2,
                Name = "Test Product 2",
                Description = "Another test product for integration testing",
                Price = 149.99m,
                Category = "Books",
                StockQuantity = 5,
                Sku = "TEST-002",
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddDays(-3),
                UpdatedAt = DateTime.UtcNow.AddDays(-3),
                CreatedByUserId = 2
            },
            new InnoDay2025.Api.Models.Product
            {
                Id = 3,
                Name = "Inactive Product",
                Description = "This product is inactive for testing",
                Price = 75.00m,
                Category = "Electronics",
                StockQuantity = 0,
                Sku = "TEST-003",
                IsActive = false,
                CreatedAt = DateTime.UtcNow.AddDays(-7),
                UpdatedAt = DateTime.UtcNow.AddDays(-1),
                CreatedByUserId = 1
            }
        };

        context.Products.AddRange(testProducts);
        context.SaveChanges();
    }
}