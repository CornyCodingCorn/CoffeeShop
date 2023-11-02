using CoffeeShop.DTOs;

namespace CoffeeShop.Services.Types;

public class MenuItem
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string[] ImageUrls { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    
    public MenuItem(ItemDto dto)
    {
        // Split of a single string into multiple url
        (Id, Name, ImageUrls, Price, Description) = (dto.Id, dto.Name, dto.ImageUrl.Split(" "), dto.Price, dto.Description);
    }
}