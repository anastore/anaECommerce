using System.ComponentModel.DataAnnotations;

namespace AnaECommerce.Backend.DTOs
{
    public class UserProfileDto
    {
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? ProfilePictureUrl { get; set; }
        public DateTime? BirthDate { get; set; }
        public string? Gender { get; set; }
        public List<AddressDto> Addresses { get; set; } = new();
        public List<UserPaymentMethodDto> PaymentMethods { get; set; } = new();
    }

    public class UpdateUserProfileDto
    {
        [Required]
        public string FullName { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public DateTime? BirthDate { get; set; }
        public string? Gender { get; set; }
    }

    public class AddressDto
    {
        public int Id { get; set; }
        public string AddressType { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string StreetAddress { get; set; } = string.Empty;
        public bool IsDefault { get; set; }
    }

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

    public class UserPaymentMethodDto
    {
        public int Id { get; set; }
        public string? CardBrand { get; set; }
        public string? Last4 { get; set; }
        public bool IsDefault { get; set; }
    }
}
