using System.ComponentModel.DataAnnotations;

namespace AnaECommerce.Backend.DTOs
{
    /// <summary>Request DTO for creating a new security role.</summary>
    public class CreateRoleDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;
    }
}
