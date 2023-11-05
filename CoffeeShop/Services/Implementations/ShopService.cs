using System.Text;
using CoffeeShop.DTOs;
using CoffeeShop.Services.Interfaces;
using CoffeeShop.Services.Types;

using Features = CoffeeShop.Services.Types.ShopInfo.ShopFeatures;
namespace CoffeeShop.Services.Implementations;

public class ShopService : IShopService
{
    private static readonly string[] Images =
    {
        "http://1.bp.blogspot.com/-ji4pCKll5kk/VEVvu0S28_I/AAAAAAAC55Y/bLlNzlXhrT0/s1600/Interior%2BThump%2BCoffee.jpg",
        "https://www.dragosroua.com/wp-content/uploads/2019/03/coffee-shop-1149155_1920.jpg",
        "https://rdalimited.co.uk/wp-content/uploads/2018/04/IMG_1973.jpg",
        "https://d1dxs113ar9ebd.cloudfront.net/225batonrouge/2020/10/Electric-Depot-KMS_9539-768x512.jpg",
        "https://media1.fdncms.com/metrotimes/imager/u/slideshow/23771125/feature-coffee-img_3600-2.jpg"
    };
    
    private static readonly ShopDto[] dtos = {
        new()
        {
            Name = "Hardcore world",
            Address = new AddressDto()
            {
                City = "Ho Chi Minh",
                District = "District 7",
                Ward = "Tan Kien",
                Street = "Elm Street",
                Number = "123/2"
            },
            OpenHour = 0x7000F0000,
            ClosingHour = 0x1700000000,
            Features = (short)(Features.Internet | Features.ChildSafe | Features.TakeAway),
            ImageUrls = GetRandomImageUrl()
        },
        new()
        {
            Name = "Hardcore espresso",
            Address = new AddressDto()
            {
                City = "Ho Chi Minh",
                District = "District 3",
                Ward = "Tan Kien",
                Street = "Elm Street",
                Number = "123/2"
            },
            OpenHour = 0x7000F0000,
            ClosingHour = 0x1700000000,
            Features = (short)(Features.Internet | Features.ParkingLots | Features.InStore),
            ImageUrls = GetRandomImageUrl()
        },
        new()
        {
            Name = "Hardcore turbo",
            Address = new AddressDto()
            {
                City = "Ha Noi",
                District = "Tay Ho",
                Ward = "Tan Kien",
                Street = "Erk Street",
                Number = "321/1"
            },
            OpenHour = 0x7000F0000,
            ClosingHour = 0x1700000000,
            Features = (short)(Features.Internet | Features.ChildSafe | Features.TakeAway | Features.ParkingLots),
            ImageUrls = GetRandomImageUrl()
        },
    };

    private static string GetRandomImageUrl()
    {
        const int imageCount = 3;
        var rnd = Random.Shared.Next(0, imageCount - 1);
        var randomSlide = Images[rnd..(rnd + imageCount)];

        var stringBuilder = new StringBuilder();
        foreach (var url in randomSlide)
        {
            stringBuilder.Append(url);
            stringBuilder.Append(' ');
        }

        return stringBuilder.ToString().TrimEnd();
    }
    
    public async Task<IEnumerable<ShopInfo>> LoadShops()
    {
        await Task.Delay(1000);
        var loadedDtos = dtos;
        
        var info = new ShopInfo[loadedDtos.Length];
        for (var i = 0; i < info.Length; i++)
        {
            info[i] = new ShopInfo(loadedDtos[i]);
        }

        return info;
    }

    public Task<IEnumerable<ShopInfo>> LoadShops(string city)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<ShopInfo>> LoadShops(string city, string district)
    {
        throw new NotImplementedException();
    }
}