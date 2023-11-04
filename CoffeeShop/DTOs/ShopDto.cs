using CoffeeShop.Utilities;

namespace CoffeeShop.DTOs;

public class ShopDto
{
    public string Name { get; set; } = "Shop's name";
    public AddressDto Address { get; set; } = new AddressDto();
    // Use all 4 digits to represent time;
    public short OpenHour { get; set; } = 700;
    public short ClosingHour { get; set; } = 2300;
    // Features set in binary 
    public short Features { get; set; } = 0x1011;
}