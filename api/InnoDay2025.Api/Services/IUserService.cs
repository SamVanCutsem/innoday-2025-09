using InnoDay2025.Api.Models;
using InnoDay2025.Api.DTOs;

namespace InnoDay2025.Api.Services;

/// <summary>
/// Interface for user service operations
/// </summary>
public interface IUserService
{
    /// <summary>
    /// Get all users with optional filtering and pagination
    /// </summary>
    /// <param name="role">Optional role filter</param>
    /// <param name="isActive">Optional active status filter</param>
    /// <param name="page">Page number (1-based)</param>
    /// <param name="pageSize">Number of items per page</param>
    /// <returns>Paginated list of users</returns>
    Task<(IEnumerable<UserDto> Users, int TotalCount)> GetUsersAsync(
        UserRole? role = null,
        bool? isActive = null,
        int page = 1,
        int pageSize = 10);

    /// <summary>
    /// Get a user by ID
    /// </summary>
    /// <param name="id">User ID</param>
    /// <returns>User DTO or null if not found</returns>
    Task<UserDto?> GetUserByIdAsync(int id);

    /// <summary>
    /// Get a user by email
    /// </summary>
    /// <param name="email">User email</param>
    /// <returns>User DTO or null if not found</returns>
    Task<UserDto?> GetUserByEmailAsync(string email);

    /// <summary>
    /// Create a new user
    /// </summary>
    /// <param name="createUserDto">User creation data</param>
    /// <returns>Created user DTO</returns>
    Task<UserDto> CreateUserAsync(CreateUserDto createUserDto);

    /// <summary>
    /// Update an existing user
    /// </summary>
    /// <param name="id">User ID</param>
    /// <param name="updateUserDto">User update data</param>
    /// <returns>Updated user DTO or null if not found</returns>
    Task<UserDto?> UpdateUserAsync(int id, UpdateUserDto updateUserDto);

    /// <summary>
    /// Delete a user
    /// </summary>
    /// <param name="id">User ID</param>
    /// <returns>True if deleted, false if not found</returns>
    Task<bool> DeleteUserAsync(int id);

    /// <summary>
    /// Search users by name or email
    /// </summary>
    /// <param name="searchTerm">Search term</param>
    /// <param name="page">Page number (1-based)</param>
    /// <param name="pageSize">Number of items per page</param>
    /// <returns>Paginated search results</returns>
    Task<(IEnumerable<UserDto> Users, int TotalCount)> SearchUsersAsync(
        string searchTerm,
        int page = 1,
        int pageSize = 10);

    /// <summary>
    /// Update user's last login time
    /// </summary>
    /// <param name="id">User ID</param>
    /// <returns>True if updated, false if user not found</returns>
    Task<bool> UpdateLastLoginAsync(int id);
}