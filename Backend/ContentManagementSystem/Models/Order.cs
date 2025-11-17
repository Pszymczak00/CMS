using System.Collections.Generic;

namespace ContentManagementSystem.Models
{
    public class Order
    {
        public int Id { get; set; }

        public int ClientId { get; set; }

        public Client Client { get; set; }

        public string CateringName { get; set; }

        public int Kcal {  get; set; }

        public int Price { get; set; }

        public ICollection<OrderDay> OrderDays { get; set; } = new List<OrderDay>();
    }
}
