using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AnaECommerce.Backend.DTOs;

namespace AnaECommerce.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class RolesController : ControllerBase
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<Models.ApplicationUser> _userManager;

        public RolesController(RoleManager<IdentityRole> roleManager, UserManager<Models.ApplicationUser> userManager)
        {
            _roleManager = roleManager;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoleDto>>> GetAllRoles()
        {
            var roles = await _roleManager.Roles.ToListAsync();
            var roleDtos = new List<RoleDto>();

            foreach (var role in roles)
            {
                var usersInRole = await _userManager.GetUsersInRoleAsync(role.Name ?? "");
                roleDtos.Add(new RoleDto
                {
                    Id = role.Id,
                    Name = role.Name ?? "",
                    UserCount = usersInRole.Count
                });
            }

            return Ok(roleDtos);
        }

        [HttpPost]
        public async Task<ActionResult> CreateRole(CreateRoleDto createRoleDto)
        {
            var roleExists = await _roleManager.RoleExistsAsync(createRoleDto.Name);
            if (roleExists)
            {
                return BadRequest(new { message = "Role already exists" });
            }

            var role = new IdentityRole(createRoleDto.Name);
            var result = await _roleManager.CreateAsync(role);

            if (!result.Succeeded)
            {
                return BadRequest(new { message = "Failed to create role", errors = result.Errors });
            }

            return Ok(new { message = "Role created successfully", roleId = role.Id });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRole(string id, CreateRoleDto updateRoleDto)
        {
            var role = await _roleManager.FindByIdAsync(id);
            if (role == null)
            {
                return NotFound(new { message = "Role not found" });
            }

            role.Name = updateRoleDto.Name;
            role.NormalizedName = updateRoleDto.Name.ToUpper();

            var result = await _roleManager.UpdateAsync(role);
            if (!result.Succeeded)
            {
                return BadRequest(new { message = "Failed to update role", errors = result.Errors });
            }

            return Ok(new { message = "Role updated successfully" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(string id)
        {
            var role = await _roleManager.FindByIdAsync(id);
            if (role == null)
            {
                return NotFound(new { message = "Role not found" });
            }

            // Check if any users have this role
            var usersInRole = await _userManager.GetUsersInRoleAsync(role.Name ?? "");
            if (usersInRole.Any())
            {
                return BadRequest(new { message = "Cannot delete role with assigned users" });
            }

            var result = await _roleManager.DeleteAsync(role);
            if (!result.Succeeded)
            {
                return BadRequest(new { message = "Failed to delete role", errors = result.Errors });
            }

            return Ok(new { message = "Role deleted successfully" });
        }
    }
}
