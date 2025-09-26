using InnoDay2025.Api.Models;
using InnoDay2025.Api.DTOs;

namespace InnoDay2025.Api.Services;

/// <summary>
/// Interface for product service operations
/// </summary>
public interface IProductService
{
    /// <summary>
    /// Get all products with optional filtering and pagination
    /// </summary>
    /// <param name="category">Optional category filter</param>
    /// <param name="isActive">Optional active status filter</param>
    /// <param name="page">Page number (1-based)</param>
    /// <param name="pageSize">Number of items per page</param>
    /// <returns>Paginated list of products</returns>
    Task<(IEnumerable<ProductDto> Products, int TotalCount)> GetProductsAsync(
        string? category = null,
        bool? isActive = null,
        int page = 1,
        int pageSize = 10);

    /// <summary>
    /// Get a product by ID
    /// </summary>
    /// <param name="id">Product ID</param>
    /// <returns>Product DTO or null if not found</returns>
    Task<ProductDto?> GetProductByIdAsync(int id);

    /// <summary>
    /// Get a product by SKU
    /// </summary>
    /// <param name="sku">Product SKU</param>
    /// <returns>Product DTO or null if not found</returns>
    Task<ProductDto?> GetProductBySkuAsync(string sku);

    /// <summary>
    /// Create a new product
    /// </summary>
    /// <param name="createProductDto">Product creation data</param>
    /// <param name="createdByUserId">ID of the user creating the product</param>
    /// <returns>Created product DTO</returns>
    Task<ProductDto> CreateProductAsync(CreateProductDto createProductDto, int? createdByUserId = null);

    /// <summary>
    /// Update an existing product
    /// </summary>
    /// <param name="id">Product ID</param>
    /// <param name="updateProductDto">Product update data</param>
    /// <returns>Updated product DTO or null if not found</returns>
    Task<ProductDto?> UpdateProductAsync(int id, UpdateProductDto updateProductDto);

    /// <summary>
    /// Delete a product
    /// </summary>
    /// <param name="id">Product ID</param>
    /// <returns>True if deleted, false if not found</returns>
    Task<bool> DeleteProductAsync(int id);

    /// <summary>
    /// Get products by category
    /// </summary>
    /// <param name="category">Category name</param>
    /// <returns>List of products in the category</returns>
    Task<IEnumerable<ProductDto>> GetProductsByCategoryAsync(string category);

    /// <summary>
    /// Search products by name or description
    /// </summary>
    /// <param name="searchTerm">Search term</param>
    /// <param name="page">Page number (1-based)</param>
    /// <param name="pageSize">Number of items per page</param>
    /// <returns>Paginated search results</returns>
    Task<(IEnumerable<ProductDto> Products, int TotalCount)> SearchProductsAsync(
        string searchTerm,
        int page = 1,
        int pageSize = 10);
}