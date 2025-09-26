using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;
using InnoDay2025.Api.Services;
using InnoDay2025.Api.DTOs;
using InnoDay2025.Api.Models;

namespace InnoDay2025.Api.Controllers;

/// <summary>
/// Controller for managing products
/// </summary>
[ApiController]
[ApiVersion("1.0")]
[ApiVersion("2.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[Produces("application/json")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(IProductService productService, ILogger<ProductsController> logger)
    {
        _productService = productService;
        _logger = logger;
    }

    /// <summary>
    /// Get all products with optional filtering and pagination
    /// </summary>
    /// <param name="category">Filter by category</param>
    /// <param name="isActive">Filter by active status</param>
    /// <param name="page">Page number (default: 1)</param>
    /// <param name="pageSize">Items per page (default: 10, max: 100)</param>
    /// <returns>Paginated list of products</returns>
    [HttpGet]
    [ProducesResponseType(typeof(object), 200)]
    [ProducesResponseType(400)]
    public async Task<ActionResult<object>> GetProducts(
        [FromQuery] string? category = null,
        [FromQuery] bool? isActive = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        if (page < 1)
        {
            return BadRequest("Page must be greater than 0");
        }

        if (pageSize < 1 || pageSize > 100)
        {
            return BadRequest("PageSize must be between 1 and 100");
        }

        var (products, totalCount) = await _productService.GetProductsAsync(category, isActive, page, pageSize);

        var response = new
        {
            Data = products,
            Pagination = new
            {
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            }
        };

        return Ok(response);
    }

    /// <summary>
    /// Get a product by ID
    /// </summary>
    /// <param name="id">Product ID</param>
    /// <returns>Product details</returns>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ProductDto), 200)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<ProductDto>> GetProduct(int id)
    {
        var product = await _productService.GetProductByIdAsync(id);

        if (product == null)
        {
            return NotFound($"Product with ID {id} not found");
        }

        return Ok(product);
    }

    /// <summary>
    /// Get a product by SKU
    /// </summary>
    /// <param name="sku">Product SKU</param>
    /// <returns>Product details</returns>
    [HttpGet("sku/{sku}")]
    [ProducesResponseType(typeof(ProductDto), 200)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<ProductDto>> GetProductBySku(string sku)
    {
        var product = await _productService.GetProductBySkuAsync(sku);

        if (product == null)
        {
            return NotFound($"Product with SKU {sku} not found");
        }

        return Ok(product);
    }

    /// <summary>
    /// Create a new product
    /// </summary>
    /// <param name="createProductDto">Product creation data</param>
    /// <returns>Created product</returns>
    [HttpPost]
    [ProducesResponseType(typeof(ProductDto), 201)]
    [ProducesResponseType(400)]
    public async Task<ActionResult<ProductDto>> CreateProduct([FromBody] CreateProductDto createProductDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            // In a real application, you would get the user ID from the JWT token
            // For this demo, we'll use a placeholder user ID
            var product = await _productService.CreateProductAsync(createProductDto, createdByUserId: 1);

            return CreatedAtAction(
                nameof(GetProduct),
                new { id = product.Id },
                product);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Update an existing product
    /// </summary>
    /// <param name="id">Product ID</param>
    /// <param name="updateProductDto">Product update data</param>
    /// <returns>Updated product</returns>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(ProductDto), 200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<ProductDto>> UpdateProduct(int id, [FromBody] UpdateProductDto updateProductDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var product = await _productService.UpdateProductAsync(id, updateProductDto);

            if (product == null)
            {
                return NotFound($"Product with ID {id} not found");
            }

            return Ok(product);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Delete a product
    /// </summary>
    /// <param name="id">Product ID</param>
    /// <returns>No content if successful</returns>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var deleted = await _productService.DeleteProductAsync(id);

        if (!deleted)
        {
            return NotFound($"Product with ID {id} not found");
        }

        return NoContent();
    }

    /// <summary>
    /// Get products by category
    /// </summary>
    /// <param name="category">Category name</param>
    /// <returns>List of products in the category</returns>
    [HttpGet("category/{category}")]
    [ProducesResponseType(typeof(IEnumerable<ProductDto>), 200)]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProductsByCategory(string category)
    {
        var products = await _productService.GetProductsByCategoryAsync(category);
        return Ok(products);
    }

    /// <summary>
    /// Search products by name or description
    /// </summary>
    /// <param name="q">Search query</param>
    /// <param name="page">Page number (default: 1)</param>
    /// <param name="pageSize">Items per page (default: 10, max: 100)</param>
    /// <returns>Paginated search results</returns>
    [HttpGet("search")]
    [ProducesResponseType(typeof(object), 200)]
    [ProducesResponseType(400)]
    public async Task<ActionResult<object>> SearchProducts(
        [FromQuery] string q,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        if (string.IsNullOrWhiteSpace(q))
        {
            return BadRequest("Search query is required");
        }

        if (page < 1)
        {
            return BadRequest("Page must be greater than 0");
        }

        if (pageSize < 1 || pageSize > 100)
        {
            return BadRequest("PageSize must be between 1 and 100");
        }

        var (products, totalCount) = await _productService.SearchProductsAsync(q, page, pageSize);

        var response = new
        {
            Data = products,
            SearchQuery = q,
            Pagination = new
            {
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            }
        };

        return Ok(response);
    }

    /// <summary>
    /// Get product statistics (v2 endpoint)
    /// </summary>
    /// <returns>Product statistics</returns>
    [HttpGet("statistics")]
    [MapToApiVersion("2.0")]
    [ProducesResponseType(typeof(object), 200)]
    public async Task<ActionResult<object>> GetProductStatistics()
    {
        var (allProducts, totalCount) = await _productService.GetProductsAsync(page: 1, pageSize: int.MaxValue);

        var statistics = new
        {
            TotalProducts = totalCount,
            ActiveProducts = allProducts.Count(p => p.IsActive),
            InactiveProducts = allProducts.Count(p => !p.IsActive),
            Categories = allProducts.GroupBy(p => p.Category).Select(g => new
            {
                Category = g.Key,
                Count = g.Count(),
                AveragePrice = g.Average(p => p.Price)
            }).OrderByDescending(c => c.Count),
            TotalValue = allProducts.Where(p => p.IsActive).Sum(p => p.Price * p.StockQuantity),
            GeneratedAt = DateTime.UtcNow
        };

        return Ok(statistics);
    }
}