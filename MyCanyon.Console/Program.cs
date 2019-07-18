using System;
using System.Threading.Tasks;
using MyCanyon.Console.CanyonInfoLoading;

namespace MyCanyon.Console
{
    public class Program
    {
        static async Task Main(string[] args)
        {
            try
            {
                await ProcessCanyons();
            }
            catch (Exception e)
            {
                System.Console.WriteLine(e);
            }
            System.Console.ReadKey();
        }

        private static async Task ProcessCanyons()
        {
            var config = new CanyonInfoConfig();
            var canyonInfos = await CanyonInfoLoader.Load(config);
        }
    }
}
