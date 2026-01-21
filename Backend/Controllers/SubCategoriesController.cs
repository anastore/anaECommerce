using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using AnaECommerce.Backend.Interfaces;
using AnaECommerce.Backend.Models;
using AnaECommerce.Backend.DTOs;
using System.Linq.Expressions;

namespace AnaECommerce.Backend.Controllers
{
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

        [HttpGet]
        public async Task<ActionResult<PaginatedResult<SubCategoryDto>>> GetSubCategories(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] int? categoryId = null)
        {
            (IEnumerable<SubCategory> items, int totalCount) result;

            if (categoryId.HasValue)
            {
                result = await _unitOfWork.SubCategories.FindPagedAsync(
                    s => s.CategoryId == categoryId.Value,
                    pageNumber,
                    pageSize,
                    s => s.Category,
                    s => s.Brands
                );
            }
            else
            {
                result = await _unitOfWork.SubCategories.GetPagedAsync(
                    pageNumber,
                    pageSize,
                    s => s.Category,
                    s => s.Brands
                );
            }

            var dtos = _mapper.Map<IEnumerable<SubCategoryDto>>(result.items);

            return Ok(new PaginatedResult<SubCategoryDto>
            {
                Items = dtos.ToList(),
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalCount = result.totalCount
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SubCategoryDto>> GetSubCategory(int id)
        {
            var subCategory = await _unitOfWork.SubCategories.GetByIdAsync(id);
            if (subCategory == null) return NotFound();

            return Ok(_mapper.Map<SubCategoryDto>(subCategory));
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<SubCategoryDto>> CreateSubCategory(CreateSubCategoryDto createDto)
        {
            var subCategory = _mapper.Map<SubCategory>(createDto);
            await _unitOfWork.SubCategories.AddAsync(subCategory);
            await _unitOfWork.CommitAsync();

            return CreatedAtAction(nameof(GetSubCategory), new { id = subCategory.Id }, _mapper.Map<SubCategoryDto>(subCategory));
        }

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
