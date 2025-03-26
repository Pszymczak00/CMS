namespace ContentManagementSystem.Dtos
{
    public class ClientOpinionDto
    {
        public string Name { get; set; }
        public string DietName { get; set; }
        public string Opinion { get; set; }

        public ClientOpinionDto(string name, string dietName, string opinion)
        {
            Name = name;
            DietName = dietName;
            Opinion = opinion;
        }
    }
}
