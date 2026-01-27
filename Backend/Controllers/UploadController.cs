using Microsoft.AspNetCore.Mvc;
using System.IO;
using Microsoft.AspNetCore.Authorization;

namespace AnaECommerce.Backend.Controllers
{
    /// <summary>
    /// Utility API Controller for handling generic file and image uploads.
    /// Provides validation for allowed file extensions and manages server-side storage.
    /// </summary>
    [ApiController]
    [Route("api/upload")]
    public class UploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<UploadController> _logger;

        public UploadController(IWebHostEnvironment environment, ILogger<UploadController> logger)
        {
            _environment = environment;
            _logger = logger;
        }

        /// <summary>Uploads an image (PNG/JPG/WEBP) for user profiles or other entities.</summary>
        [HttpPost("image")]
        [AllowAnonymous]
        public async Task<ActionResult> UploadImage([FromForm] IFormFile file)
        {
            try 
            {
                _logger.LogInformation("Received upload request. File exists: {Exists}, Length: {Length}", file != null, file?.Length ?? 0);

                if (file == null || file.Length == 0)
                {
                    _logger.LogWarning("Upload attempt with null or empty file.");
                    return BadRequest(new { message = "No file uploaded" });
                }

                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

                if (!allowedExtensions.Contains(extension))
                {
                    _logger.LogWarning("Invalid file extension: {Extension}", extension);
                    return BadRequest(new { message = "Invalid file type. Only images are allowed." });
                }

                // Reliability check for environment pathing
                if (string.IsNullOrEmpty(_environment.WebRootPath))
                {
                    _logger.LogInformation("WebRootPath is null, using fallback.");
                    _environment.WebRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                }

                var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads", "profile");
                
                // Safety: Create physical folder if it doesn't exist
                if (!Directory.Exists(uploadsFolder))
                {
                    _logger.LogInformation("Creating directory: {Path}", uploadsFolder);
                    Directory.CreateDirectory(uploadsFolder);
                }

                // Collision prevention: Generate unique Guid-based filename
                var fileName = $"{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                _logger.LogInformation("Saving file to: {Path}", filePath);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var imageUrl = $"/uploads/profile/{fileName}";
                _logger.LogInformation("Upload successful. Image URL: {Url}", imageUrl);
                
                return Ok(new { imageUrl });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Internal error during file upload.");
                return StatusCode(500, new { message = "Internal server error during upload", details = ex.Message });
            }
        }
    }
}
