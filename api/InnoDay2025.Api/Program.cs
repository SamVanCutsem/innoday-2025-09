using Asp.Versioning;
using Asp.Versioning.ApiExplorer;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Serilog;
using System.Reflection;
using InnoDay2025.Api.Data;
using InnoDay2025.Api.Services;
using InnoDay2025.Api.Middleware;
using FluentValidation;
using AutoMapper;
using InnoDay2025.Api.Mapping;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/innoday-api-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container
builder.Services.AddControllers();

// Configure Entity Framework with In-Memory Database for demo
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseInMemoryDatabase("InnoDay2025Db"));

// Add API Versioning
builder.Services.AddApiVersioning(opt =>
{
    opt.DefaultApiVersion = new ApiVersion(1, 0);
    opt.AssumeDefaultVersionWhenUnspecified = true;
    opt.ApiVersionReader = ApiVersionReader.Combine(
        new UrlSegmentApiVersionReader(),
        new QueryStringApiVersionReader("version"),
        new HeaderApiVersionReader("X-Version")
    );
}).AddApiExplorer(setup =>
{
    setup.GroupNameFormat = "'v'VVV";
    setup.SubstituteApiVersionInUrl = true;
});

// Add AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile));

// Add FluentValidation
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// Add application services
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IUserService, UserService>();

// Add Health Checks
builder.Services.AddHealthChecks()
    .AddDbContextCheck<ApplicationDbContext>();

// Configure CORS for Next.js frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("NextJsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Add Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "InnoDay 2025 API",
        Version = "v1",
        Description = "A comprehensive REST API for InnoDay 2025 project",
        Contact = new OpenApiContact
        {
            Name = "InnoDay Team",
            Email = "team@innoday2025.com"
        }
    });

    c.SwaggerDoc("v2", new OpenApiInfo
    {
        Title = "InnoDay 2025 API",
        Version = "v2",
        Description = "A comprehensive REST API for InnoDay 2025 project - Version 2"
    });

    // Include XML comments
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }

    // Add JWT Authentication to Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        var apiVersionDescriptionProvider = app.Services.GetRequiredService<IApiVersionDescriptionProvider>();
        foreach (var description in apiVersionDescriptionProvider.ApiVersionDescriptions.Reverse())
        {
            c.SwaggerEndpoint($"/swagger/{description.GroupName}/swagger.json",
                $"InnoDay 2025 API {description.GroupName.ToUpperInvariant()}");
        }
        c.RoutePrefix = "swagger";
    });
}

// Add custom middleware
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseMiddleware<RequestLoggingMiddleware>();

app.UseHttpsRedirection();

// Use CORS
app.UseCors("NextJsPolicy");

app.UseAuthentication();
app.UseAuthorization();

// Add Health Check endpoints
app.MapHealthChecks("/health");
app.MapHealthChecks("/health/ready", new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("ready")
});

app.MapControllers();

// Seed database in development
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await SeedData.Initialize(context);
}

try
{
    Log.Information("Starting InnoDay 2025 API");
    await app.RunAsync();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}

// Make Program class accessible for testing
public partial class Program { }