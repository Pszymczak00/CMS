using System.ComponentModel.DataAnnotations.Schema;

namespace ContentManagementSystem.Dtos
{
    public class CateringPriceGridDto
    {
        public int Id { get; set; }
        public int Kcal { get; set; }
        public decimal Price { get; set; }

        public CateringPriceGridDto(int id, int kcal, decimal price)
        {
            Id = id;
            Kcal = kcal;
            Price = price;
        }
    }
}
