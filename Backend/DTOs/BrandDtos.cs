namespace AnaECommerce.Backend.DTOs
{
    public class BrandDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int SubCategoryId { get; set; }
        public string SubCategoryName { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public int ProductCount { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateBrandDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int SubCategoryId { get; set; }
    }

    public class UpdateBrandDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int SubCategoryId { get; set; }
    }
}
