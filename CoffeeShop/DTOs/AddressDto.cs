namespace CoffeeShop.DTOs;

public class AddressDto
{
    public string City { get; set; } = "A city name";
    public string District { get; set; } = "A district name";
    public string Ward { get; set; } = "Ward's name";
    public string Street { get; set; } = "Street's name";
    public string Number { get; set; } = "Building's number";
}