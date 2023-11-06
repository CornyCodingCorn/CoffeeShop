namespace CoffeeShop.DTOs;

public class AccountDto
{
    public string Username { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string? LastName { get; set; }
    public AddressDto Address { get; set; }
    public string ProfileUrl { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public int BirthDay { get; set; }
    public int Point { get; set; }
}