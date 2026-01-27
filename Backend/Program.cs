/**
 * AnaECommerce Backend - Application Entry Point
 * 
 * This file configures the WebApplication builder, registers services for Dependency Injection (DI),
 * and defines the HTTP request processing pipeline (Middleware).
 */

using AnaECommerce.Backend.Data;
using AnaECommerce.Backend.Models;
using AnaECommerce.Backend.Services;
using AnaECommerce.Backend.Interfaces;
using AnaECommerce.Backend.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// --- 1. SERVICE REGISTRATION (Dependency Injection) ---

// Register MVC controllers
builder.Services.AddControllers();

// Configure Cross-Origin Resource Sharing (CORS)
// Allows the Angular frontend to communicate with the API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy =>
        {
            if (builder.Environment.IsDevelopment())
            {
                // In development, be permissive to allow easy testing
                policy.AllowAnyOrigin()
                      .AllowAnyMethod()
                      .AllowAnyHeader();
            }
            else
            {
                // In production, restrict to the known frontend URL for security
                policy.WithOrigins("https://anaecommerce.vercel.app")
                      .AllowAnyMethod()
                      .AllowAnyHeader();
            }
        });
});

// Configure Swagger for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "AnaECommerce API", Version = "v1" });
    
    // Add JWT Authentication support to the Swagger UI
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter a valid token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
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
            new string[] { }
        }
    });
});

// HttpContextAccessor allows accessing the current user inside services/repositories
builder.Services.AddHttpContextAccessor();

// Configure Entity Framework Core with SQL Server
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure ASP.NET Core Identity for User & Role management
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// Configure JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false; // Set to false to support HTTP-only deployment on certain hosts
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidAudience = builder.Configuration["Jwt:Audience"],
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
    };
});

// Configure AutoMapper for DTO mapping
builder.Services.AddAutoMapper(typeof(Program));

// Register Generic Repository and Unit of Work for centralized data access
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// Register Application Services (Business Logic)
builder.Services.AddScoped<IAuthService, AuthService>();

var app = builder.Build();

// --- 2. HTTP REQUEST PIPELINE (Middleware) ---

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // Enable Swagger UI in development
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    // Always enable Swagger for demonstration purposes, even in production
    app.UseSwagger();
    app.UseSwaggerUI();
    // app.UseHttpsRedirection(); // Uncomment if HTTPS is strictly required
}

// Enable static files for serving uploaded images (from wwwroot)
app.UseStaticFiles();

// Order is CRITICAL here: CORS -> Authentication -> Authorization
app.UseCors("AllowAngular");

app.UseAuthentication();
app.UseAuthorization();

// Map route attributes on controllers to the request pipeline
app.MapControllers();

// Start the application
app.Run();
