using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AnaECommerce.Backend.Models
{
    /// <summary>
    /// Represents a product available for sale in the e-commerce store.
    /// Contains pricing, stock information, and categorization links.
    /// </summary>
    public class Product : BaseEntity
    {
        /// <summary>The display name of the product.</summary>
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        /// <summary>A detailed description of the product's features and specifications.</summary>
        [MaxLength(2000)]
        public string? Description { get; set; }

        /// <summary>The selling price per unit.</summary>
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        /// <summary>The number of units currently available in inventory.</summary>
        [Required]
        public int Stock { get; set; } = 0;

        /// <summary>The relative or absolute path to the product's primary image.</summary>
        [MaxLength(500)]
        public string? ImageUrl { get; set; }

        /// <summary>The ID of the Brand this product belongs to.</summary>
        [Required]
        public int BrandId { get; set; }

        // Navigation properties
        
        /// <summary>The Brand entity associated with this product.</summary>
        [ForeignKey("BrandId")]
        public virtual Brand? Brand { get; set; }
        
        /// <summary>Collection of order item records referencing this product.</summary>
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
