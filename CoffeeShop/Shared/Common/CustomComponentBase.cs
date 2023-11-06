using Microsoft.AspNetCore.Components;

namespace CoffeeShop.Shared.Common;

public abstract class CustomComponentBase : ComponentBase
{
    [Parameter] public string Class { get; set; } = string.Empty;
    [Parameter] public string? Id { get; set; }
    [Parameter] public RenderFragment? ChildContent { get; set; }
}