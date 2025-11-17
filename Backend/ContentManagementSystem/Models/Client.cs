using System.Collections.Generic;

namespace ContentManagementSystem.Models
{
    public class Client
    {
        public int Id { get; set; }

        public string Email { get; set; }

        public string PasswordHash { get; set; }

        public string Name { get; set; }

        public string Surname { get; set; }

        public string City { get; set; }

        public string Address { get; set; }

        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}

