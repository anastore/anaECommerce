using AnaECommerce.Backend.DTOs;
using AnaECommerce.Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace AnaECommerce.Backend.Controllers
{
    /// <summary>
    /// API Controller for user authentication and account registration.
    /// Handles JWT issuance and identity validation.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        /// <summary>Registers a new user account in the system.</summary>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            var (success, message) = await _authService.RegisterAsync(model);
            if (!success)
                return BadRequest(new { message });

            return Ok(new { message });
        }

        /// <summary>
        /// Authenticates a user and returns a JWT token if credentials are valid.
        /// Expected by the frontend to maintain session state.
        /// </summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            var (success, message, token) = await _authService.LoginAsync(model);
            if (!success)
                return Unauthorized(new { message });

            return Ok(new { token, message });
        }
    }
}
