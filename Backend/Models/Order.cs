using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using AnaECommerce.Backend.Models.Enums;

namespace AnaECommerce.Backend.Models
{
    /// <summary>
    /// Represents a customer's purchase record. 
    /// Tracks order status, total cost, and associated items.
    /// </summary>
    public class Order : BaseEntity
    {
        /// <summary>A unique, user-facing reference number for the order (e.g., ORD-2024-ABC).</summary>
        [Required]
        [MaxLength(50)]
        public string OrderNumber { get; set; } = string.Empty;

        /// <summary>The ID of the user who placed the order.</summary>
        [Required]
        public string UserId { get; set; } = string.Empty;

        /// <summary>The total monetary value of the order including all items.</summary>
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        /// <summary>The current fulfillment stage of the order.</summary>
        [Required]
        public OrderStatus Status { get; set; } = OrderStatus.Pending;

        /// <summary>The date and time the order was successfully submitted.</summary>
        [Required]
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        // Navigation properties
        
        /// <summary>The user who owns this order.</summary>
        [ForeignKey("UserId")]
        public virtual ApplicationUser? User { get; set; }
        
        /// <summary>Collection of specific products and quantities included in this order.</summary>
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
