using CoffeeShop.Services.Types;

namespace CoffeeShop.Services.Interfaces;

public interface IMenuService
{
    public Task<IEnumerable<MenuCategory>> LoadCategories();
    public Task<IEnumerable<MenuItem>> LoadItems(MenuCategory category);
}