using System.ComponentModel.DataAnnotations.Schema;

namespace ContentManagementSystem.Dtos
{
    public class CateringPriceDto
    {
        public int Kcal { get; set; }
        public decimal Price { get; set; }

        public CateringPriceDto(int kcal, decimal price)
        {
            Kcal = kcal;
            Price = price;
        }
    }
}
