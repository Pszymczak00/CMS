using ContentManagementSystem.Data;
using ContentManagementSystem.Dtos;
using ContentManagementSystem.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;

namespace ContentManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly JwtService _jwtService;
        private readonly DataContext _dataContext;

        public AuthController(JwtService jwtService, DataContext dataContext)
        {
            _jwtService = jwtService;
            _dataContext = dataContext;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] UserLoginDataDto request)
        {
            var user = _dataContext.Users.Where(x =>  x.Username == request.Username).First();
            
            if (VerifyPassword(user.Password, request.Password))
            {
                var token = _jwtService.GenerateToken("1", request.Username);
                return Ok(new { Token = token });
            }

            return Unauthorized();
        }

        [HttpPost("ChangePassword")]
        [Authorize]
        public void ChangePassword([FromBody] ChangePassword password)
        {
            var user = _dataContext.Users.First();

            user.Password = HashPassword(password.Password);

            _dataContext.SaveChanges();
        }


        private readonly PasswordHasher<string> _passwordHasher = new PasswordHasher<string>();

        private string HashPassword([FromBody] string password)
        {
            return _passwordHasher.HashPassword(null, password);
        }

        public bool VerifyPassword(string hashedPassword, string password)
        {
            var result = _passwordHasher.VerifyHashedPassword(null, hashedPassword, password);
            return result == PasswordVerificationResult.Success;
        }
    }

    public class ChangePassword
    {
        public string Password { get; set; }
    }
}

