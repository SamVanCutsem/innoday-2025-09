using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;
using InnoDay2025.Api.Services;
using InnoDay2025.Api.DTOs;
using InnoDay2025.Api.Models;

namespace InnoDay2025.Api.Controllers;

/// <summary>
/// Controller for managing users
/// </summary>
[ApiController]
[ApiVersion("1.0")]
[ApiVersion("2.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[Produces("application/json")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ILogger<UsersController> _logger;

    public UsersController(IUserService userService, ILogger<UsersController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    /// <summary>
    /// Get all users with optional filtering and pagination
    /// </summary>
    /// <param name="role">Filter by role</param>
    /// <param name="isActive">Filter by active status</param>
    /// <param name="page">Page number (default: 1)</param>
    /// <param name="pageSize">Items per page (default: 10, max: 100)</param>
    /// <returns>Paginated list of users</returns>
    [HttpGet]
    [ProducesResponseType(typeof(object), 200)]
    [ProducesResponseType(400)]
    public async Task<ActionResult<object>> GetUsers(
        [FromQuery] UserRole? role = null,
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

        var (users, totalCount) = await _userService.GetUsersAsync(role, isActive, page, pageSize);

        var response = new
        {
            Data = users,
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
    /// Get a user by ID
    /// </summary>
    /// <param name="id">User ID</param>
    /// <returns>User details</returns>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(UserDto), 200)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<UserDto>> GetUser(int id)
    {
        var user = await _userService.GetUserByIdAsync(id);

        if (user == null)
        {
            return NotFound($"User with ID {id} not found");
        }

        return Ok(user);
    }

    /// <summary>
    /// Get a user by email
    /// </summary>
    /// <param name="email">User email</param>
    /// <returns>User details</returns>
    [HttpGet("email/{email}")]
    [ProducesResponseType(typeof(UserDto), 200)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<UserDto>> GetUserByEmail(string email)
    {
        var user = await _userService.GetUserByEmailAsync(email);

        if (user == null)
        {
            return NotFound($"User with email {email} not found");
        }

        return Ok(user);
    }

    /// <summary>
    /// Create a new user
    /// </summary>
    /// <param name="createUserDto">User creation data</param>
    /// <returns>Created user</returns>
    [HttpPost]
    [ProducesResponseType(typeof(UserDto), 201)]
    [ProducesResponseType(400)]
    public async Task<ActionResult<UserDto>> CreateUser([FromBody] CreateUserDto createUserDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var user = await _userService.CreateUserAsync(createUserDto);

            return CreatedAtAction(
                nameof(GetUser),
                new { id = user.Id },
                user);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Update an existing user
    /// </summary>
    /// <param name="id">User ID</param>
    /// <param name="updateUserDto">User update data</param>
    /// <returns>Updated user</returns>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(UserDto), 200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<UserDto>> UpdateUser(int id, [FromBody] UpdateUserDto updateUserDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var user = await _userService.UpdateUserAsync(id, updateUserDto);

            if (user == null)
            {
                return NotFound($"User with ID {id} not found");
            }

            return Ok(user);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Delete a user
    /// </summary>
    /// <param name="id">User ID</param>
    /// <returns>No content if successful</returns>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var deleted = await _userService.DeleteUserAsync(id);

        if (!deleted)
        {
            return NotFound($"User with ID {id} not found");
        }

        return NoContent();
    }

    /// <summary>
    /// Search users by name or email
    /// </summary>
    /// <param name="q">Search query</param>
    /// <param name="page">Page number (default: 1)</param>
    /// <param name="pageSize">Items per page (default: 10, max: 100)</param>
    /// <returns>Paginated search results</returns>
    [HttpGet("search")]
    [ProducesResponseType(typeof(object), 200)]
    [ProducesResponseType(400)]
    public async Task<ActionResult<object>> SearchUsers(
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

        var (users, totalCount) = await _userService.SearchUsersAsync(q, page, pageSize);

        var response = new
        {
            Data = users,
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
    /// Update user's last login time
    /// </summary>
    /// <param name="id">User ID</param>
    /// <returns>No content if successful</returns>
    [HttpPost("{id:int}/login")]
    [ProducesResponseType(204)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> UpdateLastLogin(int id)
    {
        var updated = await _userService.UpdateLastLoginAsync(id);

        if (!updated)
        {
            return NotFound($"User with ID {id} not found");
        }

        return NoContent();
    }

    /// <summary>
    /// Get user statistics (v2 endpoint)
    /// </summary>
    /// <returns>User statistics</returns>
    [HttpGet("statistics")]
    [MapToApiVersion("2.0")]
    [ProducesResponseType(typeof(object), 200)]
    public async Task<ActionResult<object>> GetUserStatistics()
    {
        var (allUsers, totalCount) = await _userService.GetUsersAsync(page: 1, pageSize: int.MaxValue);

        var statistics = new
        {
            TotalUsers = totalCount,
            ActiveUsers = allUsers.Count(u => u.IsActive),
            InactiveUsers = allUsers.Count(u => !u.IsActive),
            UsersByRole = allUsers.GroupBy(u => u.Role).Select(g => new
            {
                Role = g.Key.ToString(),
                Count = g.Count()
            }).OrderByDescending(r => r.Count),
            RecentLogins = allUsers.Count(u => u.LastLoginAt.HasValue && u.LastLoginAt > DateTime.UtcNow.AddDays(-7)),
            NewUsersThisMonth = allUsers.Count(u => u.CreatedAt > DateTime.UtcNow.AddDays(-30)),
            GeneratedAt = DateTime.UtcNow
        };

        return Ok(statistics);
    }
}