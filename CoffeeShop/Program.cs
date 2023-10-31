using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using CoffeeShop;
using CoffeeShop.Services;
using CoffeeShop.Services.Implementations;
using CoffeeShop.Services.Interfaces;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });
builder.Services.AddScoped<INewsService, NewsService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IJsHelper, JsHelper>();

await builder.Build().RunAsync();