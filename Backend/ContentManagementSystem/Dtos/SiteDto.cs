namespace ContentManagementSystem.Dtos
{
    public class SiteDto
    {
        public string Name { get; set; }
        public string Text { get; set; }
        public int Priority { get; set; }

        public SiteDto(string name, string text, int priority)
        {
            Name = name;
            Text = text;
            Priority = priority;
        }
    }
}
