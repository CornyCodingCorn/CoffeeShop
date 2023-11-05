using CoffeeShop.Services.Types;

namespace CoffeeShop.Services.Interfaces;

public interface IShopService
{
    public Task<IEnumerable<ShopInfo>> LoadShops();
    public Task<IEnumerable<ShopInfo>> LoadShops(string city);
    public Task<IEnumerable<ShopInfo>> LoadShops(string city, string district);
    public Task<Dictionary<string, string[]>> GetCities();
}