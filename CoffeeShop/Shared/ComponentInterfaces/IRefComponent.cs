using Microsoft.AspNetCore.Components;

namespace CoffeeShop.Shared.ComponentInterfaces;

public interface IRefComponent
{
    public ElementReference Reference { get; }
}