using Microsoft.AspNetCore.Identity;

namespace AnaECommerce.Backend.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? FullName { get; set; }
        public string? ProfilePictureUrl { get; set; }
        public string? StripeCustomerId { get; set; }
        public DateTime? BirthDate { get; set; }
        public string? Gender { get; set; }

        public ICollection<Address> Addresses { get; set; } = new List<Address>();
        public ICollection<UserPaymentMethod> PaymentMethods { get; set; } = new List<UserPaymentMethod>();
    }
}
