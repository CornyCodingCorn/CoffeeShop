namespace CoffeeShop.DTOs;

public class ItemDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = "Item's name";
    public string ImageUrl { get; set; } = "Item's image url";
    public decimal Price { get; set; }
}