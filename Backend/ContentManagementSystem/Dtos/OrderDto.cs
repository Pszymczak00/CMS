namespace ContentManagementSystem.Dtos
{
    public class OrderDto
    {
        public string Email { get; set; }

        public string Name { get; set; }

        public string Surname { get; set; }

        public DateOnly DateStart { get; set; }

        public DateOnly DateEnd { get; set; }

        public string City { get; set; }

        public string Address { get; set; }

        public string CateringName { get; set; }

        public int Kcal { get; set; }

        public int Price { get; set; }

        public OrderDto(string email, string name, string surname, DateOnly dateStart, DateOnly dateEnd, string city, string address, int kcal, string cateringName)
        {
            Email = email;
            Name = name;
            Surname = surname;
            DateStart = dateStart;
            DateEnd = dateEnd;
            City = city;
            Address = address;
            Kcal = kcal;
            CateringName = cateringName;
        }
    }
}
