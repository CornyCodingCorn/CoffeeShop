using CoffeeShop.Utilities;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;

namespace CoffeeShop.Services.Interfaces;

public interface IJsHelper
{
    public IJSRuntime JsRuntime { get; }
    public Lazy<Task<IJSObjectReference>> HelperModule { get; }
    public event EventHandler<ScrollEventArgs> OnScroll; 

    public Task ScrollToY(float y);
    public Task ScrollToX(float x);
    public Task<(DotNetObjectReference<T>, IJSObjectReference)> CreateVisibleTrigger<T>(ElementReference reference, T caller, string onVisibleFunc, string onInvisibleFunc) where T : class;
    public Task RemoveVisibleTrigger(IJSObjectReference obj);
    public Task ExecuteWindowFunction(string function);
    public Task CapturePointer(ElementReference reference, long id);
    public Task ReleasePointer(ElementReference reference, long id);
    public Task ClearCache();
}