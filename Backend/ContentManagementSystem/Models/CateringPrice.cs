using System.ComponentModel.DataAnnotations.Schema;

namespace ContentManagementSystem.Models
{
    public class CateringPrice
    {
        public int Id { get; set; }

        public int CateringTypeId { get; set; }

        public CateringType CateringType { get; set; }

        public int Kcal { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
    }
}
