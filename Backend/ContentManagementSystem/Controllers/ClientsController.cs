using ContentManagementSystem.Data;
using ContentManagementSystem.Dtos;
using ContentManagementSystem.Models;
using ContentManagementSystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ContentManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientsController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly JwtService _jwtService;
        private readonly PasswordHasher<Client> _passwordHasher = new PasswordHasher<Client>();

        public ClientsController(DataContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] ClientRegisterDto dto)
        {
            if (dto == null)
            {
                return BadRequest();
            }

            var normalizedEmail = dto.Email?.Trim().ToLowerInvariant();
            var name = dto.Name?.Trim();
            var surname = dto.Surname?.Trim();
            var city = dto.City?.Trim();
            var address = dto.Address?.Trim();

            if (string.IsNullOrWhiteSpace(normalizedEmail) ||
                string.IsNullOrWhiteSpace(dto.Password) ||
                string.IsNullOrWhiteSpace(name) ||
                string.IsNullOrWhiteSpace(surname) ||
                string.IsNullOrWhiteSpace(city) ||
                string.IsNullOrWhiteSpace(address))
            {
                return BadRequest("Wszystkie pola są wymagane.");
            }

            var exists = await _context.Clients.AnyAsync(c => c.Email == normalizedEmail);
            if (exists)
            {
                return Conflict("Klient z tym adresem e-mail już istnieje.");
            }

            var client = new Client
            {
                Email = normalizedEmail,
                Name = name,
                Surname = surname,
                City = city,
                Address = address,
                PasswordHash = string.Empty
            };

            client.PasswordHash = _passwordHasher.HashPassword(client, dto.Password);

            _context.Clients.Add(client);
            await _context.SaveChangesAsync();

            var token = _jwtService.GenerateToken(client.Id.ToString(), client.Email, "client");
            return Ok(new { token });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] ClientLoginDto dto)
        {
            if (dto == null)
            {
                return BadRequest();
            }

            var normalizedEmail = dto.Email?.Trim().ToLowerInvariant();

            var client = await _context.Clients.FirstOrDefaultAsync(c => c.Email == normalizedEmail);

            if (client == null)
            {
                return Unauthorized("Nieprawidłowy email lub hasło.");
            }

            var verification = _passwordHasher.VerifyHashedPassword(client, client.PasswordHash, dto.Password);
            if (verification == PasswordVerificationResult.Failed)
            {
                return Unauthorized("Nieprawidłowy email lub hasło.");
            }

            var token = _jwtService.GenerateToken(client.Id.ToString(), client.Email, "client");
            return Ok(new { token });
        }

        [Authorize(Roles = "client")]
        [HttpGet("me")]
        public async Task<ActionResult<ClientProfileDto>> Me()
        {
            var clientIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(clientIdClaim) || !int.TryParse(clientIdClaim, out var clientId))
            {
                return Unauthorized();
            }

            var client = await _context.Clients.FirstOrDefaultAsync(c => c.Id == clientId);

            if (client == null)
            {
                return Unauthorized();
            }

            return new ClientProfileDto
            {
                Id = client.Id,
                Email = client.Email,
                Name = client.Name,
                Surname = client.Surname,
                City = client.City,
                Address = client.Address
            };
        }

        [Authorize(Roles = "client")]
        [HttpGet("orders")]
        public async Task<ActionResult<List<ClientOrderDto>>> GetOrders()
        {
            var clientIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(clientIdClaim) || !int.TryParse(clientIdClaim, out var clientId))
            {
                return Unauthorized();
            }

            var orders = await _context.Orders
                .Where(o => o.ClientId == clientId)
                .Include(o => o.OrderDays)
                .OrderByDescending(o => o.Id)
                .Select(o => new ClientOrderDto(
                    o.Id,
                    o.CateringName,
                    o.Kcal,
                    o.Price,
                    o.OrderDays
                        .OrderBy(od => od.Date)
                        .Select(od => new OrderDayDto(od.Id, od.Date.ToString("yyyy-MM-dd"), od.Rating, od.Comment))
                        .ToList()
                ))
                .ToListAsync();

            return orders;
        }

        [Authorize(Roles = "client")]
        [HttpPost("orders/rate")]
        public async Task<IActionResult> RateOrderDay([FromBody] OrderDayRatingDto dto)
        {
            var clientIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(clientIdClaim) || !int.TryParse(clientIdClaim, out var clientId))
            {
                return Unauthorized();
            }

            if (dto.Rating < 1 || dto.Rating > 5)
            {
                return BadRequest("Ocena musi być między 1 a 5.");
            }

            var orderDay = await _context.OrderDays
                .Include(od => od.Order)
                .FirstOrDefaultAsync(od => od.Id == dto.OrderDayId);

            if (orderDay == null)
            {
                return NotFound("Nie znaleziono dnia zamówienia.");
            }

            if (orderDay.Order.ClientId != clientId)
            {
                return Unauthorized("Nie masz uprawnień do oceniania tego zamówienia.");
            }

            var today = DateOnly.FromDateTime(DateTime.Today);
            if (orderDay.Date > today)
            {
                return BadRequest("Możesz ocenić tylko zamówienia z dzisiaj lub starsze.");
            }

            orderDay.Rating = dto.Rating;
            orderDay.Comment = dto.Comment?.Trim();

            await _context.SaveChangesAsync();

            return Ok();
        }

        [Authorize(Roles = "client")]
        [HttpPost("orders/days/add")]
        public async Task<IActionResult> AddOrderDay([FromBody] OrderDayModifyDto dto)
        {
            var clientIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(clientIdClaim) || !int.TryParse(clientIdClaim, out var clientId))
            {
                return Unauthorized();
            }

            var order = await _context.Orders
                .Include(o => o.OrderDays)
                .FirstOrDefaultAsync(o => o.Id == dto.OrderId);

            if (order == null)
            {
                return NotFound("Nie znaleziono zamówienia.");
            }

            if (order.ClientId != clientId)
            {
                return Unauthorized("Nie masz uprawnień do modyfikacji tego zamówienia.");
            }

            var today = DateOnly.FromDateTime(DateTime.Today);
            var tomorrow = today.AddDays(1); // Min jutro
            var maxDate = today.AddDays(365); // Max rok do przodu

            if (dto.Date < tomorrow)
            {
                return BadRequest("Możesz dodawać tylko dni od jutra.");
            }

            if (dto.Date > maxDate)
            {
                return BadRequest("Nie możesz dodawać dni więcej niż rok do przodu.");
            }

            // Check if day already exists
            if (order.OrderDays.Any(od => od.Date == dto.Date))
            {
                return BadRequest("Ten dzień już istnieje w zamówieniu.");
            }

            // Get price per day from CateringType
            var cateringType = await _context.CateringTypes
                .Include(ct => ct.Prices)
                .FirstOrDefaultAsync(ct => ct.CateringName == order.CateringName);

            if (cateringType == null)
            {
                return NotFound("Nie znaleziono typu diety.");
            }

            var pricePerDay = cateringType.Prices
                .FirstOrDefault(p => p.Kcal == order.Kcal);

            if (pricePerDay == null)
            {
                return NotFound("Nie znaleziono ceny dla tej liczby kalorii.");
            }

            // Add new order day
            var newOrderDay = new OrderDay
            {
                OrderId = order.Id,
                Order = order,
                Date = dto.Date
            };

            order.OrderDays.Add(newOrderDay);
            
            // Update order price
            order.Price = (int)(order.OrderDays.Count * pricePerDay.Price);

            await _context.SaveChangesAsync();

            return Ok();
        }

        [Authorize(Roles = "client")]
        [HttpPost("orders/days/remove")]
        public async Task<IActionResult> RemoveOrderDay([FromBody] OrderDayModifyDto dto)
        {
            var clientIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(clientIdClaim) || !int.TryParse(clientIdClaim, out var clientId))
            {
                return Unauthorized();
            }

            var order = await _context.Orders
                .Include(o => o.OrderDays)
                .FirstOrDefaultAsync(o => o.Id == dto.OrderId);

            if (order == null)
            {
                return NotFound("Nie znaleziono zamówienia.");
            }

            if (order.ClientId != clientId)
            {
                return Unauthorized("Nie masz uprawnień do modyfikacji tego zamówienia.");
            }

            var today = DateOnly.FromDateTime(DateTime.Today);
            var tomorrow = today.AddDays(1); // Min jutro
            var maxDate = today.AddDays(365); // Max rok do przodu

            if (dto.Date < tomorrow)
            {
                return BadRequest("Możesz usuwać tylko dni od jutra.");
            }

            if (dto.Date > maxDate)
            {
                return BadRequest("Możesz usuwać tylko dni do roku w przyszłość.");
            }

            // Find and remove order day
            var orderDay = order.OrderDays.FirstOrDefault(od => od.Date == dto.Date);

            if (orderDay == null)
            {
                return NotFound("Ten dzień nie istnieje w zamówieniu.");
            }

            // Get price per day from CateringType
            var cateringType = await _context.CateringTypes
                .Include(ct => ct.Prices)
                .FirstOrDefaultAsync(ct => ct.CateringName == order.CateringName);

            if (cateringType == null)
            {
                return NotFound("Nie znaleziono typu diety.");
            }

            var pricePerDay = cateringType.Prices
                .FirstOrDefault(p => p.Kcal == order.Kcal);

            if (pricePerDay == null)
            {
                return NotFound("Nie znaleziono ceny dla tej liczby kalorii.");
            }

            // Remove order day
            _context.OrderDays.Remove(orderDay);
            
            // Update order price
            order.Price = (int)(order.OrderDays.Count * pricePerDay.Price);

            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}

