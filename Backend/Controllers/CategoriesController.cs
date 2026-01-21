using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using AnaECommerce.Backend.Interfaces;
using AnaECommerce.Backend.Models;
using AnaECommerce.Backend.DTOs;
using Microsoft.EntityFrameworkCore;

namespace AnaECommerce.Backend.Controllers
{
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

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<PaginatedResult<CategoryDto>>> GetCategories(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            var (categories, totalCount) = await _unitOfWork.Categories.GetPagedAsync(
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

        [HttpPost]
        public async Task<ActionResult> CreateCategory(CreateCategoryDto createDto)
        {
            var category = _mapper.Map<Category>(createDto);
            await _unitOfWork.Categories.AddAsync(category);
            await _unitOfWork.CommitAsync();

            return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, 
                new { message = "Category created successfully", id = category.Id });
        }

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

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCategory(int id)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(id);
            if (category == null)
            {
                return NotFound(new { message = "Category not found" });
            }

            // Check if category has subcategories
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
