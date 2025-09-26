using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using InnoDay2025.Api.DTOs;
using InnoDay2025.Api.Tests.Infrastructure;
using Xunit;

namespace InnoDay2025.Api.Tests.Controllers;

/// <summary>
/// Integration tests for ProductsController
/// </summary>
public class ProductsControllerTests : TestBase
{
    public ProductsControllerTests(CustomWebApplicationFactory<Program> factory) : base(factory)
    {
    }

    [Fact]
    public async Task GetProducts_ReturnsOkWithProducts()
    {
        // Act
        var response = await Client.GetAsync("/api/v1/products");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var content = await response.Content.ReadAsStringAsync();
        content.Should().NotBeEmpty();
        content.Should().Contain("data");
        content.Should().Contain("pagination");
    }

    [Fact]
    public async Task GetProducts_WithPagination_ReturnsCorrectPage()
    {
        // Arrange
        var page = 1;
        var pageSize = 2;

        // Act
        var response = await Client.GetAsync($"/api/v1/products?page={page}&pageSize={pageSize}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("\"page\":" + page);
        content.Should().Contain("\"pageSize\":" + pageSize);
    }

    [Fact]
    public async Task GetProducts_WithCategoryFilter_ReturnsFilteredProducts()
    {
        // Arrange
        var category = "Electronics";

        // Act
        var response = await Client.GetAsync($"/api/v1/products?category={category}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("Electronics");
    }

    [Fact]
    public async Task GetProduct_WithValidId_ReturnsProduct()
    {
        // Arrange
        var productId = 1;

        // Act
        var response = await Client.GetAsync($"/api/v1/products/{productId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var product = await DeserializeResponseAsync<ProductDto>(response);
        product.Should().NotBeNull();
        product!.Id.Should().Be(productId);
    }

    [Fact]
    public async Task GetProduct_WithInvalidId_ReturnsNotFound()
    {
        // Arrange
        var productId = 999;

        // Act
        var response = await Client.GetAsync($"/api/v1/products/{productId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetProductBySku_WithValidSku_ReturnsProduct()
    {
        // Arrange
        var sku = "TEST-001";

        // Act
        var response = await Client.GetAsync($"/api/v1/products/sku/{sku}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var product = await DeserializeResponseAsync<ProductDto>(response);
        product.Should().NotBeNull();
        product!.Sku.Should().Be(sku);
    }

    [Fact]
    public async Task CreateProduct_WithValidData_ReturnsCreated()
    {
        // Arrange
        var createProduct = new CreateProductDto
        {
            Name = "New Test Product",
            Description = "A brand new test product",
            Price = 199.99m,
            Category = "Electronics",
            StockQuantity = 20,
            Sku = "NEW-001"
        };

        // Act
        var response = await Client.PostAsJsonAsync("/api/v1/products", createProduct);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);

        var product = await DeserializeResponseAsync<ProductDto>(response);
        product.Should().NotBeNull();
        product!.Name.Should().Be(createProduct.Name);
        product.Price.Should().Be(createProduct.Price);

        // Verify Location header
        response.Headers.Location.Should().NotBeNull();
        response.Headers.Location!.ToString().Should().Contain($"/api/v1/products/{product.Id}");
    }

    [Fact]
    public async Task CreateProduct_WithInvalidData_ReturnsBadRequest()
    {
        // Arrange
        var createProduct = new CreateProductDto
        {
            Name = "", // Invalid: empty name
            Price = -10, // Invalid: negative price
            Category = "Electronics",
            StockQuantity = 20
        };

        // Act
        var response = await Client.PostAsJsonAsync("/api/v1/products", createProduct);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task UpdateProduct_WithValidData_ReturnsOk()
    {
        // Arrange
        var productId = 1;
        var updateProduct = new UpdateProductDto
        {
            Name = "Updated Test Product",
            Price = 299.99m,
            StockQuantity = 15
        };

        // Act
        var response = await Client.PutAsJsonAsync($"/api/v1/products/{productId}", updateProduct);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var product = await DeserializeResponseAsync<ProductDto>(response);
        product.Should().NotBeNull();
        product!.Name.Should().Be(updateProduct.Name);
        product.Price.Should().Be(updateProduct.Price!.Value);
        product.StockQuantity.Should().Be(updateProduct.StockQuantity!.Value);
    }

    [Fact]
    public async Task UpdateProduct_WithInvalidId_ReturnsNotFound()
    {
        // Arrange
        var productId = 999;
        var updateProduct = new UpdateProductDto
        {
            Name = "Updated Test Product"
        };

        // Act
        var response = await Client.PutAsJsonAsync($"/api/v1/products/{productId}", updateProduct);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task DeleteProduct_WithValidId_ReturnsNoContent()
    {
        // Arrange
        var productId = 1;

        // Act
        var response = await Client.DeleteAsync($"/api/v1/products/{productId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        // Verify the product is actually deleted
        var getResponse = await Client.GetAsync($"/api/v1/products/{productId}");
        getResponse.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task DeleteProduct_WithInvalidId_ReturnsNotFound()
    {
        // Arrange
        var productId = 999;

        // Act
        var response = await Client.DeleteAsync($"/api/v1/products/{productId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task SearchProducts_WithValidQuery_ReturnsResults()
    {
        // Arrange
        var searchQuery = "Test";

        // Act
        var response = await Client.GetAsync($"/api/v1/products/search?q={searchQuery}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("Test");
        content.Should().Contain("\"searchQuery\":\"Test\"");
    }

    [Fact]
    public async Task SearchProducts_WithEmptyQuery_ReturnsBadRequest()
    {
        // Act
        var response = await Client.GetAsync("/api/v1/products/search?q=");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task GetProductsByCategory_WithValidCategory_ReturnsProducts()
    {
        // Arrange
        var category = "Electronics";

        // Act
        var response = await Client.GetAsync($"/api/v1/products/category/{category}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var products = await DeserializeResponseAsync<List<ProductDto>>(response);
        products.Should().NotBeNull();
        products!.Should().OnlyContain(p => p.Category == category && p.IsActive);
    }

    [Fact]
    public async Task GetProductStatistics_V2_ReturnsStatistics()
    {
        // Arrange
        SetApiVersion("2.0");

        // Act
        var response = await Client.GetAsync("/api/v2/products/statistics");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("totalProducts");
        content.Should().Contain("activeProducts");
        content.Should().Contain("categories");
        content.Should().Contain("generatedAt");
    }

    [Fact]
    public async Task GetProducts_WithInvalidPagination_ReturnsBadRequest()
    {
        // Act
        var response = await Client.GetAsync("/api/v1/products?page=0&pageSize=101");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}