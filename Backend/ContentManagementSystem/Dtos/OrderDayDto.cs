namespace ContentManagementSystem.Dtos
{
    public class OrderDayDto
    {
        public int Id { get; set; }
        public string Date { get; set; }
        public int? Rating { get; set; }
        public string Comment { get; set; }

        public OrderDayDto(int id, string date, int? rating, string comment)
        {
            Id = id;
            Date = date;
            Rating = rating;
            Comment = comment;
        }
    }
}

