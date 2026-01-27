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

        public UploadController(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        /// <summary>Uploads an image (PNG/JPG/WEBP) for user profiles or other entities.</summary>
        [HttpPost("image")]
        [AllowAnonymous]
        public async Task<ActionResult> UploadImage(IFormFile file)
        {
            try 
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest(new { message = "No file uploaded" });
                }

                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

                if (!allowedExtensions.Contains(extension))
                {
                    return BadRequest(new { message = "Invalid file type. Only images are allowed." });
                }

                // Reliability check for environment pathing
                if (string.IsNullOrEmpty(_environment.WebRootPath))
                {
                    _environment.WebRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                }

                var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads", "profile");
                
                // Safety: Create physical folder if it doesn't exist
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // Collision prevention: Generate unique Guid-based filename
                var fileName = $"{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var imageUrl = $"/uploads/profile/{fileName}";
                return Ok(new { imageUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error during upload", details = ex.Message });
            }
        }
    }
}
