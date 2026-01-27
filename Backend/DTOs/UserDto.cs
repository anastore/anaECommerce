namespace AnaECommerce.Backend.DTOs
{
    /// <summary>
    /// Data Transfer Object representing a system user for administrative tasks.
    /// Used in user management lists and status updates.
    /// </summary>
    public class UserDto
    {
        public string Id { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        
        /// <summary>Security status: True if the user has verified their email address.</summary>
        public bool EmailConfirmed { get; set; }
        
        /// <summary>Security status: True if the user's account can be locked after multiple failed logins.</summary>
        public bool LockoutEnabled { get; set; }
        
        /// <summary>Optional timestamp indicating when a user's lockout period expires.</summary>
        public DateTimeOffset? LockoutEnd { get; set; }
    }
}
