using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AnaECommerce.Backend.Models
{
    /// <summary>
    /// Represents a specific brand or manufacturer (e.g., Apple, Samsung).
    /// Brands are classified under a SubCategory.
    /// </summary>
    public class Brand : BaseEntity
    {
        /// <summary>The name of the brand.</summary>
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        /// <summary>The brand's story or manufacturer details.</summary>
        [MaxLength(500)]
        public string? Description { get; set; }

        /// <summary>The foreign key linking to the parent SubCategory.</summary>
        [Required]
        public int SubCategoryId { get; set; }

        // Navigation properties
        
        /// <summary>The parent SubCategory entity.</summary>
        [ForeignKey("SubCategoryId")]
        public virtual SubCategory? SubCategory { get; set; }

        /// <summary>Collection of products manufactured by this brand.</summary>
        public virtual ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
