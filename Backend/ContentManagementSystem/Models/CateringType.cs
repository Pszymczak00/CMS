namespace ContentManagementSystem.Models
{
    public class CateringType
    {
        public int Id { get; set; }

        public string CateringName { get; set; }

        public string Description { get; set; }    

        public ICollection<CateringPrice> Prices { get; set; }
    }
}
