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
    /// API Controller for sub-category management.
    /// Acts as the bridge between root Categories and individual Brands.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class SubCategoriesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public SubCategoriesController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        /// <summary>Retrieves sub-categories with optional root-category filtering and keyword search.</summary>
        [HttpGet]
        public async Task<ActionResult<PaginatedResult<SubCategoryDto>>> GetSubCategories(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] int? categoryId = null,
            [FromQuery] string? search = null)
        {
            Expression<Func<SubCategory, bool>> predicate = s => 
                (!categoryId.HasValue || s.CategoryId == categoryId.Value) &&
                (string.IsNullOrEmpty(search) || s.Name.Contains(search));

            var result = await _unitOfWork.SubCategories.FindPagedAsync(
                predicate,
                pageNumber,
                pageSize,
                s => s.Category,
                s => s.Brands
            );

            var dtos = _mapper.Map<IEnumerable<SubCategoryDto>>(result.Items);

            return Ok(new PaginatedResult<SubCategoryDto>
            {
                Items = dtos.ToList(),
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalCount = result.TotalCount
            });
        }

        /// <summary>Gets high-level metadata for a single sub-category.</summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<SubCategoryDto>> GetSubCategory(int id)
        {
            var subCategory = await _unitOfWork.SubCategories.GetByIdAsync(id);
            if (subCategory == null) return NotFound();

            return Ok(_mapper.Map<SubCategoryDto>(subCategory));
        }

        /// <summary>Registers a new sub-category. Admin/Manager roles only.</summary>
        [HttpPost]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<SubCategoryDto>> CreateSubCategory(CreateSubCategoryDto createDto)
        {
            var subCategory = _mapper.Map<SubCategory>(createDto);
            await _unitOfWork.SubCategories.AddAsync(subCategory);
            await _unitOfWork.CommitAsync();

            return CreatedAtAction(nameof(GetSubCategory), new { id = subCategory.Id }, _mapper.Map<SubCategoryDto>(subCategory));
        }

        /// <summary>Updates an existing sub-category's name or its parent Category link.</summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult> UpdateSubCategory(int id, UpdateSubCategoryDto updateDto)
        {
            var subCategory = await _unitOfWork.SubCategories.GetByIdAsync(id);
            if (subCategory == null) return NotFound();

            _mapper.Map(updateDto, subCategory);
            _unitOfWork.SubCategories.Update(subCategory);
            await _unitOfWork.CommitAsync();

            return NoContent();
        }

        /// <summary>Deletes a sub-category. Restricted to Admin role.</summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteSubCategory(int id)
        {
            var subCategory = await _unitOfWork.SubCategories.GetByIdAsync(id);
            if (subCategory == null) return NotFound();

            _unitOfWork.SubCategories.Delete(subCategory);
            await _unitOfWork.CommitAsync();

            return NoContent();
        }
    }
}
