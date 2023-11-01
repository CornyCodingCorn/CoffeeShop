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
            Name = "Black coffee",
            Price = 20,
            ImageUrl =
                "https://empire-s3-production.bobvila.com/articles/wp-content/uploads/2020/08/best_coffee_mug.jpg"
        },
        new ItemDto
        {
            Name = "Black coffee",
            Price = 20,
            ImageUrl =
                "https://empire-s3-production.bobvila.com/articles/wp-content/uploads/2020/08/best_coffee_mug.jpg"
        },
        new ItemDto
        {
            Name = "Black coffee",
            Price = 20,
            ImageUrl =
                "https://empire-s3-production.bobvila.com/articles/wp-content/uploads/2020/08/best_coffee_mug.jpg"
        },
        new ItemDto
        {
            Name = "Black coffee",
            Price = 20,
            ImageUrl =
                "https://empire-s3-production.bobvila.com/articles/wp-content/uploads/2020/08/best_coffee_mug.jpg"
        },
        new ItemDto
        {
            Name = "Black coffee",
            Price = 20,
            ImageUrl =
                "https://empire-s3-production.bobvila.com/articles/wp-content/uploads/2020/08/best_coffee_mug.jpg"
        },
        new ItemDto
        {
            Name = "Black coffee",
            Price = 20,
            ImageUrl =
                "https://empire-s3-production.bobvila.com/articles/wp-content/uploads/2020/08/best_coffee_mug.jpg"
        },
        new ItemDto
        {
            Name = "Black coffee",
            Price = 20,
            ImageUrl =
                "https://empire-s3-production.bobvila.com/articles/wp-content/uploads/2020/08/best_coffee_mug.jpg"
        },
        new ItemDto
        {
            Name = "Black coffee",
            Price = 20,
            ImageUrl =
                "https://empire-s3-production.bobvila.com/articles/wp-content/uploads/2020/08/best_coffee_mug.jpg"
        },
        new ItemDto
        {
            Name = "Black coffee",
            Price = 20,
            ImageUrl =
                "https://empire-s3-production.bobvila.com/articles/wp-content/uploads/2020/08/best_coffee_mug.jpg"
        },
        new ItemDto
        {
            Name = "Black coffee",
            Price = 20,
            ImageUrl =
                "https://empire-s3-production.bobvila.com/articles/wp-content/uploads/2020/08/best_coffee_mug.jpg"
        },
        new ItemDto
        {
            Name = "Black coffee",
            Price = 20,
            ImageUrl =
                "https://empire-s3-production.bobvila.com/articles/wp-content/uploads/2020/08/best_coffee_mug.jpg"
        },
    };
    
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
        await Task.Delay(Random.Shared.Next(2000, 5000));
        var dtos = _cachedItems;

        var results = new MenuItem[dtos.Length];
        for (var i = 0; i < dtos.Length; i++)
        {
            results[i] = new MenuItem(dtos[i]);
        }

        return results;
    }
}