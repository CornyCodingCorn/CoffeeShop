using CoffeeShop.Services.Interfaces;
using CoffeeShop.Shared.Notification;
using PopUpType = CoffeeShop.Services.Interfaces.INotificationService.Type;

namespace CoffeeShop.Services.Implementations;

public class NotificationService : INotificationService
{
    private NotificationContainer? _container;
    
    public void RegisterUiContainer(NotificationContainer element)
    {
        if (_container != null) throw new Exception("Another notification container has been registered!");
        _container = element;
    }

    public void UnregisterUiContainer(NotificationContainer element)
    {
        _container = _container == element ? null : _container;
    }

    public void Info(string title, string text)
    {
        _container?.AddNotice(PopUpType.Info, title, text);
    }

    public void Warn(string title, string text)
    {
        _container?.AddNotice(PopUpType.Warn, title, text);
    }

    public void Danger(string title, string text)
    {
        _container?.AddNotice(PopUpType.Danger, title, text);
    }
}