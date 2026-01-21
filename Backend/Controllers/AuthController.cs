using AnaECommerce.Backend.DTOs;
using AnaECommerce.Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace AnaECommerce.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            var (success, message) = await _authService.RegisterAsync(model);
            if (!success)
                return BadRequest(new { message });

            return Ok(new { message });
        }

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
