using Microsoft.AspNetCore.Components;

namespace CoffeeShop.Shared.Common;

public abstract class InputBase<T> : ComponentBase
{
    [Parameter] public T Value { get; set; } = default!;
    [Parameter] public EventCallback<T>? ValueChanged { get; set; }
    [Parameter] public string Class { get; set; } = default!;
    [Parameter] public string Id { get; set; } = default!;

    protected abstract void HandleOnInput(ChangeEventArgs e);
}