using System.Collections.Generic;

namespace ContentManagementSystem.Dtos
{
    public class OrderDto
    {
        public List<DateOnly> Dates { get; set; }

        public string CateringName { get; set; }

        public int Kcal { get; set; }

        public int Price { get; set; }
    }
}
