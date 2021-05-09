using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace MyCanyon.Console.CanyonInfoLoading
{
    public class CanyonInfoLoader
    {
        public static async Task<List<CanyonInfo>> Load(CanyonInfoConfig config)
        {
            await FetchCanyons(config);
            return CanyoninInfoJsonLoader.Load(config.JsonPath);
        }

        private static async Task FetchCanyons(CanyonInfoConfig config)
        {
            if (File.Exists(config.JsonPath))
                return;

            Directory.CreateDirectory(config.RootDirectory);
            await CanyonFetcher.FetchCanyons(config.DescentecanyonJson, config.CsvPath);

            var canyonCsvs = CanyonCsvLoader.ReadCanyons(config.CsvPath);
            var canyonInfos = CanyonInfoFetcher.FetchCanyonInfo(canyonCsvs, config);
            CanyoninInfoJsonLoader.Save(canyonInfos, config.JsonPath);

            var canyonInfosLight = canyonInfos.Select(x => new CanyonInfoLight(x)).ToList();
            CanyoninInfoJsonLoader.Save(canyonInfosLight, config.JsonPathLight);
        }
    }
}