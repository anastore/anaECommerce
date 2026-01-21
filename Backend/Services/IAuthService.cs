using AnaECommerce.Backend.DTOs;

namespace AnaECommerce.Backend.Services
{
    public interface IAuthService
    {
        Task<(bool Success, string Message)> RegisterAsync(RegisterDto model);
        Task<(bool Success, string Message, string Token)> LoginAsync(LoginDto model);
    }
}
