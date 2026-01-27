using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AnaECommerce.Backend.Models
{
    /// <summary>
    /// A middle-level categorization node that groups Brands under a specific Category.
    /// (e.g., "Smartphones" under "Electronics").
    /// </summary>
    public class SubCategory : BaseEntity
    {
        /// <summary>The display name of the sub-category.</summary>
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        /// <summary>Optional description of the sub-category.</summary>
        [MaxLength(500)]
        public string? Description { get; set; }

        /// <summary>The foreign key linking to the parent Category.</summary>
        [Required]
        public int CategoryId { get; set; }

        // Navigation properties
        
        /// <summary>The parent Category entity.</summary>
        [ForeignKey("CategoryId")]
        public virtual Category? Category { get; set; }

        /// <summary>Collection of brands belonging to this sub-category.</summary>
        public virtual ICollection<Brand> Brands { get; set; } = new List<Brand>();
    }
}
