using System.Collections.Generic;

namespace ContentManagementSystem.Dtos
{
    public class OrderDto
    {
        public string Email { get; set; }

        public string Name { get; set; }

        public string Surname { get; set; }

        public List<DateOnly> Dates { get; set; }

        public string City { get; set; }

        public string Address { get; set; }

        public string CateringName { get; set; }

        public int Kcal { get; set; }

        public int Price { get; set; }
    }
}
