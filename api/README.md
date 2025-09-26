# InnoDay 2025 REST API

A comprehensive ASP.NET Core Web API project built for REST API development with complete testing infrastructure using TestServer.

## 🚀 Features

- **ASP.NET Core 8.0** - Latest .NET framework
- **Entity Framework Core** - In-Memory database for development/testing
- **API Versioning** - Support for v1 and v2 endpoints
- **Swagger/OpenAPI** - Comprehensive API documentation
- **CORS Support** - Configured for Next.js frontend integration
- **Health Checks** - Application monitoring endpoints
- **Structured Logging** - Serilog with file and console output
- **AutoMapper** - Object-to-object mapping
- **FluentValidation** - Input validation
- **Global Exception Handling** - Centralized error handling
- **Request Logging** - Middleware for HTTP request/response logging
- **TestServer Integration** - Complete test infrastructure
- **Pagination & Filtering** - Built-in support for data operations
- **Search Functionality** - Text-based search across resources

## 📁 Project Structure

```
api/
├── InnoDay2025.Api/                 # Main API project
│   ├── Controllers/                 # REST API controllers
│   ├── Models/                      # Domain models
│   ├── DTOs/                        # Data Transfer Objects
│   ├── Services/                    # Business logic services
│   ├── Data/                        # Database context and seeding
│   ├── Middleware/                  # Custom middleware
│   ├── Mapping/                     # AutoMapper profiles
│   └── Program.cs                   # Application entry point
├── InnoDay2025.Api.Tests/           # Integration tests
│   ├── Controllers/                 # Controller tests
│   ├── Infrastructure/              # Test infrastructure
│   ├── Demo/                        # API demonstration tests
│   └── Services/                    # Service tests
└── InnoDay2025.sln                  # Solution file
```

## 🛠️ Setup & Running

### Prerequisites

- .NET 8.0 SDK
- Visual Studio 2022 or VS Code
- Git

### Running the API

1. **Navigate to the API directory:**
   ```bash
   cd api/InnoDay2025.Api
   ```

2. **Restore dependencies:**
   ```bash
   dotnet restore
   ```

3. **Run the application:**
   ```bash
   dotnet run
   ```

4. **Access the API:**
   - API Base URL: `https://localhost:7000` or `http://localhost:5000`
   - Swagger UI: `https://localhost:7000/swagger`
   - Health Check: `https://localhost:7000/health`

### Running Tests

1. **Navigate to the test directory:**
   ```bash
   cd api/InnoDay2025.Api.Tests
   ```

2. **Run all tests:**
   ```bash
   dotnet test
   ```

3. **Run tests with detailed output:**
   ```bash
   dotnet test --logger "console;verbosity=detailed"
   ```

4. **Run specific test class:**
   ```bash
   dotnet test --filter "RestApiDemoTests"
   ```

## 📋 API Endpoints

### Products API (v1)
- `GET /api/v1/products` - Get all products (with pagination)
- `GET /api/v1/products/{id}` - Get product by ID
- `GET /api/v1/products/sku/{sku}` - Get product by SKU
- `POST /api/v1/products` - Create new product
- `PUT /api/v1/products/{id}` - Update product
- `DELETE /api/v1/products/{id}` - Delete product
- `GET /api/v1/products/category/{category}` - Get products by category
- `GET /api/v1/products/search?q={query}` - Search products

### Users API (v1)
- `GET /api/v1/users` - Get all users (with pagination)
- `GET /api/v1/users/{id}` - Get user by ID
- `GET /api/v1/users/email/{email}` - Get user by email
- `POST /api/v1/users` - Create new user
- `PUT /api/v1/users/{id}` - Update user
- `DELETE /api/v1/users/{id}` - Delete user
- `GET /api/v1/users/search?q={query}` - Search users
- `POST /api/v1/users/{id}/login` - Update last login

### Statistics API (v2)
- `GET /api/v2/products/statistics` - Get product statistics
- `GET /api/v2/users/statistics` - Get user statistics

### Health Checks
- `GET /health` - Basic health check
- `GET /health/ready` - Readiness health check

## 🧪 Testing with TestServer

The project includes comprehensive integration tests using ASP.NET Core TestServer:

### Key Testing Features

