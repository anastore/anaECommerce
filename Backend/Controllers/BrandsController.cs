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
    public class BrandsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public BrandsController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<PaginatedResult<BrandDto>>> GetBrands(
            [FromQuery] int pageNumber = 1, 
            [FromQuery] int pageSize = 10, 
            [FromQuery] int? subCategoryId = null)
        {
            (IEnumerable<Brand> items, int totalCount) result;

            if (subCategoryId.HasValue)
            {
                result = await _unitOfWork.Brands.FindPagedAsync(
                    b => b.SubCategoryId == subCategoryId.Value,
                    pageNumber,
                    pageSize,
                    b => b.SubCategory.Category,
                    b => b.Products
                );
            }
            else
            {
                result = await _unitOfWork.Brands.GetPagedAsync(
                    pageNumber,
                    pageSize,
                    b => b.SubCategory.Category,
                    b => b.Products
                );
            }

            var dtos = _mapper.Map<IEnumerable<BrandDto>>(result.items);

            return Ok(new PaginatedResult<BrandDto>
            {
                Items = dtos.ToList(),
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalCount = result.totalCount
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BrandDto>> GetBrand(int id)
        {
            var brand = await _unitOfWork.Brands.GetByIdAsync(id);
            if (brand == null) return NotFound();

            return Ok(_mapper.Map<BrandDto>(brand));
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<BrandDto>> CreateBrand(CreateBrandDto createDto)
        {
            var brand = _mapper.Map<Brand>(createDto);
            await _unitOfWork.Brands.AddAsync(brand);
            await _unitOfWork.CommitAsync();

            return CreatedAtAction(nameof(GetBrand), new { id = brand.Id }, _mapper.Map<BrandDto>(brand));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult> UpdateBrand(int id, UpdateBrandDto updateDto)
        {
            var brand = await _unitOfWork.Brands.GetByIdAsync(id);
            if (brand == null) return NotFound();

            _mapper.Map(updateDto, brand);
            _unitOfWork.Brands.Update(brand);
            await _unitOfWork.CommitAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteBrand(int id)
        {
            var brand = await _unitOfWork.Brands.GetByIdAsync(id);
            if (brand == null) return NotFound();

            _unitOfWork.Brands.Delete(brand);
            await _unitOfWork.CommitAsync();

            return NoContent();
        }
    }
}
