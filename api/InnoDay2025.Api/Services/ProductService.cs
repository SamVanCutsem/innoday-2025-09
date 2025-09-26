using AutoMapper;
using Microsoft.EntityFrameworkCore;
using InnoDay2025.Api.Data;
using InnoDay2025.Api.Models;
using InnoDay2025.Api.DTOs;

namespace InnoDay2025.Api.Services;

/// <summary>
/// Service for product operations
/// </summary>
public class ProductService : IProductService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<ProductService> _logger;

    public ProductService(ApplicationDbContext context, IMapper mapper, ILogger<ProductService> logger)
    {
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<(IEnumerable<ProductDto> Products, int TotalCount)> GetProductsAsync(
        string? category = null,
        bool? isActive = null,
        int page = 1,
        int pageSize = 10)
    {
        var query = _context.Products.Include(p => p.CreatedByUser).AsQueryable();

        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(p => p.Category.ToLower() == category.ToLower());
        }

        if (isActive.HasValue)
        {
            query = query.Where(p => p.IsActive == isActive.Value);
        }

        var totalCount = await query.CountAsync();

        var products = await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var productDtos = _mapper.Map<IEnumerable<ProductDto>>(products);

        _logger.LogInformation("Retrieved {Count} products out of {Total} total products", products.Count, totalCount);

        return (productDtos, totalCount);
    }

    public async Task<ProductDto?> GetProductByIdAsync(int id)
    {
        var product = await _context.Products
            .Include(p => p.CreatedByUser)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
        {
            _logger.LogWarning("Product with ID {ProductId} not found", id);
            return null;
        }

        return _mapper.Map<ProductDto>(product);
    }

    public async Task<ProductDto?> GetProductBySkuAsync(string sku)
    {
        var product = await _context.Products
            .Include(p => p.CreatedByUser)
            .FirstOrDefaultAsync(p => p.Sku == sku);

        if (product == null)
        {
            _logger.LogWarning("Product with SKU {Sku} not found", sku);
            return null;
        }

        return _mapper.Map<ProductDto>(product);
    }

    public async Task<ProductDto> CreateProductAsync(CreateProductDto createProductDto, int? createdByUserId = null)
    {
        var product = _mapper.Map<Product>(createProductDto);
        product.CreatedByUserId = createdByUserId;
        product.CreatedAt = DateTime.UtcNow;
        product.UpdatedAt = DateTime.UtcNow;

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Created new product with ID {ProductId} and SKU {Sku}", product.Id, product.Sku);

        // Reload with related data
        await _context.Entry(product)
            .Reference(p => p.CreatedByUser)
            .LoadAsync();

        return _mapper.Map<ProductDto>(product);
    }

    public async Task<ProductDto?> UpdateProductAsync(int id, UpdateProductDto updateProductDto)
    {
        var product = await _context.Products
            .Include(p => p.CreatedByUser)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
        {
            _logger.LogWarning("Product with ID {ProductId} not found for update", id);
            return null;
        }

        _mapper.Map(updateProductDto, product);
        product.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        _logger.LogInformation("Updated product with ID {ProductId}", id);

        return _mapper.Map<ProductDto>(product);
    }

    public async Task<bool> DeleteProductAsync(int id)
    {
        var product = await _context.Products.FindAsync(id);

        if (product == null)
        {
            _logger.LogWarning("Product with ID {ProductId} not found for deletion", id);
            return false;
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Deleted product with ID {ProductId}", id);

        return true;
    }

    public async Task<IEnumerable<ProductDto>> GetProductsByCategoryAsync(string category)
    {
        var products = await _context.Products
            .Include(p => p.CreatedByUser)
            .Where(p => p.Category.ToLower() == category.ToLower() && p.IsActive)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        _logger.LogInformation("Retrieved {Count} products for category {Category}", products.Count, category);

        return _mapper.Map<IEnumerable<ProductDto>>(products);
    }

    public async Task<(IEnumerable<ProductDto> Products, int TotalCount)> SearchProductsAsync(
        string searchTerm,
        int page = 1,
        int pageSize = 10)
    {
        var query = _context.Products
            .Include(p => p.CreatedByUser)
            .Where(p => p.IsActive &&
                       (p.Name.ToLower().Contains(searchTerm.ToLower()) ||
                        (p.Description != null && p.Description.ToLower().Contains(searchTerm.ToLower()))));

        var totalCount = await query.CountAsync();

        var products = await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var productDtos = _mapper.Map<IEnumerable<ProductDto>>(products);

        _logger.LogInformation("Found {Count} products matching search term '{SearchTerm}'", products.Count, searchTerm);

        return (productDtos, totalCount);
    }
}