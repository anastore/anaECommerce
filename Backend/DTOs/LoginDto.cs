using System.ComponentModel.DataAnnotations;

namespace AnaECommerce.Backend.DTOs
{
    /// <summary>Request DTO containing credentials for user authentication.</summary>
    public class LoginDto
    {
        /// <summary>User's email address (used as the primary username).</summary>
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        /// <summary>User's plain-text password (to be verified against the hashed password in DB).</summary>
        [Required]
        public string Password { get; set; } = string.Empty;
    }
}
