using CoffeeShop.DTOs;
using CoffeeShop.Services.Interfaces;
using CoffeeShop.Services.Types;

namespace CoffeeShop.Services.Implementations;

public class MenuService : IMenuService
{
    private CategoryDto[] _cachedCategories = new[]
    {
        new CategoryDto
        {
            Id = Guid.NewGuid(),
            Name = "Vietnamese Coffees"
        },
        new CategoryDto
        {
            Id = Guid.NewGuid(),
            Name = "Italian Coffees"
        },
        new CategoryDto
        {
            Id = Guid.NewGuid(),
            Name = "Smoothies"
        },
        new CategoryDto
        {
            Id = Guid.NewGuid(),
            Name = "Cakes"
        },
    };

    private ItemDto[] _cachedItems = new[]
    {
        new ItemDto
        {
            Name = "Café au lait",
            Price = 20,
            Description = _itemDes,
            ImageUrl =
                "http://clipart-library.com/images/pc7r5rbLi.jpg https://empire-s3-production.bobvila.com/articles/wp-content/uploads/2020/08/best_coffee_mug.jpg https://media.istockphoto.com/photos/cup-of-coffee-picture-id517151571?k=6&m=517151571&s=612x612&w=0&h=pm2doj5opQSCG7vGpddVPQopuhcHlpoY2rahSDsQpPg="
        },
        new ItemDto
        {
            Name = "Black coffee",
            Price = 20,
            Description = _itemDes,
            ImageUrl =
                "https://empire-s3-production.bobvila.com/articles/wp-content/uploads/2020/08/best_coffee_mug.jpg https://trircoffee.com/images/homebottom/4.jpg"
        },
        new ItemDto
        {
            Name = "Café con leche",
            Price = 20,
            Description = _itemDes,
            ImageUrl =
                "https://trircoffee.com/images/homebottom/4.jpg https://wgntv.com/wp-content/uploads/sites/5/2016/09/thinkstockphotos-521696656-e1475156855762.jpg?w=900"
        },
        new ItemDto
        {
            Name = "Flat White",
            Price = 20,
            Description = _itemDes,
            ImageUrl =
                "https://wgntv.com/wp-content/uploads/sites/5/2016/09/thinkstockphotos-521696656-e1475156855762.jpg?w=900 https://www.hdwallpaper.nu/wp-content/uploads/2017/03/coffee-7.jpg"
        },
        new ItemDto
        {
            Name = "Latte Macchiato",
            Price = 20,
            Description = _itemDes,
            ImageUrl =
                "https://www.hdwallpaper.nu/wp-content/uploads/2017/03/coffee-7.jpg https://sundun.com/images/single2.jpg"
        },
        new ItemDto
        {
            Name = "Vienna Coffee",
            Price = 20,
            Description = _itemDes,
            ImageUrl =
                "https://sundun.com/images/single2.jpg https://johnthebodyman.com/wp-content/uploads/2014/05/Bodyman-coffee-in-cup-1024x1024.jpg https://media.istockphoto.com/photos/cup-of-coffee-picture-id517151571?k=6&m=517151571&s=612x612&w=0&h=pm2doj5opQSCG7vGpddVPQopuhcHlpoY2rahSDsQpPg="
        },
        new ItemDto
        {
            Name = "Ristretto",
            Price = 20,
            Description = _itemDes,
            ImageUrl =
                "https://johnthebodyman.com/wp-content/uploads/2014/05/Bodyman-coffee-in-cup-1024x1024.jpg https://media.istockphoto.com/photos/cup-of-coffee-picture-id517151571?k=6&m=517151571&s=612x612&w=0&h=pm2doj5opQSCG7vGpddVPQopuhcHlpoY2rahSDsQpPg="
        },
        new ItemDto
        {
            Name = "Affogato",
            Price = 20,
            Description = _itemDes,
            ImageUrl =
                "https://media.istockphoto.com/photos/cup-of-coffee-picture-id517151571?k=6&m=517151571&s=612x612&w=0&h=pm2doj5opQSCG7vGpddVPQopuhcHlpoY2rahSDsQpPg="
        },
    };

    private static string _itemDes =
        /*language=html*/"""
                         This coffee is a <strong>bold and robust</strong> 
                         blend of beans sourced from the <em>lush and verdant</em> 
                         hills of Colombia. The aroma is <strong>intense and earthy</strong>, 
                         with notes of <em>dark chocolate</em> and <em>caramel</em>. 
                         The flavor is <strong>full-bodied and complex</strong>, with hints of <em>spice</em> and <em>nutmeg</em>. 
                         The finish is <strong>smooth and lingering</strong>, with a subtle hint of <em>smokiness</em>. 
                         This coffee is perfect for those who enjoy a strong, flavorful brew that packs a punch.
                         This coffee is a <strong>bold and robust</strong> 
                         blend of beans sourced from the <em>lush and verdant</em> 
                         hills of Colombia. The aroma is <strong>intense and earthy</strong>, 
                         with notes of <em>dark chocolate</em> and <em>caramel</em>. 
                         The flavor is <strong>full-bodied and complex</strong>, with hints of <em>spice</em> and <em>nutmeg</em>. 
                         The finish is <strong>smooth and lingering</strong>, with a subtle hint of <em>smokiness</em>. 
                         This coffee is perfect for those who enjoy a strong, flavorful brew that packs a punch.
                         """;
    
    public async Task<IEnumerable<MenuCategory>> LoadCategories()
    {
        // Call http client and get a respond
        await Task.Delay(500);
        var dtos = _cachedCategories;
        
        var results = new MenuCategory[dtos.Length];
        for (var i = 0; i < dtos.Length; i++)
        {
            results[i] = new MenuCategory(dtos[i]);
        }

        return results;
    }

    public async Task<IEnumerable<MenuItem>> LoadItems(MenuCategory category)
    {
        // Call http client and get a respond
        await Task.Delay(Random.Shared.Next(1000, 1500));
        var dtos = _cachedItems;

        var results = new MenuItem[dtos.Length];
        for (var i = 0; i < dtos.Length; i++)
        {
            results[i] = new MenuItem(dtos[i]);
        }

        return results;
    }

    public async Task<bool> OrderItem(MenuItem item)
    {
        await Task.Delay(3000);
        return Random.Shared.Next(0, 1000) % 2 == 0;
    }
}