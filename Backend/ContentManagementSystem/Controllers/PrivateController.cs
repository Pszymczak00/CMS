using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ContentManagementSystem.Data;
using ContentManagementSystem.Models;
using ContentManagementSystem.Dtos;
using Azure.Core;
using static NuGet.Packaging.PackagingConstants;
using Microsoft.AspNetCore.Authorization;

namespace ContentManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [Authorize(Roles = "admin")]
    [ApiController]
    public class PrivateController : ControllerBase
    {
        private readonly DataContext _context;

        public PrivateController(DataContext context)
        {
            _context = context;
        }

        [HttpGet(nameof(BusinessBasicData))]
        public ActionResult<BasicBusenessDataDto> BusinessBasicData()
        {
            var businessBasicData = _context.BusinessBasicData.First();

            if (businessBasicData == null)
            {
                return NotFound();
            }

            return Ok(new List<BasicBusenessDataDto>() { new BasicBusenessDataDto(businessBasicData.Name, businessBasicData.PhoneNumber, businessBasicData.Email) });
        }

        [HttpPost(nameof(BusinessBasicData))]
        public ActionResult<BasicBusenessDataDto> UpdateBusinessBasicData([FromBody] BasicBusenessDataDto updatedBusinessData)
        {
            if (updatedBusinessData == null)
            {
                return BadRequest("Invalid data.");
            }

            // Pobranie pierwszego wpisu w bazie danych (zakładamy, że chcesz edytować ten sam wpis)
            var businessBasicData = _context.BusinessBasicData.FirstOrDefault();

            if (businessBasicData == null)
            {
                return NotFound("Business data not found.");
            }

            // Aktualizacja danych
            businessBasicData.Name = updatedBusinessData.Name;
            businessBasicData.PhoneNumber = updatedBusinessData.PhoneNumber;
            businessBasicData.Email = updatedBusinessData.Email;

            // Zapisanie zmian w bazie danych
            _context.SaveChanges();

            // Zwrócenie zaktualizowanego obiektu
            return Ok(new BasicBusenessDataDto(businessBasicData.Name, businessBasicData.PhoneNumber, businessBasicData.Email));
        }

        [HttpGet(nameof(ClientOpinions))]
        public ActionResult<List<ClientOpinion>> ClientOpinions()
        {
            return _context.ClientOpinions.ToList();
        }

        [HttpPost(nameof(ClientOpinions))]
        public ActionResult ClientOpinions([FromBody] List<ClientOpinion> clientOpinions)
        {
            if (clientOpinions == null || clientOpinions.Count == 0)
            {
                return BadRequest("Lista opinii jest pusta.");
            }

            foreach (var opinion in clientOpinions)
            {
                var existingOpinion = _context.ClientOpinions.FirstOrDefault(c => c.Id == opinion.Id);
                if (existingOpinion != null)
                {
                    // Aktualizowanie pól
                    existingOpinion.Name = opinion.Name;
                    existingOpinion.DietName = opinion.DietName;
                    existingOpinion.Opinion = opinion.Opinion;
                }
                else
                {
                    return BadRequest($"Opinia z Id {opinion.Id} nie istnieje w bazie danych.");
                }
            }
            _context.SaveChanges();

            return Ok();
        }

        [HttpGet(nameof(Sites))]
        public ActionResult<List<Site>> Sites()
        {
            return _context.Sites.ToList();
        }

        [HttpPost(nameof(Sites))]
        public ActionResult Sites([FromBody] SitesPost sitesPost)
        {
            if (sitesPost.Sites == null || !sitesPost.Sites.Any())
            {
                return BadRequest("Lista stron jest pusta.");
            }

            foreach (var deletedSiteId in sitesPost.DeletedSites)
            {
                var deletedSite = _context.Sites.FirstOrDefault(s => s.Id == deletedSiteId);

                if (deletedSite != null)
                {
                    _context.Sites.Remove(deletedSite);
                }
            }

            foreach (var site in sitesPost.Sites)
            {
                var existingSite = _context.Sites.FirstOrDefault(s => s.Id == site.Id);
                if (existingSite != null)
                {
                    // Aktualizacja istniejącego rekordu
                    existingSite.Name = site.Name;
                    existingSite.Text = site.Text;
                    existingSite.Priority = site.Priority;
                }
                else
                {
                    // Dodanie nowego rekordu
                    _context.Sites.Add(new Models.Site
                    {
                        Name = site.Name,
                        Text = site.Text,
                        Priority = site.Priority
                    });
                }
            }

            // Zapisanie zmian w bazie danych
            _context.SaveChanges();

            return Ok();
        }

        [HttpGet(nameof(CateringTypes))]
        public ActionResult<List<CateringTypeGridDto>> CateringTypes()
        {
            return _context.CateringTypes.Select(ct => new CateringTypeGridDto(
                ct.Id,
                ct.CateringName,
                ct.Description,
                $"http://localhost:5001/CateringTypes/{ct.Id}.png"
                )).ToList();
        }

        [HttpPost(nameof(CateringTypes))]
        public ActionResult CateringTypes([FromBody] CateringTypesPost cateringTypesPost)
        {
            if (cateringTypesPost.CateringTypes == null || !cateringTypesPost.CateringTypes.Any())
            {
                return BadRequest("Lista typów cateringu jest pusta.");
            }

            foreach (var deletedCateringTypeId in cateringTypesPost.DeletedCateringTypes)
            {
                var deletedCateringType = _context.CateringTypes.FirstOrDefault(ct => ct.Id == deletedCateringTypeId);

                if (deletedCateringType != null)
                {
                    _context.CateringTypes.Remove(deletedCateringType);

                    var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot\\CateringTypes");

                    var filePath = Path.Combine(uploadPath, deletedCateringType.Id + ".png");

                    System.IO.File.Delete(filePath);
                }
            }

            foreach (var cateringType in cateringTypesPost.CateringTypes)
            {
                var existingCateringType = _context.CateringTypes.FirstOrDefault(ct => ct.Id == cateringType.Id);
                if (existingCateringType != null)
                {
                    // Aktualizacja istniejącego rekordu
                    existingCateringType.CateringName = cateringType.Name;
                    existingCateringType.Description = cateringType.Description;
                }
                else
                {
                    // Dodanie nowego rekordu
                    _context.CateringTypes.Add(new Models.CateringType
                    {
                        CateringName = cateringType.Name,
                        Description = cateringType.Description
                    });
                }
            }

            // Zapisanie zmian w bazie danych
            _context.SaveChanges();

            return Ok();
        }

        [HttpGet("CateringPrices/{cateringTypeId}")]
        public ActionResult<List<CateringPriceGridDto>> CateringPrices(int cateringTypeId)
        {
            return _context.CateringPrices.Where(x => x.CateringTypeId == cateringTypeId).Select(ct => new CateringPriceGridDto(
                ct.Id,
                ct.Kcal,
                ct.Price
                )).ToList();
        }

        [HttpPost("CateringPrices/{cateringTypeId}")]
        public ActionResult CateringPrices([FromBody] CateringPricesPost cateringPricesPost, int cateringTypeId)
        {
            if (cateringPricesPost.CateringPrices == null || !cateringPricesPost.CateringPrices.Any())
            {
                return BadRequest("Lista cen cateringu jest pusta.");
            }

            foreach (var deletedCateringTypeId in cateringPricesPost.DeletedCateringPrices)
            {
                var deletedCateringType = _context.CateringPrices.FirstOrDefault(ct => ct.Id == deletedCateringTypeId);

                if (deletedCateringType != null)
                {
                    _context.CateringPrices.Remove(deletedCateringType);
                }
            }

            foreach (var cateringType in cateringPricesPost.CateringPrices)
            {
                var existingCateringType = _context.CateringPrices.FirstOrDefault(ct => ct.Id == cateringType.Id);
                if (existingCateringType != null)
                {
                    // Aktualizacja istniejącego rekordu
                    existingCateringType.Price = cateringType.Price;
                    existingCateringType.Kcal = cateringType.Kcal;
                }
                else
                {
                    // Dodanie nowego rekordu
                    _context.CateringPrices.Add(new Models.CateringPrice
                    {
                        CateringTypeId = cateringTypeId,
                        Price = cateringType.Price,
                        Kcal = cateringType.Kcal
                    });
                }
            }

            // Zapisanie zmian w bazie danych
            _context.SaveChanges();

            return Ok();
        }

        [HttpGet(nameof(Orders))]
        public ActionResult<List<OrderAdminDto>> Orders()
        {
            var orders = _context.Orders
                .Include(o => o.Client)
                .Include(o => o.OrderDays)
                .Select(o => new OrderAdminDto(
                    o.Id,
                    o.ClientId,
                    o.Client.Email,
                    o.Client.Name,
                    o.Client.Surname,
                    o.Client.City,
                    o.Client.Address,
                    o.Kcal,
                    o.CateringName,
                    o.Price,
                    o.OrderDays
                        .OrderBy(od => od.Date)
                        .Select(od => new OrderDayDto(od.Id, od.Date.ToString("yyyy-MM-dd"), od.Rating, od.Comment))
                        .ToList()
                ))
                .ToList();

            return orders;
        }

        [HttpGet(nameof(ContactForms))]
        public ActionResult<List<ContactForm>> ContactForms()
        {
            return _context.ContactForms.ToList();
        }

        [HttpPost("Upload/{fileName}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadFile(IFormFile file, string fileName)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("Nie przesłano pliku.");
            }

            if (!file.ContentType.Equals("image/png", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("Obsługiwane są tylko pliki PNG.");
            }

            var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "CateringTypes");

            var filePath = Path.Combine(uploadPath, fileName + ".png");

            try
            {
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                return Ok(new { Message = "Plik został przesłany pomyślnie.", FileName = fileName });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Wystąpił błąd podczas przesyłania pliku: {ex.Message}");
            }
        }
    }

    public class SitesPost
    {
        public List<Site> Sites { get; set; }
        public List<int> DeletedSites { get; set; }
    }

    public class CateringTypesPost
    {
        public List<CateringTypeGridDto> CateringTypes { get; set; }
        public List<int> DeletedCateringTypes { get; set; }
    }

    public class CateringPricesPost
    {
        public List<CateringPriceGridDto> CateringPrices { get; set; }
        public List<int> DeletedCateringPrices { get; set; }
    }
}
