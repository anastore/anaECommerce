using System.ComponentModel.DataAnnotations;

namespace AnaECommerce.Backend.DTOs
{
    /// <summary>Request DTO for assigning a specific security role to a user.</summary>
    public class AssignRoleDto
    {
        [Required]
        public string RoleName { get; set; } = string.Empty;
    }
}