1. **CustomWebApplicationFactory** - Isolated test environment
2. **In-Memory Database** - Fresh database for each test
3. **Test Base Class** - Common testing functionality
4. **Comprehensive Test Coverage** - All endpoints tested
5. **Demonstration Tests** - Real-world usage scenarios

### Example Test Usage

```csharp
[Fact]
public async Task CreateProduct_ReturnsCreated()
{
    // Arrange
    var product = new CreateProductDto
    {
        Name = "Test Product",
        Price = 99.99m,
        Category = "Electronics"
    };

    // Act
    var response = await Client.PostAsJsonAsync("/api/v1/products", product);

    // Assert
    response.StatusCode.Should().Be(HttpStatusCode.Created);
}
```

### Running Demo Tests

The `RestApiDemoTests` class demonstrates complete API workflows:

```bash
dotnet test --filter "DemonstrateCompleteProductLifecycle"
```

## 🔧 Configuration

### CORS Configuration

The API is configured to work with the Next.js frontend:

```json
{
  "CorsSettings": {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://localhost:3000"
    ]
  }
}
```

### API Versioning

Use headers or query parameters for versioning:
- Header: `X-Version: 1.0` or `X-Version: 2.0`
- Query: `?version=1.0` or `?version=2.0`
- URL: `/api/v1/...` or `/api/v2/...`

### Logging

Logs are written to:
- Console (development)
- Files: `logs/innoday-api-{date}.txt`

## 🔍 Sample Data

The API includes seeded test data:

### Users
- **John Doe** (Admin) - john.doe@innoday2025.com
- **Jane Smith** (Moderator) - jane.smith@innoday2025.com
- **Bob Johnson** (User) - bob.johnson@innoday2025.com

### Products
- **Wireless Bluetooth Headphones** - $149.99 (Electronics)
- **Ergonomic Office Chair** - $299.99 (Furniture)
- **Smart Water Bottle** - $79.99 (Health & Fitness)
- **Mechanical Gaming Keyboard** - $129.99 (Electronics)
- **Organic Coffee Beans** - $24.99 (Food & Beverage)

## 🏗️ Architecture Patterns

### Repository Pattern
- Service layer abstraction
- Dependency injection
- Interface-based design

### DTO Pattern
- Input/Output data transfer objects
- AutoMapper for object mapping
- Validation attributes

### Middleware Pattern
- Exception handling middleware
- Request logging middleware
- Built-in ASP.NET Core middleware

## 🚀 Next.js Integration

The API is designed to work seamlessly with the Next.js frontend in this repository:

1. **CORS enabled** for localhost:3000
2. **JSON responses** for easy consumption
3. **RESTful conventions** for predictable endpoints
4. **Error handling** with proper HTTP status codes

### Example Frontend Usage

```typescript
// Fetch products
const response = await fetch('http://localhost:5000/api/v1/products');
const { data, pagination } = await response.json();

// Create product
const product = await fetch('http://localhost:5000/api/v1/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(productData)
});
```

## 📝 Development Notes

### Adding New Endpoints

1. Create DTOs in `/DTOs` folder
2. Add service interface and implementation
3. Create controller with appropriate attributes
4. Add integration tests
5. Update Swagger documentation

### Database Changes

The project uses Entity Framework Core with In-Memory database. For production:

1. Replace with SQL Server/PostgreSQL
2. Add migrations
3. Update connection strings
4. Configure production database

### Authentication

Framework is in place for JWT authentication:
- JWT Bearer token support in Swagger
- Authorization attributes ready
- Service registration configured

## 🔒 Security Considerations

- Input validation with FluentValidation
- Global exception handling
- CORS configuration
- Health check endpoints
- Request logging for monitoring

## 📚 Documentation

- **Swagger UI**: Available at `/swagger` in development
- **API Documentation**: Auto-generated from XML comments
- **Integration Tests**: Serve as usage examples
- **Demo Tests**: Show complete workflows

## 🎯 Production Readiness

The API includes production-ready features:

- ✅ Structured logging
- ✅ Health checks
- ✅ Error handling
- ✅ Input validation
- ✅ API versioning
- ✅ CORS configuration
- ✅ Comprehensive testing
- ✅ Documentation
- ✅ Dependency injection
- ✅ Configuration management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.