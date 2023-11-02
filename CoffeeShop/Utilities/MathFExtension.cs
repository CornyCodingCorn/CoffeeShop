namespace CoffeeShop.Utilities;

public static class MathFEx
{
    public const float Tolerance = 1e-4f;
    
    public static bool EqualEnough(float f1, float f2, float epsilon = Tolerance)
    {
        return (MathF.Abs(f1 - f2) < Tolerance);
    }
}