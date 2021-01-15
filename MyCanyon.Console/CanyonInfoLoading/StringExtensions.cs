namespace MyCanyon.Console.CanyonInfoLoading
{
    public static class StringExtensions
    {
        public static int? ToNInt(this string input)
        {
            return int.TryParse(input, out var result) ? result : (int?)null;
        }

        public static double? ToNDouble(this string input)
        {
            return double.TryParse(input, out var result) ? result : (double?)null;
        }
    }
}