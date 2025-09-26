using System.ComponentModel.DataAnnotations;

namespace InnoDay2025.Api.DTOs;

/// <summary>
/// DTO for product information
/// </summary>
public class ProductDto
{
    /// <summary>
    /// Product ID
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Product name
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Product description
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Product price
    /// </summary>
    public decimal Price { get; set; }

    /// <summary>
    /// Product category
    /// </summary>
    public string Category { get; set; } = string.Empty;

    /// <summary>
    /// Quantity in stock
    /// </summary>
    public int StockQuantity { get; set; }

    /// <summary>
    /// Product SKU
    /// </summary>
    public string? Sku { get; set; }

    /// <summary>
    /// Whether the product is active
    /// </summary>
    public bool IsActive { get; set; }

    /// <summary>
    /// Creation date
    /// </summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// Last update date
    /// </summary>
    public DateTime UpdatedAt { get; set; }

    /// <summary>
    /// Creator information
    /// </summary>
    public UserSummaryDto? CreatedBy { get; set; }
}

/// <summary>
/// DTO for creating a new product
/// </summary>
public class CreateProductDto
{
    /// <summary>
    /// Product name
    /// </summary>
    [Required]
    [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Product description
    /// </summary>
    [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
    public string? Description { get; set; }

    /// <summary>
    /// Product price
    /// </summary>
    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
    public decimal Price { get; set; }

    /// <summary>
    /// Product category
    /// </summary>
    [Required]
    [StringLength(50, ErrorMessage = "Category cannot exceed 50 characters")]
    public string Category { get; set; } = string.Empty;

    /// <summary>
    /// Quantity in stock
    /// </summary>
    [Range(0, int.MaxValue, ErrorMessage = "Stock quantity cannot be negative")]
    public int StockQuantity { get; set; }

    /// <summary>
    /// Product SKU
    /// </summary>
    [StringLength(50, ErrorMessage = "SKU cannot exceed 50 characters")]
    public string? Sku { get; set; }
}

/// <summary>
/// DTO for updating an existing product
/// </summary>
public class UpdateProductDto
{
    /// <summary>
    /// Product name
    /// </summary>
    [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
    public string? Name { get; set; }

    /// <summary>
    /// Product description
    /// </summary>
    [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
    public string? Description { get; set; }

    /// <summary>
    /// Product price
    /// </summary>
    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
    public decimal? Price { get; set; }

    /// <summary>
    /// Product category
    /// </summary>
    [StringLength(50, ErrorMessage = "Category cannot exceed 50 characters")]
    public string? Category { get; set; }

    /// <summary>
    /// Quantity in stock
    /// </summary>
    [Range(0, int.MaxValue, ErrorMessage = "Stock quantity cannot be negative")]
    public int? StockQuantity { get; set; }

    /// <summary>
    /// Product SKU
    /// </summary>
    [StringLength(50, ErrorMessage = "SKU cannot exceed 50 characters")]
    public string? Sku { get; set; }

    /// <summary>
    /// Whether the product is active
    /// </summary>
    public bool? IsActive { get; set; }
}