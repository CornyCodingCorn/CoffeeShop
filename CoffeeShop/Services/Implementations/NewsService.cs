using CoffeeShop.Services.Interfaces;
using Info = CoffeeShop.Services.Interfaces.INewsService.Info;

namespace CoffeeShop.Services.Implementations;


public class NewsService : INewsService
{
    public Info[] GetNews(int start, int length)
    {
        // Query the server for relevant news
        return new[]
        {
            new Info()
            {
                Title = "Celebrating women day!",
                Content = /*language=html*/ $"""
                <div>
                    <p>
                        It's that time of the year again when we celebrate the strength and resilience of women all around the world. 
                        Women's day is an occasion to acknowledge the critical role that women play in our lives, and for all the multitasking they do, 
                        they deserve a treat. What better way to show your appreciation than by treating the special women in your life to a cup of coffee 
                        that will warm their hearts and fill their energy levels? 
                    </p>
                    <p>
                        Coffee makes the perfect gift for all the lovely women in our lives, whether it's your mom, 
                        sister, wife, friend or colleague. A warm cup of coffee has the power to invigorate your senses, and what better way to 
                        start the day than with a shot of caffeine? For those who love a latte or cappuccino, there is nothing quite like the taste of 
                        freshly frothed milk and rich espresso. The aroma of freshly brewed coffee is enough to transform a dull morning into a delightful 
                        one. 
                    </p>
                    <p>
                         Coffee is also a great conversation starter, and there's nothing more pleasant than having a chat over a cup of coffee. 
                         Women love to bond over a warm cup of coffee, whether it's gossiping with friends, getting to know your colleagues, 
                         or connecting with someone on a date. Coffee is the perfect accompaniment to long conversations, and it helps to build strong 
                         relationships. So, grab a cup of coffee and celebrate the influential women in your life. Happy women's day!               
                    </p>
                </div>
                """,
                ImageUrl = "https://www.comunicaffe.com/wp-content/uploads/2016/04/Woman-drinking-coffee.jpg"
            },
            new Info()
            {
                Title = "Happy birthday HardcoreCoffee!",
                Content = /*language=html*/ $"""
                <div>
                    <p>Testing</p>
                    
                </div>
                """,
                ImageUrl = "https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/happy-birthday-in-wood-type-with-coffee-marek-uliasz.jpg"
            }
        };
    }
}