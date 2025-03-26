namespace ContentManagementSystem.Dtos
{
    public class BasicBusenessDataDto
    {
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }

        public BasicBusenessDataDto(string name, string phoneNumber, string email)
        {
            Name = name;
            PhoneNumber = phoneNumber;
            Email = email;
        }
    }
}
