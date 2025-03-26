namespace ContentManagementSystem.Models
{
    public class Order
    {
        public int Id { get; set; }

        public string Email { get; set; }

        public string Name { get; set; }

        public string Surname { get; set; }

        public DateOnly DateStart { get; set; }

        public DateOnly DateEnd { get; set; }

        public string City { get; set; }

        public string Address { get; set; }

        public string CateringName { get; set; }

        public int Kcal {  get; set; }

        public int Price { get; set; }
    }
}
