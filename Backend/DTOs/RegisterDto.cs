using System.ComponentModel.DataAnnotations;

namespace AnaECommerce.Backend.DTOs
{
    /// <summary>Request DTO for creating a new user account with optional profile details.</summary>
    public class RegisterDto
    {
        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;

        /// <summary>Initial role to assign (defaults to 'Client').</summary>
        public string Role { get; set; } = "Client";

        // Optional onboarding details
        public string? Country { get; set; }
        public string? State { get; set; }
        public string? City { get; set; }
        public string? StreetAddress { get; set; }

        public string? PhoneNumber { get; set; }
        public string? ProfilePictureUrl { get; set; }
    }
}
