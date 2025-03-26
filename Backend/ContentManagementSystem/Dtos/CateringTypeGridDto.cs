namespace ContentManagementSystem.Dtos
{
    public class CateringTypeGridDto
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public string Description { get; set; }

        public string Url { get; set; }

        public CateringTypeGridDto(int id, string name, string description, string url)
        {
            Id = id;
            Name = name;
            Description = description;
            Url = url;
        }
    }
}
