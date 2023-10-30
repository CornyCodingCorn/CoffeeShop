using CoffeeShop.Shared;

namespace CoffeeShop.Services.Interfaces;

public interface INotificationService
{
    public Notification
    
    public Task Info(string text);
    public Task Warn(string text);
    public Task Danger(string text);
}