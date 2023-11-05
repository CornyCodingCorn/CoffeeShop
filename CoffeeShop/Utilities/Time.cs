namespace CoffeeShop.Utilities;

public struct Time : IComparable<Time>
{
    public int Hour
    {
        get => (int)(_time >> BitShiftValue * 2);
        set
        {
            _time &= BitMask | BitMask << BitShiftValue;
            _time |= (long)value << BitShiftValue * 2;
        }
    }
    public int Minute
    {
        get => (int)(_time >> BitShiftValue & BitMask);
        set
        {
            _time &= ~(BitMask << BitShiftValue);
            _time |= ((uint)value & BitMask) << BitShiftValue;

            if (Minute < 60) return;
            Hour += Minute / 60;
            Minute %= 60;
        }
    }

    public int Second
    {
        get => (int)(_time & BitMask);
        set
        {
            _time &= ~BitMask;
            _time |= (long)value & BitMask;

            if (Second < 60) return;
            Minute += Second / 60;
            Second %= 60;
        }
    }

    public static Time Now
    {
        get
        {
            var now = DateTime.Now;
            return new Time(now.Hour, now.Minute, now.Second);
        }
    }
    
    private long _time = 0;
    private const int BitShiftValue = 16;
    private const int BitMask = 0xFF;

    public Time(int hour, int minute, int second)
    {
        Second = second;
        Minute = minute;
        Hour = hour;
    }

    public Time(long time)
    {
        _time = time;
        Second = Second;
    }

    public int CompareTo(Time other)
    {
        return _time.CompareTo(other._time);
    }

    public static bool operator >(Time time1, Time time2)
    {
        return time1.CompareTo(time2) > 0;
    }

    public static bool operator <(Time time1, Time time2)
    {
        return time1.CompareTo(time2) < 0;
    }

    public static bool operator >=(Time time1, Time time2)
    {
        return time1.CompareTo(time2) >= 0;
    }

    public static bool operator <=(Time time1, Time time2)
    {
        return time1.CompareTo(time2) <= 0;
    }
}