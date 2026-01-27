using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AnaECommerce.Backend.DTOs;
using AnaECommerce.Backend.Models;

namespace AnaECommerce.Backend.Controllers
{
    /// <summary>
    /// API Controller for administrative user management.
    /// Restricted strictly to Admin users.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public UsersController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        /// <summary>Lists all users with search and pagination features.</summary>
        [HttpGet("")]
        public async Task<ActionResult<PaginatedResult<UserDto>>> GetAllUsers(
            [FromQuery] int pageNumber = 1, 
            [FromQuery] int pageSize = 10,
            [FromQuery] string? search = null)
        {
            var usersQuery = _userManager.Users.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                usersQuery = usersQuery.Where(u => u.FullName.Contains(search) || (u.Email != null && u.Email.Contains(search)));
            }

            var totalCount = await usersQuery.CountAsync();
            
            var users = await usersQuery
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var userDtos = new List<UserDto>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                userDtos.Add(new UserDto
                {
                    Id = user.Id,
                    FullName = user.FullName,
                    Email = user.Email ?? "",
                    Role = roles.FirstOrDefault() ?? "Client",
                    EmailConfirmed = user.EmailConfirmed,
                    LockoutEnabled = user.LockoutEnabled,
                    LockoutEnd = user.LockoutEnd
                });
            }

            return Ok(new PaginatedResult<UserDto>
            {
                Items = userDtos,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            });
        }

        /// <summary>Gets a specific user's basic info and system status.</summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var roles = await _userManager.GetRolesAsync(user);
            var userDto = new UserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email ?? "",
                Role = roles.FirstOrDefault() ?? "Client",
                EmailConfirmed = user.EmailConfirmed,
                LockoutEnabled = user.LockoutEnabled,
                LockoutEnd = user.LockoutEnd
            };

            return Ok(userDto);
        }

        /// <summary>Updates a user's account name and email.</summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, UpdateUserDto updateUserDto)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            user.FullName = updateUserDto.FullName;
            user.Email = updateUserDto.Email;
            user.UserName = updateUserDto.Email;
            user.NormalizedEmail = updateUserDto.Email.ToUpper();
            user.NormalizedUserName = updateUserDto.Email.ToUpper();

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(new { message = "Failed to update user", errors = result.Errors });
            }

            return Ok(new { message = "User updated successfully" });
        }

        /// <summary>Hard deletes a user from the Identity system.</summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(new { message = "Failed to delete user", errors = result.Errors });
            }

            return Ok(new { message = "User deleted successfully" });
        }

        /// <summary>
        /// Changes a user's security role.
        /// Logic: Removes all current roles first to ensure single-role assignment.
        /// </summary>
        [HttpPut("{id}/role")]
        public async Task<IActionResult> AssignRole(string id, AssignRoleDto assignRoleDto)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            // Remove existing roles to prevent role accumulation
            var currentRoles = await _userManager.GetRolesAsync(user);
            await _userManager.RemoveFromRolesAsync(user, currentRoles);

            // Add the single new role
            var result = await _userManager.AddToRoleAsync(user, assignRoleDto.RoleName);
            if (!result.Succeeded)
            {
                return BadRequest(new { message = "Failed to assign role", errors = result.Errors });
            }

            return Ok(new { message = "Role assigned successfully" });
        }
    }
}
