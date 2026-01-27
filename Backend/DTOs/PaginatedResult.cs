namespace AnaECommerce.Backend.DTOs
{
    /// <summary>
    /// A generic wrapper for paginated API responses.
    /// Standardizes how list data and metadata (counts, pages) are delivered to the frontend.
    /// </summary>
    /// <typeparam name="T">The type of items in the list.</typeparam>
    public class PaginatedResult<T>
    {
        /// <summary>The collection of items for the current page.</summary>
        public IEnumerable<T> Items { get; set; } = new List<T>();
        
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        
        /// <summary>The total number of records available across all pages.</summary>
        public int TotalCount { get; set; }
        
        /// <summary>Calculated total number of pages based on TotalCount and PageSize.</summary>
        public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
        
        public bool HasPrevious => PageNumber > 1;
        public bool HasNext => PageNumber < TotalPages;
    }
}
