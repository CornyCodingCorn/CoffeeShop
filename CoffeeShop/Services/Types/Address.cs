using CoffeeShop.DTOs;

namespace CoffeeShop.Services.Types;

public struct Address
{
    public string City { get; set; }
    public string District { get; set; }
    public string Ward { get; set; }
    public string Street { get; set; }
    public string Number { get; set; }

    public Address(AddressDto dto)
    {
        City = dto.City;
        District = dto.District;
        Ward = dto.Ward;
        Street = dto.Street;
        Number = dto.Number;
    }

    public override string ToString()
    {
        return $"{Number} {Street} {Ward} {District} {City}";
    }
}