using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AnaECommerce.Backend.Models;
using AnaECommerce.Backend.DTOs;
using AnaECommerce.Backend.Data;

namespace AnaECommerce.Backend.Controllers
{
    /// <summary>
    /// API Controller for users to manage their own profiles, addresses, and payment methods.
    /// Restricted to authenticated users.
    /// </summary>
    [ApiController]
    [Route("api/profile")]
    [Authorize]
    public class UserProfileController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public UserProfileController(
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext context,
            IMapper mapper)
        {
            _userManager = userManager;
            _context = context;
            _mapper = mapper;
        }

        /// <summary>Retrieves the profile of the currently logged-in user.</summary>
        [HttpGet("GetProfile")]
        public async Task<ActionResult<UserProfileDto>> GetProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _context.Users
                .Include(u => u.Addresses)
                .Include(u => u.PaymentMethods)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) return NotFound();

            var dto = _mapper.Map<UserProfileDto>(user);
            dto.Email = user.Email;
            dto.PhoneNumber = user.PhoneNumber;

            return Ok(dto);
        }

        /// <summary>Updates the logged-in user's profile information.</summary>
        [HttpPut("UpdateProfile")]
        public async Task<IActionResult> UpdateProfile(UpdateUserProfileDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId!);

            if (user == null) return NotFound();

            _mapper.Map(dto, user);
            
            // Special handling for Identity-managed fields
            if (user.PhoneNumber != dto.PhoneNumber)
            {
                await _userManager.SetPhoneNumberAsync(user, dto.PhoneNumber);
            }

            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded) return NoContent();

            return BadRequest(result.Errors);
        }

        /// <summary>Adds a new shipping/billing address for the user.</summary>
        [HttpPost("addresses")]
        public async Task<ActionResult<AddressDto>> AddAddress(CreateAddressDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            
            var address = _mapper.Map<Address>(dto);
            address.UserId = userId!;

            // Maintain single default address invariant
            if (address.IsDefault)
            {
                var existingAddresses = await _context.Addresses
                    .Where(a => a.UserId == userId)
                    .ToListAsync();
                foreach (var addr in existingAddresses) addr.IsDefault = false;
            }

            _context.Addresses.Add(address);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProfile), _mapper.Map<AddressDto>(address));
        }

        /// <summary>Removes a user's address.</summary>
        [HttpDelete("addresses/{id}")]
        public async Task<IActionResult> DeleteAddress(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var address = await _context.Addresses
                .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

            if (address == null) return NotFound();

            _context.Addresses.Remove(address);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>Lists stored payment methods for the user.</summary>
        [HttpGet("GetPaymentMethods")]
        public async Task<ActionResult<IEnumerable<UserPaymentMethodDto>>> GetPaymentMethods()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var methods = await _context.PaymentMethods
                .Where(m => m.UserId == userId)
                .ToListAsync();

            return Ok(_mapper.Map<IEnumerable<UserPaymentMethodDto>>(methods));
        }
    }
}
