﻿using System;
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

namespace ContentManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PublicController : ControllerBase
    {
        private readonly DataContext _context;

        public PublicController(DataContext context)
        {
            _context = context;
        }

        [HttpGet("Ping")]
        public ActionResult<string> Ping()
        {
            return "Ping";
        }

        [HttpGet(nameof(BusinessBasicData))]
        public ActionResult<BasicBusenessDataDto> BusinessBasicData()
        {
           var businessBasicData = _context.BusinessBasicData.First();

            if (businessBasicData == null)
            {
                return NotFound();
            }

            return Ok(new BasicBusenessDataDto(businessBasicData.Name, businessBasicData.PhoneNumber, businessBasicData.Email));
        }

        [HttpGet(nameof(ClientOpinions))]
        public ActionResult<ClientOpinionDto> ClientOpinions()
        {
            var clientOpinions = _context.ClientOpinions.Take(3).Select(x => new ClientOpinionDto(x.Name, x.DietName, x.Opinion)).ToList();

            if (clientOpinions.Count == 0)
            {
                return NotFound();
            }

            return Ok(clientOpinions);
        }


        [HttpGet(nameof(CateringTypes))]
        public ActionResult<CateringTypeDto> CateringTypes()
        {
            var cateringType = _context.CateringTypes.Select(x => new CateringTypeDto(x.CateringName, x.Description, $"http://localhost:5001/CateringTypes/{x.Id}.png")).ToList();

            if (cateringType.Count == 0)
            {
                return NotFound();
            }

            return Ok(cateringType);
        }

        [HttpGet(nameof(Sites))]
        public ActionResult<CateringTypeDto> Sites()
        {
            var sites = _context.Sites.Select(x => new SiteDto(x.Name, x.Text, x.Priority)).ToList().OrderBy(x => x.Priority);

            return Ok(sites);
        }

        [HttpGet(nameof(CateringTypes) + "/{cateringName}/" + nameof(CateringPrices) )]
        public ActionResult<CateringPriceDto> CateringPrices(string cateringName)
        {
            var cateringPrices = _context.CateringTypes.Include(x => x.Prices)
                .Where(x => x.CateringName == cateringName).First().Prices
                .Select(x => new CateringPriceDto(x.Kcal, x.Price)).ToList();

            if(cateringPrices.Count == 0)
                return NotFound();

            return Ok(cateringPrices);
        }

        [HttpPost(nameof(CreateOrder))]
        public async Task<ActionResult<Order>> CreateOrder(OrderDto orderDto)
        {
            var cateringTypes = _context.CateringTypes.Where(x => x.CateringName == orderDto.CateringName).ToList();

            if(cateringTypes.Count == 0) 
                return NotFound("Nie znaleziono takiego typu diety");

            var order = new Order()
            {
                Email = orderDto.Email,
                Name = orderDto.Name,
                Surname = orderDto.Surname,
                DateStart = orderDto.DateStart,
                DateEnd = orderDto.DateEnd,
                City = orderDto.City,
                Address = orderDto.Address,
                CateringName = orderDto.CateringName,
                Kcal = orderDto.Kcal,
                Price = orderDto.Price
            };

            _context.Orders.Add(order);
            _context.SaveChanges();

            return Ok();
        }
    }
}
