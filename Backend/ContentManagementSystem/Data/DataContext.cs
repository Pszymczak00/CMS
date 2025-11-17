using Azure.Core;
using ContentManagementSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace ContentManagementSystem.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
           
        }

        public DbSet<User> Users { get; set; }
        public DbSet<BusinessBasicData> BusinessBasicData { get; set; } 
        public DbSet<ClientOpinion> ClientOpinions { get; set; }
        public DbSet<CateringType> CateringTypes { get; set; }
        public DbSet<CateringPrice> CateringPrices { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDay> OrderDays { get; set; }

        public DbSet<Site> Sites { get; set; }
        public DbSet<ContactForm> ContactForms { get; set; }
    }
}
