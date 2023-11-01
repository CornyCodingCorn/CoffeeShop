using CoffeeShop.DTOs;

namespace CoffeeShop.Services.Types;

public class MenuCategory
{
    public Guid Id { get; init; }
    public string Name { get; init; }
    public List<MenuItem> Items { get; set; } = new();
    
    public MenuCategory(CategoryDto dto)
    {
        (Id, Name) = (dto.Id, dto.Name);
    }
}