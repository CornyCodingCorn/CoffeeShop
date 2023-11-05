using CoffeeShop.DTOs;
using CoffeeShop.Utilities;

namespace CoffeeShop.Services.Types;

public class ShopInfo
{
     [Flags]
     public enum ShopFeatures
     {
          ChildSafe = 0b1,
          TakeAway = 0b10,
          InStore = 0b100,
          ParkingLots = 0b1000,
          Internet = 0b10000,
     }
     
     public string Name { get; set; }
     public string[] ImageUrls { get; set; }
     public Address Address { get; set; }
     public Time OpenHour { get; set; }
     public Time ClosingHour { get; set; }
     public ShopFeatures Features { get; set; }

     public ShopInfo(ShopDto dto)
     {
          Name = dto.Name;
          ImageUrls = dto.ImageUrls.Split(' ');
          Address = new Address(dto.Address);
          OpenHour = new Time(dto.OpenHour);
          ClosingHour = new Time(dto.ClosingHour);
          Features = (ShopFeatures)dto.Features;
     }
}