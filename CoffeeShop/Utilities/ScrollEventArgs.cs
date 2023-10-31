namespace CoffeeShop.Utilities;

[Serializable]
public class ScrollEventArgs : EventArgs
{
    public float ScrollX { get; set; }
    public float ScrollY { get; set; }
}