using System.ComponentModel.DataAnnotations;

namespace AnaECommerce.Backend.DTOs
{
    public class CreateRoleDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;
    }
}
