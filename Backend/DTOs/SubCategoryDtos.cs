namespace AnaECommerce.Backend.DTOs
{
    /// <summary>Response DTO for sub-categories, providing root category context.</summary>
    public class SubCategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        
        /// <summary>Link back to the parent Category.</summary>
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        
        /// <summary>The count of brands clasified under this sub-category.</summary>
        public int BrandCount { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    /// <summary>Request DTO for creating a sub-category.</summary>
    public class CreateSubCategoryDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int CategoryId { get; set; }
    }

    /// <summary>Request DTO for updating sub-category links or details.</summary>
    public class UpdateSubCategoryDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int CategoryId { get; set; }
    }
}
