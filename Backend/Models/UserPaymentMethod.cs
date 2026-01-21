using System.ComponentModel.DataAnnotations;

namespace AnaECommerce.Backend.Models
{
    public class UserPaymentMethod : BaseEntity
    {
        [Required]
        public string UserId { get; set; } = string.Empty;
        public ApplicationUser? User { get; set; }

        [MaxLength(50)]
        public string? CardBrand { get; set; } // e.g., Visa, Mastercard

        [MaxLength(4)]
        public string? Last4 { get; set; }

        [MaxLength(100)]
        public string? StripePaymentMethodId { get; set; }

        public bool IsDefault { get; set; }
    }
}
