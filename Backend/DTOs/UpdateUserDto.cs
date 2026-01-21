using System.ComponentModel.DataAnnotations;

namespace AnaECommerce.Backend.DTOs
{
    public class UpdateUserDto
    {
        [Required]
        public string FullName { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }
}
