using CoffeeShop.DTOs;

namespace CoffeeShop.Services.Types;

public class MenuItem
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string ImageUrl { get; set; }
    public decimal Price { get; set; }
    
    public MenuItem(ItemDto dto)
    {
        (Id, Name, ImageUrl, Price) = (dto.Id, dto.Name, dto.ImageUrl, dto.Price);
    }
}