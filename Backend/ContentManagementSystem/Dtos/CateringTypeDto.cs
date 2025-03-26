namespace ContentManagementSystem.Dtos
{
    public class CateringTypeDto
    {
        public string Name { get; set; }

        public string Description { get; set; }

        public string Url { get; set; }

        public CateringTypeDto(string name, string description, string url)
        {
            Name = name;
            Description = description;
            Url = url;
        }
    }
}
