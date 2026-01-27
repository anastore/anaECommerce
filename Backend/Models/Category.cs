using System.ComponentModel.DataAnnotations;

namespace AnaECommerce.Backend.Models
{
    /// <summary>
    /// High-level category for grouping products (e.g., Electronics, Clothing).
    /// Acts as the root of the catalog hierarchy.
    /// </summary>
    public class Category : BaseEntity
    {
        /// <summary>The display name of the category.</summary>
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        /// <summary>Optional descriptive text for the category.</summary>
        [MaxLength(500)]
        public string? Description { get; set; }

        // Navigation property
        
        /// <summary>Collection of sub-categories belonging to this root category.</summary>
        public virtual ICollection<SubCategory> SubCategories { get; set; } = new List<SubCategory>();
    }
}
