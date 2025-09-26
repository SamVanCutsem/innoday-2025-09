using InnoDay2025.Api.Models;

namespace InnoDay2025.Api.Data;

/// <summary>
/// Seeds initial data for development and testing
/// </summary>
public static class SeedData
{
    /// <summary>
    /// Initialize the database with seed data
    /// </summary>
    /// <param name="context">The database context</param>
    public static async Task Initialize(ApplicationDbContext context)
    {
        await context.Database.EnsureCreatedAsync();

        // Check if data already exists
        if (context.Users.Any())
        {
            return; // Database has been seeded
        }

        // Seed users
        var users = new List<User>
        {
            new User
            {
                FirstName = "John",
                LastName = "Doe",
                Email = "john.doe@innoday2025.com",
                PhoneNumber = "+1-555-0001",
                Role = UserRole.Admin,
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddDays(-30),
                UpdatedAt = DateTime.UtcNow.AddDays(-30),
                LastLoginAt = DateTime.UtcNow.AddHours(-2)
            },
            new User
            {
                FirstName = "Jane",
                LastName = "Smith",
                Email = "jane.smith@innoday2025.com",
                PhoneNumber = "+1-555-0002",
                Role = UserRole.Moderator,
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddDays(-25),
                UpdatedAt = DateTime.UtcNow.AddDays(-25),
                LastLoginAt = DateTime.UtcNow.AddHours(-5)
            },
            new User
            {
                FirstName = "Bob",
                LastName = "Johnson",
                Email = "bob.johnson@innoday2025.com",
                PhoneNumber = "+1-555-0003",
                Role = UserRole.User,
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddDays(-20),
                UpdatedAt = DateTime.UtcNow.AddDays(-20),
                LastLoginAt = DateTime.UtcNow.AddHours(-1)
            }
        };

        context.Users.AddRange(users);
        await context.SaveChangesAsync();

        // Seed products
        var products = new List<Product>
        {
            new Product
            {
                Name = "Wireless Bluetooth Headphones",
                Description = "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
                Price = 149.99m,
                Category = "Electronics",
                StockQuantity = 50,
                Sku = "WBH-001",
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddDays(-15),
                UpdatedAt = DateTime.UtcNow.AddDays(-15),
                CreatedByUserId = users[0].Id
            },
            new Product
            {
                Name = "Ergonomic Office Chair",
                Description = "Comfortable office chair with lumbar support and adjustable height.",
                Price = 299.99m,
                Category = "Furniture",
                StockQuantity = 25,
                Sku = "EOC-002",
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddDays(-12),
                UpdatedAt = DateTime.UtcNow.AddDays(-12),
                CreatedByUserId = users[1].Id
            },
            new Product
            {
                Name = "Smart Water Bottle",
                Description = "Smart water bottle with temperature control and hydration tracking.",
                Price = 79.99m,
                Category = "Health & Fitness",
                StockQuantity = 100,
                Sku = "SWB-003",
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddDays(-10),
                UpdatedAt = DateTime.UtcNow.AddDays(-10),
                CreatedByUserId = users[2].Id
            },
            new Product
            {
                Name = "Mechanical Gaming Keyboard",
                Description = "RGB backlit mechanical keyboard with Cherry MX switches for gaming.",
                Price = 129.99m,
                Category = "Electronics",
                StockQuantity = 75,
                Sku = "MGK-004",
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddDays(-8),
                UpdatedAt = DateTime.UtcNow.AddDays(-8),
                CreatedByUserId = users[0].Id
            },
            new Product
            {
                Name = "Organic Coffee Beans",
                Description = "Premium organic coffee beans sourced from sustainable farms.",
                Price = 24.99m,
                Category = "Food & Beverage",
                StockQuantity = 200,
                Sku = "OCB-005",
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddDays(-5),
                UpdatedAt = DateTime.UtcNow.AddDays(-5),
                CreatedByUserId = users[1].Id
            }
        };

        context.Products.AddRange(products);
        await context.SaveChangesAsync();
    }
}