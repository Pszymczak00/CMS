using System.Collections.Generic;

namespace ContentManagementSystem.Dtos
{
    public class ClientOrderDto
    {
        public int Id { get; set; }
        public string CateringName { get; set; }
        public int Kcal { get; set; }
        public int Price { get; set; }
        public List<OrderDayDto> OrderDays { get; set; }

        public ClientOrderDto(int id, string cateringName, int kcal, int price, List<OrderDayDto> orderDays)
        {
            Id = id;
            CateringName = cateringName;
            Kcal = kcal;
            Price = price;
            OrderDays = orderDays;
        }
    }
}

