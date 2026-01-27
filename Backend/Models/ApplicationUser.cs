using Microsoft.AspNetCore.Identity;

namespace AnaECommerce.Backend.Models
{
    /// <summary>
    /// Represents a user in the system. 
    /// Inherits from IdentityUser to leverage ASP.NET Core Identity's built-in security features.
    /// Includes additional profile fields and navigation properties.
    /// </summary>
    public class ApplicationUser : IdentityUser
    {
        /// <summary>The user's full display name.</summary>
        public string? FullName { get; set; }

        /// <summary>Optional URL to the user's profile picture.</summary>
        public string? ProfilePictureUrl { get; set; }

        /// <summary>The ID associated with this user in the Stripe payment system.</summary>
        public string? StripeCustomerId { get; set; }

        /// <summary>The user's date of birth.</summary>
        public DateTime? BirthDate { get; set; }

        /// <summary>The user's gender (e.g., Male, Female, Other).</summary>
        public string? Gender { get; set; }

        // Navigation properties
        
        /// <summary>Collection of shipping and billing addresses associated with the user.</summary>
        public ICollection<Address> Addresses { get; set; } = new List<Address>();

        /// <summary>Collection of stored payment methods for the user.</summary>
        public ICollection<UserPaymentMethod> PaymentMethods { get; set; } = new List<UserPaymentMethod>();
    }
}
