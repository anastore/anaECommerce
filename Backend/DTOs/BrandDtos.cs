namespace AnaECommerce.Backend.DTOs
{
    /// <summary>Response DTO for brand details, including categorized parent links.</summary>
    public class BrandDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        
        // Link to the immediate parent sub-category
        public int SubCategoryId { get; set; }
        public string SubCategoryName { get; set; } = string.Empty;
        
        // Link to the root category
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        
        /// <summary>Number of products associated with this brand.</summary>
        public int ProductCount { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    /// <summary>Request DTO for creating a brand.</summary>
    public class CreateBrandDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int SubCategoryId { get; set; }
    }

    /// <summary>Request DTO for updating brand details.</summary>
    public class UpdateBrandDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int SubCategoryId { get; set; }
    }
}
