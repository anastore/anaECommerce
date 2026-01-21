using System.ComponentModel.DataAnnotations;

namespace AnaECommerce.Backend.Models
{
    public class Address : BaseEntity
    {
        [Required]
        public string UserId { get; set; } = string.Empty;
        public ApplicationUser? User { get; set; }

        [Required]
        [MaxLength(100)]
        public string AddressType { get; set; } = "Home"; // e.g., Home, Work

        [Required]
        [MaxLength(100)]
        public string Country { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string State { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string City { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string StreetAddress { get; set; } = string.Empty;

        public bool IsDefault { get; set; }
    }
}
