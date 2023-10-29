using System.Text;
using Microsoft.Extensions.Primitives;
using Microsoft.JSInterop;
using Microsoft.JSInterop.Implementation;

namespace CoffeeShop.Utilities;

public static class JsRuntimeExtension
{
    public static async Task<JSObjectReference> ImportModuleAsync(this IJSRuntime jsRuntime, string[] exports, string module)
    {
        var exportBuilder = new StringBuilder();
        if (exports.Length != 0)
        {
            exportBuilder.Append(exports[0]);
            for (var i = 1; i < exports.Length; i++)
            {
                exportBuilder.Append(", ");
                exportBuilder.Append(exports[i]);
            }
        }

        return await jsRuntime.InvokeAsync<JSObjectReference>("import", $"{{{exportBuilder.ToString()}}}", "from", $"{module}");
    }
}