using System;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MyCanyon.Console.CanyonInfoLoading;

namespace MyCanyon.Console
{
    public class Program
    {
        static async Task Main(string[] args)
        {
            CultureInfo.CurrentCulture = new CultureInfo("en-UK");
            CultureInfo.CurrentCulture.NumberFormat.NumberDecimalSeparator = ",";
            try
            {
                await ProcessCanyons();
            }
            catch (Exception e)
            {
                System.Console.WriteLine(e);
            }
            //System.Console.ReadKey();
        }

        private static async Task ProcessCanyons()
        {
            var config = new CanyonInfoConfig();
            var canyons = await CanyonInfoLoader.Load(config);
            var sortedCanyons = canyons.OrderBy(x => x.RouteInfo.Duration).ToList();
            var text = "id;name;score;distance;duration;hasBook;quotation;rope;approach;descent;return;navette\r\n";
            foreach (var canyonInfo in sortedCanyons)
            {
                text += $"{canyonInfo.Id};" +
                        $"\"{canyonInfo.Name}\";" +
                        $"{canyonInfo.Description.Score};" +
                        $"{canyonInfo.RouteInfo.Distance};" +
                        $"{canyonInfo.RouteInfo.Duration};" +
                        $"{canyonInfo.Books.ABookIsOwned};" +
                        $"\"{canyonInfo.Description.Quotation}\";" +
                        $"{canyonInfo.Description.RopeLength};" +
                        $"\"{canyonInfo.Description.Approach}\";" +
                        $"\"{canyonInfo.Description.Descent}\";" +
                        $"\"{canyonInfo.Description.Return}\";" +
                        $"\"{canyonInfo.Description.Navette}\"" +
                        "\r\n";
            }

            await File.WriteAllTextAsync(config.OutputPath, text, Encoding.UTF8);
        }
    }
}
