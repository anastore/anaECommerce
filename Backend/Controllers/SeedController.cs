using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using AnaECommerce.Backend.Models;
using AnaECommerce.Backend.Models.Enums;
using AnaECommerce.Backend.Interfaces;

namespace AnaECommerce.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeedController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IUnitOfWork _unitOfWork;

        public SeedController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IUnitOfWork unitOfWork)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _unitOfWork = unitOfWork;
        }

        [HttpPost("users")]
        public async Task<IActionResult> SeedUsers()
        {
            // Ensure roles exist
            if (!await _roleManager.RoleExistsAsync("Admin"))
            {
                await _roleManager.CreateAsync(new IdentityRole("Admin"));
            }
            if (!await _roleManager.RoleExistsAsync("Client"))
            {
                await _roleManager.CreateAsync(new IdentityRole("Client"));
            }
            if (!await _roleManager.RoleExistsAsync("Manager"))
            {
                await _roleManager.CreateAsync(new IdentityRole("Manager"));
            }

            var sampleUsers = new[]
            {
                new { FullName = "Admin User", Email = "admin@anaecommerce.com", Password = "Admin123!", Role = "Admin" },
                new { FullName = "John Doe", Email = "john@example.com", Password = "User123!", Role = "Client" },
                new { FullName = "Jane Smith", Email = "jane@example.com", Password = "User123!", Role = "Client" },
                new { FullName = "Bob Manager", Email = "bob@example.com", Password = "User123!", Role = "Manager" },
                new { FullName = "Alice Johnson", Email = "alice@example.com", Password = "User123!", Role = "Client" },
                new { FullName = "Charlie Brown", Email = "charlie@example.com", Password = "User123!", Role = "Client" }
            };

            var createdUsers = new List<string>();

            foreach (var userData in sampleUsers)
            {
                var existingUser = await _userManager.FindByEmailAsync(userData.Email);
                if (existingUser == null)
                {
                    var user = new ApplicationUser
                    {
                        FullName = userData.FullName,
                        Email = userData.Email,
                        UserName = userData.Email,
                        EmailConfirmed = true
                    };

                    var result = await _userManager.CreateAsync(user, userData.Password);
                    if (result.Succeeded)
                    {
                        await _userManager.AddToRoleAsync(user, userData.Role);
                        createdUsers.Add($"{userData.FullName} ({userData.Email}) - {userData.Role}");
                    }
                }
            }

            if (createdUsers.Count == 0)
            {
                return Ok(new { message = "All sample users already exist" });
            }

            return Ok(new { message = "Sample users created successfully", users = createdUsers });
        }

        [HttpPost("categories")]
        public async Task<IActionResult> SeedCategories()
        {
            var existingCount = await _unitOfWork.Categories.CountAsync();
            if (existingCount > 0)
            {
                return Ok(new { message = "Categories already seeded" });
            }

            var categories = new List<Category>();
            var subCategories = new List<SubCategory>();
            var brands = new List<Brand>();

            // 1. Electronics
            var electronics = new Category { Name = "Electronics", Description = "Electronic devices and gadgets" };
            categories.Add(electronics);
            
            var mobileInfo = new SubCategory { Name = "Mobile Phones & Accessories", Description = "Smartphones and accessories", Category = electronics };
            var computers = new SubCategory { Name = "Computers & Laptops", Description = "Personal computers", Category = electronics };
            var audio = new SubCategory { Name = "Audio", Description = "Headphones and speakers", Category = electronics };
            subCategories.AddRange(new[] { mobileInfo, computers, audio });

            brands.AddRange(new[]
            {
                new Brand { Name = "Apple", SubCategory = mobileInfo },
                new Brand { Name = "Samsung", SubCategory = mobileInfo },
                new Brand { Name = "Dell", SubCategory = computers },
                new Brand { Name = "HP", SubCategory = computers },
                new Brand { Name = "Sony", SubCategory = audio },
                new Brand { Name = "Bose", SubCategory = audio }
            });

            // 2. Clothing
            var clothing = new Category { Name = "Clothing", Description = "Men's and women's fashion" };
            categories.Add(clothing);

            var mens = new SubCategory { Name = "Men's Fashion", Description = "Clothing for men", Category = clothing };
            var womens = new SubCategory { Name = "Women's Fashion", Description = "Clothing for women", Category = clothing };
            subCategories.AddRange(new[] { mens, womens });

            brands.AddRange(new[]
            {
                new Brand { Name = "Nike", SubCategory = mens },
                new Brand { Name = "Adidas", SubCategory = mens },
                new Brand { Name = "Zara", SubCategory = womens },
                new Brand { Name = "H&M", SubCategory = womens }
            });

            // 3. Books
            var books = new Category { Name = "Books", Description = "Physical and digital books" };
            categories.Add(books);
            
            var fiction = new SubCategory { Name = "Fiction", Description = "Fiction books", Category = books };
            var tech = new SubCategory { Name = "Technology", Description = "Tech books", Category = books };
            subCategories.Add(fiction);
            subCategories.Add(tech);

            brands.AddRange(new[]
            {
                new Brand { Name = "Penguin Books", SubCategory = fiction },
                new Brand { Name = "O'Reilly", SubCategory = tech }
            });

            // Add Categories
            foreach (var category in categories)
            {
                await _unitOfWork.Categories.AddAsync(category);
            }
            // Add SubCategories
            foreach (var sub in subCategories)
            {
                await _unitOfWork.SubCategories.AddAsync(sub);
            }
            // Add Brands
            foreach (var brand in brands)
            {
                await _unitOfWork.Brands.AddAsync(brand);
            }

            await _unitOfWork.CommitAsync();

            return Ok(new { message = $"{categories.Count} categories, {subCategories.Count} subcategories, and {brands.Count} brands created successfully" });
        }

        [HttpPost("products")]
        public async Task<IActionResult> SeedProducts()
        {
            var existingCount = await _unitOfWork.Products.CountAsync();
            if (existingCount > 0)
            {
                return Ok(new { message = "Products already seeded" });
            }

            var brands = (await _unitOfWork.Brands.GetAllAsync()).ToList();
            if (!brands.Any())
            {
                return BadRequest(new { message = "Please seed categories/brands first" });
            }

            // Helper to find brand by name
            int GetBrandId(string name) => brands.FirstOrDefault(b => b.Name == name)?.Id ?? brands.First().Id;

            var products = new List<Product>
            {
                // Electronics -> Mobile -> Apple/Samsung
                new Product { Name = "iPhone 14", Description = "Apple flagship smartphone", Price = 999.99m, Stock = 50, BrandId = GetBrandId("Apple"), ImageUrl = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500" },
                new Product { Name = "Samsung Galaxy S23", Description = "Latest Samsung flagship", Price = 899.99m, Stock = 30, BrandId = GetBrandId("Samsung"), ImageUrl = "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500" },
                
                // Electronics -> Computers -> Dell/HP
                new Product { Name = "Dell XPS 15", Description = "High-performance laptop", Price = 1899.99m, Stock = 20, BrandId = GetBrandId("Dell"), ImageUrl = "https://images.unsplash.com/photo-1593642632823-8f78536788c6?w=500" },
                new Product { Name = "HP Spectre", Description = "Convertible laptop", Price = 1499.99m, Stock = 15, BrandId = GetBrandId("HP"), ImageUrl = "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500" },

                // Electronics -> Audio -> Sony/Bose
                new Product { Name = "Sony WH-1000XM5", Description = "Noise cancelling headphones", Price = 399.99m, Stock = 40, BrandId = GetBrandId("Sony"), ImageUrl = "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500" },
                new Product { Name = "Bose QuietComfort", Description = "Premium comfort headphones", Price = 329.99m, Stock = 35, BrandId = GetBrandId("Bose"), ImageUrl = "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500" },

                // Clothing -> Men -> Nike/Adidas
                new Product { Name = "Nike Air Max", Description = "Running shoes", Price = 129.99m, Stock = 60, BrandId = GetBrandId("Nike"), ImageUrl = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500" },
                new Product { Name = "Adidas Ultraboost", Description = "Comfortable running shoes", Price = 180.00m, Stock = 50, BrandId = GetBrandId("Adidas"), ImageUrl = "https://images.unsplash.com/photo-1587563871167-1ee9c731aef4?w=500" },

                // Clothing -> Women -> Zara/H&M
                new Product { Name = "Zara Summer Dress", Description = "Floral print dress", Price = 59.99m, Stock = 40, BrandId = GetBrandId("Zara"), ImageUrl = "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500" },
                new Product { Name = "H&M Sweater", Description = "Cozy knit sweater", Price = 34.99m, Stock = 80, BrandId = GetBrandId("H&M"), ImageUrl = "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500" },

                // Books -> Fiction -> Penguin
                new Product { Name = "1984", Description = "Dystopian novel by George Orwell", Price = 14.99m, Stock = 100, BrandId = GetBrandId("Penguin Books"), ImageUrl = "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=500" },
                
                // Books -> Tech -> O'Reilly
                new Product { Name = "Learning C#", Description = "Complete guide to C#", Price = 49.99m, Stock = 50, BrandId = GetBrandId("O'Reilly"), ImageUrl = "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500" }
            };

            foreach (var product in products)
            {
                await _unitOfWork.Products.AddAsync(product);
            }

            await _unitOfWork.CommitAsync();

            return Ok(new { message = $"{products.Count} products created successfully" });
        }

        [HttpPost("orders")]
        public async Task<IActionResult> SeedOrders()
        {
            var existingCount = await _unitOfWork.Orders.CountAsync();
            if (existingCount > 0)
            {
                return Ok(new { message = "Orders already seeded" });
            }

            var users = _userManager.Users.ToList();
            var products = (await _unitOfWork.Products.GetAllAsync()).ToList();

            if (!users.Any() || !products.Any())
            {
                return BadRequest(new { message = "Please seed users and products first" });
            }

            var random = new Random();
            var orders = new List<Order>();

            for (int i = 1; i <= 25; i++)
            {
                var user = users[random.Next(users.Count)];
                var orderDate = DateTime.UtcNow.AddDays(-random.Next(1, 90));
                var status = (OrderStatus)random.Next(0, 5);

                var order = new Order
                {
                    OrderNumber = $"ORD-{DateTime.UtcNow.Year}-{i:D5}",
                    UserId = user.Id,
                    OrderDate = orderDate,
                    Status = status,
                    TotalAmount = 0
                };

                // Add 1-5 random items to each order
                var itemCount = random.Next(1, 6);
                var orderItems = new List<OrderItem>();
                decimal totalAmount = 0;

                for (int j = 0; j < itemCount; j++)
                {
                    var product = products[random.Next(products.Count)];
                    var quantity = random.Next(1, 4);
                    var unitPrice = product.Price;

                    orderItems.Add(new OrderItem
                    {
                        ProductId = product.Id,
                        Quantity = quantity,
                        UnitPrice = unitPrice
                    });

                    totalAmount += unitPrice * quantity;
                }

                order.TotalAmount = totalAmount;
                await _unitOfWork.Orders.AddAsync(order);
                await _unitOfWork.CommitAsync();

                foreach (var item in orderItems)
                {
                    item.OrderId = order.Id;
                    await _unitOfWork.OrderItems.AddAsync(item);
                }
            }

            await _unitOfWork.CommitAsync();

            return Ok(new { message = "25 orders created successfully" });
        }
    }
}
