using System.ComponentModel.DataAnnotations;

namespace AnaECommerce.Backend.DTOs
{
    /// <summary>Comprehensive DTO for a user's personal profile, addresses, and payment summary.</summary>
    public class UserProfileDto
    {
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? ProfilePictureUrl { get; set; }
        public DateTime? BirthDate { get; set; }
        public string? Gender { get; set; }
        
        /// <summary>Collection of the user's saved addresses.</summary>
        public List<AddressDto> Addresses { get; set; } = new();
        
        /// <summary>Collection of the user's payment methods (partial data for security).</summary>
        public List<UserPaymentMethodDto> PaymentMethods { get; set; } = new();
    }

    /// <summary>Request DTO for updating the logged-in user's profile info.</summary>
    public class UpdateUserProfileDto
    {
        [Required]
        public string FullName { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public DateTime? BirthDate { get; set; }
        public string? Gender { get; set; }
    }

    /// <summary>DTO representing a physical address in response objects.</summary>
    public class AddressDto
    {
        public int Id { get; set; }
        public string AddressType { get; set; } = string.Empty; // e.g., Billing, Shipping, Home
        public string Country { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string StreetAddress { get; set; } = string.Empty;
        public bool IsDefault { get; set; }
    }

    /// <summary>Request DTO for creating a new address.</summary>
    public class CreateAddressDto
    {
        [Required]
        public string AddressType { get; set; } = "Home";
        [Required]
        public string Country { get; set; } = string.Empty;
        [Required]
        public string State { get; set; } = string.Empty;
        [Required]
        public string City { get; set; } = string.Empty;
        [Required]
        public string StreetAddress { get; set; } = string.Empty;
        public bool IsDefault { get; set; }
    }

    /// <summary>Response DTO providing a safe summary of a saved payment card.</summary>
    public class UserPaymentMethodDto
    {
        public int Id { get; set; }
        public string? CardBrand { get; set; } // e.g., Visa, Mastercard
        public string? Last4 { get; set; }      // Last 4 digits of the card number
        public bool IsDefault { get; set; }
    }
}
