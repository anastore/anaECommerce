namespace AnaECommerce.Backend.DTOs
{
    /// <summary>Response DTO representing a top-level category.</summary>
    public class CategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        
        /// <summary>The count of sub-categories organized under this category.</summary>
        public int SubCategoryCount { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    /// <summary>Request DTO for category creation.</summary>
    public class CreateCategoryDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    /// <summary>Request DTO for updating category metadata.</summary>
    public class UpdateCategoryDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}
