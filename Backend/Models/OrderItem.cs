using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AnaECommerce.Backend.Models
{
    /// <summary>
    /// Represents an individual line item in an Order.
    /// Snapshots the price at the time of purchase to ensure historical accuracy.
    /// </summary>
    public class OrderItem : BaseEntity
    {
        /// <summary>The foreign key linking to the parent Order.</summary>
        [Required]
        public int OrderId { get; set; }

        /// <summary>The foreign key linking to the Product purchased.</summary>
        [Required]
        public int ProductId { get; set; }

        /// <summary>The number of units of the product purchased.</summary>
        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }

        /// <summary>The unit price of the product at the very moment the order was placed.</summary>
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }

        // Navigation properties
        
        /// <summary>The parent Order entity.</summary>
        [ForeignKey("OrderId")]
        public virtual Order? Order { get; set; }

        /// <summary>The specific Product entity for this item.</summary>
        [ForeignKey("ProductId")]
        public virtual Product? Product { get; set; }
    }
}
