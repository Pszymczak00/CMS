using System.Collections.Generic;

namespace ContentManagementSystem.Dtos
{
    public class OrderAdminDto
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public int Kcal { get; set; }
        public string CateringName { get; set; }
        public int Price { get; set; }
        public List<OrderDayDto> OrderDays { get; set; }

        public OrderAdminDto(int id, string email, string name, string surname, string city,
            string address, int kcal, string cateringName, int price, List<OrderDayDto> orderDays)
        {
            Id = id;
            Email = email;
            Name = name;
            Surname = surname;
            City = city;
            Address = address;
            Kcal = kcal;
            CateringName = cateringName;
            Price = price;
            OrderDays = orderDays;
        }
    }
}

