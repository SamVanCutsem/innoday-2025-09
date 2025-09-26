using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using InnoDay2025.Api.DTOs;
using InnoDay2025.Api.Models;
using InnoDay2025.Api.Tests.Infrastructure;
using Xunit;

namespace InnoDay2025.Api.Tests.Controllers;

/// <summary>
/// Integration tests for UsersController
/// </summary>
public class UsersControllerTests : TestBase
{
    public UsersControllerTests(CustomWebApplicationFactory<Program> factory) : base(factory)
    {
    }

    [Fact]
    public async Task GetUsers_ReturnsOkWithUsers()
    {
        // Act
        var response = await Client.GetAsync("/api/v1/users");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var content = await response.Content.ReadAsStringAsync();
        content.Should().NotBeEmpty();
        content.Should().Contain("data");
        content.Should().Contain("pagination");
    }

    [Fact]
    public async Task GetUsers_WithRoleFilter_ReturnsFilteredUsers()
    {
        // Arrange
        var role = UserRole.Admin;

        // Act
        var response = await Client.GetAsync($"/api/v1/users?role={role}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("Admin");
    }

    [Fact]
    public async Task GetUser_WithValidId_ReturnsUser()
    {
        // Arrange
        var userId = 1;

        // Act
        var response = await Client.GetAsync($"/api/v1/users/{userId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var user = await DeserializeResponseAsync<UserDto>(response);
        user.Should().NotBeNull();
        user!.Id.Should().Be(userId);
    }

    [Fact]
    public async Task GetUser_WithInvalidId_ReturnsNotFound()
    {
        // Arrange
        var userId = 999;

        // Act
        var response = await Client.GetAsync($"/api/v1/users/{userId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetUserByEmail_WithValidEmail_ReturnsUser()
    {
        // Arrange
        var email = "test.user@test.com";

        // Act
        var response = await Client.GetAsync($"/api/v1/users/email/{email}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var user = await DeserializeResponseAsync<UserDto>(response);
        user.Should().NotBeNull();
        user!.Email.Should().Be(email);
    }

    [Fact]
    public async Task CreateUser_WithValidData_ReturnsCreated()
    {
        // Arrange
        var createUser = new CreateUserDto
        {
            FirstName = "New",
            LastName = "User",
            Email = "new.user@test.com",
            PhoneNumber = "+1-555-9999",
            Role = UserRole.User
        };

        // Act
        var response = await Client.PostAsJsonAsync("/api/v1/users", createUser);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);

        var user = await DeserializeResponseAsync<UserDto>(response);
        user.Should().NotBeNull();
        user!.FirstName.Should().Be(createUser.FirstName);
        user.LastName.Should().Be(createUser.LastName);
        user.Email.Should().Be(createUser.Email);

        // Verify Location header
        response.Headers.Location.Should().NotBeNull();
        response.Headers.Location!.ToString().Should().Contain($"/api/v1/users/{user.Id}");
    }

    [Fact]
    public async Task CreateUser_WithDuplicateEmail_ReturnsBadRequest()
    {
        // Arrange
        var createUser = new CreateUserDto
        {
            FirstName = "Duplicate",
            LastName = "User",
            Email = "test.user@test.com", // This email already exists in test data
            PhoneNumber = "+1-555-8888",
            Role = UserRole.User
        };

        // Act
        var response = await Client.PostAsJsonAsync("/api/v1/users", createUser);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task CreateUser_WithInvalidData_ReturnsBadRequest()
    {
        // Arrange
        var createUser = new CreateUserDto
        {
            FirstName = "", // Invalid: empty first name
            LastName = "User",
            Email = "invalid-email", // Invalid: not a valid email
            Role = UserRole.User
        };

        // Act
        var response = await Client.PostAsJsonAsync("/api/v1/users", createUser);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task UpdateUser_WithValidData_ReturnsOk()
    {
        // Arrange
        var userId = 1;
        var updateUser = new UpdateUserDto
        {
            FirstName = "Updated",
            LastName = "Name",
            PhoneNumber = "+1-555-1111"
        };

        // Act
        var response = await Client.PutAsJsonAsync($"/api/v1/users/{userId}", updateUser);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var user = await DeserializeResponseAsync<UserDto>(response);
        user.Should().NotBeNull();
        user!.FirstName.Should().Be(updateUser.FirstName);
        user.LastName.Should().Be(updateUser.LastName);
        user.PhoneNumber.Should().Be(updateUser.PhoneNumber);
    }

    [Fact]
    public async Task UpdateUser_WithInvalidId_ReturnsNotFound()
    {
        // Arrange
        var userId = 999;
        var updateUser = new UpdateUserDto
        {
            FirstName = "Updated"
        };

        // Act
        var response = await Client.PutAsJsonAsync($"/api/v1/users/{userId}", updateUser);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task UpdateUser_WithDuplicateEmail_ReturnsBadRequest()
    {
        // Arrange
        var userId = 1;
        var updateUser = new UpdateUserDto
        {
            Email = "admin.user@test.com" // This email belongs to another user
        };

        // Act
        var response = await Client.PutAsJsonAsync($"/api/v1/users/{userId}", updateUser);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task DeleteUser_WithValidId_ReturnsNoContent()
    {
        // Arrange
        var userId = 1;

        // Act
        var response = await Client.DeleteAsync($"/api/v1/users/{userId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        // Verify the user is actually deleted
        var getResponse = await Client.GetAsync($"/api/v1/users/{userId}");
        getResponse.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task DeleteUser_WithInvalidId_ReturnsNotFound()
    {
        // Arrange
        var userId = 999;

        // Act
        var response = await Client.DeleteAsync($"/api/v1/users/{userId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task SearchUsers_WithValidQuery_ReturnsResults()
    {
        // Arrange
        var searchQuery = "Test";

        // Act
        var response = await Client.GetAsync($"/api/v1/users/search?q={searchQuery}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("Test");
        content.Should().Contain("\"searchQuery\":\"Test\"");
    }

    [Fact]
    public async Task SearchUsers_WithEmptyQuery_ReturnsBadRequest()
    {
        // Act
        var response = await Client.GetAsync("/api/v1/users/search?q=");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task UpdateLastLogin_WithValidId_ReturnsNoContent()
    {
        // Arrange
        var userId = 1;

        // Act
        var response = await Client.PostAsync($"/api/v1/users/{userId}/login", null);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        // Verify the last login was updated by getting the user
        var getUserResponse = await Client.GetAsync($"/api/v1/users/{userId}");
        getUserResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var user = await DeserializeResponseAsync<UserDto>(getUserResponse);
        user.Should().NotBeNull();
        user!.LastLoginAt.Should().NotBeNull();
        user.LastLoginAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromMinutes(1));
    }

    [Fact]
    public async Task UpdateLastLogin_WithInvalidId_ReturnsNotFound()
    {
        // Arrange
        var userId = 999;

        // Act
        var response = await Client.PostAsync($"/api/v1/users/{userId}/login", null);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetUserStatistics_V2_ReturnsStatistics()
    {
        // Arrange
        SetApiVersion("2.0");

        // Act
        var response = await Client.GetAsync("/api/v2/users/statistics");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("totalUsers");
        content.Should().Contain("activeUsers");
        content.Should().Contain("usersByRole");
        content.Should().Contain("generatedAt");
    }

    [Fact]
    public async Task GetUsers_WithPagination_ReturnsCorrectPage()
    {
        // Arrange
        var page = 1;
        var pageSize = 1;

        // Act
        var response = await Client.GetAsync($"/api/v1/users?page={page}&pageSize={pageSize}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("\"page\":" + page);
        content.Should().Contain("\"pageSize\":" + pageSize);
    }

    [Fact]
    public async Task GetUsers_WithInvalidPagination_ReturnsBadRequest()
    {
        // Act
        var response = await Client.GetAsync("/api/v1/users?page=0&pageSize=101");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}