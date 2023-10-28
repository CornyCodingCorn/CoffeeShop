using CoffeeShop.Services.Interfaces;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace CoffeeShop.Services.Implementations;

public class JsHelper : IJsHelper
{
    public IJSRuntime JsRuntime { get; init; }
    public IJSObjectReference HelperModule { get; private set; } = default!;
    public bool IsInitialized { get; private set; }

    private readonly Task _initialization;

    public JsHelper(IJSRuntime jsRuntime)
    {
        JsRuntime = jsRuntime;
        _initialization = Task.Run(async () =>
        {
            HelperModule = await JsRuntime.InvokeAsync<IJSObjectReference>("import", "./scripts/js-helper.cs.js");
            IsInitialized = true;
        });
    }

    public async Task AwaitInitialization()
    {
        await _initialization;
    }

    public Task ScrollToY(float y)
    {
        return ExecuteWindowFunction($"scrollTo({{ top: {y} , behavior: 'smooth' }})");
    }

    public Task ScrollToX(float x)
    {
        return ExecuteWindowFunction($"scrollTo({{ left: {x} , behavior: 'smooth' }})");
    }

    public async Task<IJSObjectReference> CreateVisibleTrigger(ElementReference reference, Action? onVisible, Action? onInvisible)
    {
        var observer = await HelperModule.InvokeAsync<IJSObjectReference>("AddVisibleTriggers", reference, onVisible, onInvisible);
        return observer;
    }

    public async Task RemoveVisibleTrigger(IJSObjectReference obj)
    {
        await obj.InvokeVoidAsync("disconnect");
    }

    public async Task ExecuteWindowFunction(string function)
    {
        await JsRuntime.InvokeVoidAsync("eval", $"window.{function}");
    }

    public async Task CapturePointer(ElementReference reference, long pointerId)
    {
        await HelperModule.InvokeVoidAsync("capturePointer", reference , pointerId);
    }
    
    public async Task ReleasePointer(ElementReference reference, long pointerId)
    {
        await HelperModule.InvokeVoidAsync("releasePointer", reference, pointerId);
    }
}