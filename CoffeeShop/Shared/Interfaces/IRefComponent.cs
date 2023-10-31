using Microsoft.AspNetCore.Components;

namespace CoffeeShop.Shared.Interfaces;

public interface IRefComponent
{
    public ElementReference Reference { get; }
}