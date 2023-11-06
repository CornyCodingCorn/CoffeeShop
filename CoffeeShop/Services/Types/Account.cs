using CoffeeShop.DTOs;

namespace CoffeeShop.Services.Types;

public class Account
{
    public string Username { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string? LastName { get; set; }
    public Address Address { get; set; }
    public string ProfileUrl { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public DateOnly BirthDay { get; set; }
    public int Point { get; set; }

    public Account(AccountDto dto)
    {
        Username = dto.Username;
        FirstName = dto.FirstName;
        LastName = dto.LastName;
        Address = new Address(dto.Address);
        ProfileUrl = dto.ProfileUrl;
        PhoneNumber = dto.PhoneNumber;
        BirthDay = DateOnly.FromDayNumber(dto.BirthDay);
        Point = dto.Point;
    }
}