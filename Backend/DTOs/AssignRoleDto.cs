using System.ComponentModel.DataAnnotations;

namespace AnaECommerce.Backend.DTOs
{
    public class AssignRoleDto
    {
        [Required]
        public string RoleName { get; set; } = string.Empty;
    }
}
