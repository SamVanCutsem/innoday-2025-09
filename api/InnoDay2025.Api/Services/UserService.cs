using AutoMapper;
using Microsoft.EntityFrameworkCore;
using InnoDay2025.Api.Data;
using InnoDay2025.Api.Models;
using InnoDay2025.Api.DTOs;

namespace InnoDay2025.Api.Services;

/// <summary>
/// Service for user operations
/// </summary>
public class UserService : IUserService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<UserService> _logger;

    public UserService(ApplicationDbContext context, IMapper mapper, ILogger<UserService> logger)
    {
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<(IEnumerable<UserDto> Users, int TotalCount)> GetUsersAsync(
        UserRole? role = null,
        bool? isActive = null,
        int page = 1,
        int pageSize = 10)
    {
        var query = _context.Users.AsQueryable();

        if (role.HasValue)
        {
            query = query.Where(u => u.Role == role.Value);
        }

        if (isActive.HasValue)
        {
            query = query.Where(u => u.IsActive == isActive.Value);
        }

        var totalCount = await query.CountAsync();

        var users = await query
            .OrderByDescending(u => u.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var userDtos = _mapper.Map<IEnumerable<UserDto>>(users);

        _logger.LogInformation("Retrieved {Count} users out of {Total} total users", users.Count, totalCount);

        return (userDtos, totalCount);
    }

    public async Task<UserDto?> GetUserByIdAsync(int id)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
        {
            _logger.LogWarning("User with ID {UserId} not found", id);
            return null;
        }

        return _mapper.Map<UserDto>(user);
    }

    public async Task<UserDto?> GetUserByEmailAsync(string email)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());

        if (user == null)
        {
            _logger.LogWarning("User with email {Email} not found", email);
            return null;
        }

        return _mapper.Map<UserDto>(user);
    }

    public async Task<UserDto> CreateUserAsync(CreateUserDto createUserDto)
    {
        // Check if email already exists
        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == createUserDto.Email.ToLower());
        if (existingUser != null)
        {
            throw new InvalidOperationException($"User with email {createUserDto.Email} already exists");
        }

        var user = _mapper.Map<User>(createUserDto);
        user.CreatedAt = DateTime.UtcNow;
        user.UpdatedAt = DateTime.UtcNow;

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Created new user with ID {UserId} and email {Email}", user.Id, user.Email);

        return _mapper.Map<UserDto>(user);
    }

    public async Task<UserDto?> UpdateUserAsync(int id, UpdateUserDto updateUserDto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
        {
            _logger.LogWarning("User with ID {UserId} not found for update", id);
            return null;
        }

        // Check if email is being changed and already exists
        if (!string.IsNullOrEmpty(updateUserDto.Email) &&
            updateUserDto.Email.ToLower() != user.Email.ToLower())
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == updateUserDto.Email.ToLower());
            if (existingUser != null)
            {
                throw new InvalidOperationException($"User with email {updateUserDto.Email} already exists");
            }
        }

        _mapper.Map(updateUserDto, user);
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        _logger.LogInformation("Updated user with ID {UserId}", id);

        return _mapper.Map<UserDto>(user);
    }

    public async Task<bool> DeleteUserAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
        {
            _logger.LogWarning("User with ID {UserId} not found for deletion", id);
            return false;
        }

        // Set created products' CreatedByUserId to null instead of deleting the user
        // This preserves data integrity
        var userProducts = await _context.Products.Where(p => p.CreatedByUserId == id).ToListAsync();
        foreach (var product in userProducts)
        {
            product.CreatedByUserId = null;
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Deleted user with ID {UserId}", id);

        return true;
    }

    public async Task<(IEnumerable<UserDto> Users, int TotalCount)> SearchUsersAsync(
        string searchTerm,
        int page = 1,
        int pageSize = 10)
    {
        var query = _context.Users
            .Where(u => u.IsActive &&
                       (u.FirstName.ToLower().Contains(searchTerm.ToLower()) ||
                        u.LastName.ToLower().Contains(searchTerm.ToLower()) ||
                        u.Email.ToLower().Contains(searchTerm.ToLower())));

        var totalCount = await query.CountAsync();

        var users = await query
            .OrderByDescending(u => u.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var userDtos = _mapper.Map<IEnumerable<UserDto>>(users);

        _logger.LogInformation("Found {Count} users matching search term '{SearchTerm}'", users.Count, searchTerm);

        return (userDtos, totalCount);
    }

    public async Task<bool> UpdateLastLoginAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
        {
            _logger.LogWarning("User with ID {UserId} not found for last login update", id);
            return false;
        }

        user.LastLoginAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        _logger.LogDebug("Updated last login time for user with ID {UserId}", id);

        return true;
    }
}