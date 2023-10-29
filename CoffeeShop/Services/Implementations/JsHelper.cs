using CoffeeShop.Services.Interfaces;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace CoffeeShop.Services.Implementations;

public class JsHelper : IJsHelper
{
    public IJSRuntime JsRuntime { get; }
    public Lazy<Task<IJSObjectReference>> HelperModule { get; }

    public JsHelper(IJSRuntime jsRuntime)
    {
        JsRuntime = jsRuntime;
        HelperModule = new Lazy<Task<IJSObjectReference>>(() => JsRuntime.InvokeAsync<IJSObjectReference>("import", "./scripts/helper.js").AsTask());
    }
    
    public Task ScrollToY(float y)
    {
        return ExecuteWindowFunction($"scrollTo({{ top: {y} , behavior: 'smooth' }})");
    }

    public Task ScrollToX(float x)
    {
        return ExecuteWindowFunction($"scrollTo({{ left: {x} , behavior: 'smooth' }})");
    }

    public async Task<(DotNetObjectReference<T>, IJSObjectReference)> CreateVisibleTrigger<T>(ElementReference reference, T caller, string onVisibleFunc, string onInvisibleFunc) where T : class
    {
        var module = await HelperModule.Value;
        var callerRef = DotNetObjectReference.Create(caller);
        var observer = await module.InvokeAsync<IJSObjectReference>("addVisibleTriggers", reference, callerRef, onVisibleFunc, onInvisibleFunc);
        return (callerRef, observer);
    }

    public async Task RemoveVisibleTrigger(IJSObjectReference obj)
    {
        await obj.InvokeVoidAsync("removeVisibleTriggers");
    }

    public async Task ExecuteWindowFunction(string function)
    {
        await JsRuntime.InvokeVoidAsync("eval", $"window.{function}");
    }

    public async Task CapturePointer(ElementReference reference, long pointerId)
    {
        var module = await HelperModule.Value;
        await module.InvokeVoidAsync("capturePointer", reference , pointerId);
    }
    
    public async Task ReleasePointer(ElementReference reference, long pointerId)
    {
        var module = await HelperModule.Value;
        await module.InvokeVoidAsync("releasePointer", reference, pointerId);
    }

    public async Task ClearCache()
    {
        await JsRuntime.InvokeVoidAsync("clearCache");
    }
    
}