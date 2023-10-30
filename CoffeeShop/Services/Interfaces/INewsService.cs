using CoffeeShop.DTOs;

namespace CoffeeShop.Services.Interfaces;

public interface INewsService
{
    public class Info
    {
        public string Title { get; set; } = "News title";
        public string Content { get; set; } = "News content";
        public string ImageUrl { get; set; } = "News image's url";
        public bool Flip { get; set; } = false;

        public Info (NewsInfoDto dto)
        {
            Title = dto.Title;
            Content = dto.Content;
            ImageUrl = dto.ImageUrl;
        }
        public Info() {}
    }

    public Info[] GetNews(int start, int length);
    public Info[] GetPromotion(int start, int length);
}