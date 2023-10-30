using CoffeeShop.Services.Interfaces;
using Info = CoffeeShop.Services.Interfaces.INewsService.Info;

namespace CoffeeShop.Services.Implementations;


public class NewsService : INewsService
{
    public Info[] GetNews(int start, int length)
    {
        // Simulate no more info to load
        if (start > 2) return Array.Empty<Info>();
        
        // Simulate load more
        if (start != 0)
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
                    ImageUrl = "https://drive.google.com/uc?id=1nhIQ4Lb-RcAAd0tFfbNyaVEndx9I8aSm"
                },
            };
        
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
                    <p>Happy Birthday to <b>Hardcore Coffee!</b> 🎉🎂🎈</p>
                    <p>We are thrilled to celebrate the birthday of one of our favorite coffee shops. Hardcore Coffee has been serving up delicious coffee and pastries for years, and we are excited to see what the future holds for this amazing establishment. We hope that this year brings you even more success and happiness than the last.</p>
                    <p>To celebrate this special occasion, we have a special promotion for all our customers. For the next week, we are offering a <em>20% discount</em> on all coffee and pastries at Hardcore Coffee. This is our way of saying thank you for your continued support and loyalty. We hope that you will take advantage of this amazing offer and come celebrate with us at Hardcore Coffee.</p>
                    <p>Don’t miss out on this incredible opportunity to enjoy some of the best coffee and pastries in town at an unbeatable price. We look forward to seeing you soon!</p>
                </div>
                """,
                ImageUrl = "https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/happy-birthday-in-wood-type-with-coffee-marek-uliasz.jpg"
            }
        };
    }

    public Info[] GetPromotion(int start, int length)
    {
        // Simulate no more info to load
        if (start > 2) return Array.Empty<Info>();
        
        // Simulate load more
        if (start != 0)
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
                    ImageUrl = "https://drive.google.com/uc?id=1nhIQ4Lb-RcAAd0tFfbNyaVEndx9I8aSm"
                },
            };
        
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
                ImageUrl = "https://drive.google.com/uc?id=1nhIQ4Lb-RcAAd0tFfbNyaVEndx9I8aSm"
            },
            new Info()
            {
                Title = "Happy birthday HardcoreCoffee!",
                Content = /*language=html*/ $"""
                <div>
                    <p>Happy Birthday to <b>Hardcore Coffee!</b> 🎉🎂🎈</p>
                    <p>We are thrilled to celebrate the birthday of one of our favorite coffee shops. Hardcore Coffee has been serving up delicious coffee and pastries for years, and we are excited to see what the future holds for this amazing establishment. We hope that this year brings you even more success and happiness than the last.</p>
                    <p>To celebrate this special occasion, we have a special promotion for all our customers. For the next week, we are offering a <em>20% discount</em> on all coffee and pastries at Hardcore Coffee. This is our way of saying thank you for your continued support and loyalty. We hope that you will take advantage of this amazing offer and come celebrate with us at Hardcore Coffee.</p>
                    <p>Don’t miss out on this incredible opportunity to enjoy some of the best coffee and pastries in town at an unbeatable price. We look forward to seeing you soon!</p>
                </div>
                """,
                ImageUrl = "https://e7.pngegg.com/pngimages/49/166/png-clipart-bean-bag-chairs-astolfo-plush-astolfo-child-sticker.png"
            }
        };
    }
}