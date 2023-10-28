using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace CoffeeShop.Services.Interfaces;

public interface IJsHelper
{
    public IJSRuntime JsRuntime { get; }
    public IJSObjectReference HelperModule { get; }

    public Task ScrollToY(float y);
    public Task ScrollToX(float x);
    public Task<IJSObjectReference> CreateVisibleTrigger(ElementReference reference, Action? onVisible, Action? onInvisible);
    public Task RemoveVisibleTrigger(IJSObjectReference obj);
    public Task ExecuteWindowFunction(string function);
    public Task CapturePointer(ElementReference reference, long id);
    public Task ReleasePointer(ElementReference reference, long id);
}