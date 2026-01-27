using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using AnaECommerce.Backend.Interfaces;
using AnaECommerce.Backend.Models;
using AnaECommerce.Backend.DTOs;
using System.Linq.Expressions;

namespace AnaECommerce.Backend.Controllers
{
    /// <summary>
    /// API Controller for product management.
    /// Handles catalog browsing (anonymous) and product administration (restricted).
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IWebHostEnvironment _environment;

        public ProductsController(IUnitOfWork unitOfWork, IMapper mapper, IWebHostEnvironment environment)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _environment = environment;
        }

        /// <summary>
        /// Retrieves products with advanced filtering and pagination. 
        /// Supports filtering by brand, category, sub-category, and keyword search.
        /// </summary>
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<PaginatedResult<ProductDto>>> GetProducts(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] int? brandId = null,
            [FromQuery] int? subCategoryId = null,
            [FromQuery] int? categoryId = null,
            [FromQuery] string? search = null)
        {
            // Build the filter expression dynamically based on provided query parameters
            Expression<Func<Product, bool>> predicate = p => 
                (!brandId.HasValue || p.BrandId == brandId.Value) &&
                (!subCategoryId.HasValue || p.Brand.SubCategoryId == subCategoryId.Value) &&
                (!categoryId.HasValue || p.Brand.SubCategory.CategoryId == categoryId.Value) &&
                (string.IsNullOrEmpty(search) || p.Name.Contains(search));

            // Use the repository method with eager loading of navigation tree
            var (products, totalCount) = await _unitOfWork.Products.FindPagedAsync(
                predicate, 
                pageNumber, 
                pageSize,
                p => p.Brand.SubCategory.Category
            );

            var dtos = _mapper.Map<IEnumerable<ProductDto>>(products);

            return Ok(new PaginatedResult<ProductDto>
            {
                Items = dtos.ToList(),
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalCount = totalCount
            });
        }

        /// <summary>Gets a single product by its unique ID.</summary>
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            var product = await _unitOfWork.Products.GetByIdAsync(id);
            if (product == null)
            {
                return NotFound(new { message = "Product not found" });
            }

            return Ok(_mapper.Map<ProductDto>(product));
        }

        /// <summary>Creates a new product record. Admin/Manager roles only.</summary>
        [HttpPost]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult> CreateProduct(CreateProductDto createDto)
        {
            var product = _mapper.Map<Product>(createDto);
            await _unitOfWork.Products.AddAsync(product);
            await _unitOfWork.CommitAsync();

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id },
                new { message = "Product created successfully", id = product.Id });
        }

        /// <summary>Updates an existing product's details. Admin/Manager roles only.</summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult> UpdateProduct(int id, UpdateProductDto updateDto)
        {
            var product = await _unitOfWork.Products.GetByIdAsync(id);
            if (product == null)
            {
                return NotFound(new { message = "Product not found" });
            }

            product.Name = updateDto.Name;
            product.Description = updateDto.Description;
            product.Price = updateDto.Price;
            product.Stock = updateDto.Stock;
            product.BrandId = updateDto.BrandId;
            product.ImageUrl = updateDto.ImageUrl;

            _unitOfWork.Products.Update(product);
            await _unitOfWork.CommitAsync();

            return Ok(new { message = "Product updated successfully" });
        }

        /// <summary>Deletes a product (Soft Delete). Restricted to Admin role.</summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var product = await _unitOfWork.Products.GetByIdAsync(id);
            if (product == null)
            {
                return NotFound(new { message = "Product not found" });
            }

            _unitOfWork.Products.Delete(product);
            await _unitOfWork.CommitAsync();

            return Ok(new { message = "Product deleted successfully" });
        }

        /// <summary>
        /// Uploads an image file to the server and returns its relative path. 
        /// Restricted to Admin/Manager roles.
        /// </summary>
        [HttpPost("upload-image")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult> UploadImage([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "No file uploaded" });
            }

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (!allowedExtensions.Contains(extension))
            {
                return BadRequest(new { message = "Invalid file type. Only images are allowed." });
            }

            // Generate unique filename to avoid collisions
            var fileName = $"{Guid.NewGuid()}{extension}";
            var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads", "products");
            
            // Ensure directory exists
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var imageUrl = $"/uploads/products/{fileName}";
            return Ok(new { imageUrl });
        }
    }
}
