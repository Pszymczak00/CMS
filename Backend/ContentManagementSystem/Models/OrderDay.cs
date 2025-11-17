using System;

namespace ContentManagementSystem.Models
{
    public class OrderDay
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public Order Order { get; set; }
        public DateOnly Date { get; set; }
        public int? Rating { get; set; }
        public string Comment { get; set; }
    }
}

