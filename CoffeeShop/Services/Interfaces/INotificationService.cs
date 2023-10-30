using CoffeeShop.Shared;
using CoffeeShop.Shared.Notification;

namespace CoffeeShop.Services.Interfaces;

public interface INotificationService
{
    public enum Type
    {
        Info,
        Warn,
        Danger
    }
    
    public void RegisterUiContainer(NotificationContainer element);
    public void UnregisterUiContainer(NotificationContainer element);
    
    public void Info(string title, string text);
    public void Warn(string title, string text);
    public void Danger(string title, string text);
}