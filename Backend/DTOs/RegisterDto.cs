using System.ComponentModel.DataAnnotations;

namespace AnaECommerce.Backend.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;

        public string Role { get; set; } = "Client";

        // Optional address for onboarding flow
        public string? Country { get; set; }
        public string? State { get; set; }
        public string? City { get; set; }
        public string? StreetAddress { get; set; }

        public string? PhoneNumber { get; set; }
        public string? ProfilePictureUrl { get; set; }
    }
}
