namespace ContentManagementSystem.Dtos
{
    public class OrderDayDto
    {
        public int Id { get; set; }
        public string Date { get; set; }

        public OrderDayDto(int id, string date)
        {
            Id = id;
            Date = date;
        }
    }
}

