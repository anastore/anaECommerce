using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using AnaECommerce.Backend.Interfaces;
using AnaECommerce.Backend.Models;
using AnaECommerce.Backend.DTOs;
using Microsoft.EntityFrameworkCore;

namespace AnaECommerce.Backend.Controllers
{
    /// <summary>
    /// API Controller for managing top-level product categories.
    /// Restricted to Admin users for write operations.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class CategoriesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CategoriesController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        /// <summary>Retrieves a paginated and optionally filtered list of categories.</summary>
        /// <param name="pageNumber">The 1-based page index.</param>
        /// <param name="pageSize">Number of items per page.</param>
        /// <param name="search">Optional keyword to filter categories by name or description.</param>
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<PaginatedResult<CategoryDto>>> GetCategories(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? search = null)
        {
            var (categories, totalCount) = await _unitOfWork.Categories.FindPagedAsync(
                c => string.IsNullOrEmpty(search) || c.Name.Contains(search) || (c.Description != null && c.Description.Contains(search)),
                pageNumber, 
                pageSize,
                c => c.SubCategories
            );
            
            var dtos = _mapper.Map<IEnumerable<CategoryDto>>(categories);

            return Ok(new PaginatedResult<CategoryDto>
            {
                Items = dtos.ToList(),
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalCount = totalCount
            });
        }

        /// <summary>Gets a specific category by its unique ID.</summary>
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<CategoryDto>> GetCategory(int id)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(id);
            if (category == null)
            {
                return NotFound(new { message = "Category not found" });
            }

            var categoryDto = _mapper.Map<CategoryDto>(category);
            categoryDto.SubCategoryCount = category.SubCategories?.Count ?? 0;

            return Ok(categoryDto);
        }

        /// <summary>Creates a new product category.</summary>
        [HttpPost]
        public async Task<ActionResult> CreateCategory(CreateCategoryDto createDto)
        {
            var category = _mapper.Map<Category>(createDto);
            await _unitOfWork.Categories.AddAsync(category);
            await _unitOfWork.CommitAsync();

            return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, 
                new { message = "Category created successfully", id = category.Id });
        }

        /// <summary>Updates the name or description of an existing category.</summary>
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCategory(int id, UpdateCategoryDto updateDto)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(id);
            if (category == null)
            {
                return NotFound(new { message = "Category not found" });
            }

            category.Name = updateDto.Name;
            category.Description = updateDto.Description;

            _unitOfWork.Categories.Update(category);
            await _unitOfWork.CommitAsync();

            return Ok(new { message = "Category updated successfully" });
        }

        /// <summary>
        /// Deletes a category. 
        /// Business Rule: A category cannot be deleted if it still has associated sub-categories.
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCategory(int id)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(id);
            if (category == null)
            {
                return NotFound(new { message = "Category not found" });
            }

            // Check if category has subcategories (Safety Check)
            if (category.SubCategories != null && category.SubCategories.Any())
            {
                return BadRequest(new { message = "Cannot delete category with associated subcategories. Please delete subcategories first." });
            }

            _unitOfWork.Categories.Delete(category);
            await _unitOfWork.CommitAsync();

            return Ok(new { message = "Category deleted successfully" });
        }
    }
}
