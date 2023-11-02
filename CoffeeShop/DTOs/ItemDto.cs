namespace CoffeeShop.DTOs;

public class ItemDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = "Item's name";
    // Images' paths are separated by space character
    public string ImageUrl { get; set; } = "Item's image url";
    public string Description { get; set; } = "Item's description";
    public decimal Price { get; set; }
}