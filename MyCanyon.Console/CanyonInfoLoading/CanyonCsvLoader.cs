using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace MyCanyon.Console.CanyonInfoLoading
{
    public class CanyonCsvLoader
    {
        public static List<CanyonCsvInfo> ReadCanyons(string path)
        {
            return File.ReadAllLines(path).Select(x => new CanyonCsvInfo(x.Split(","))).ToList();
        }

        public class CanyonCsvInfo
        {
            public CanyonCsvInfo(string[] data)
            {
                Id = data[0];
                Name = data[1];
                CoordX = double.Parse(data[2].Replace(".", ","));
                CoordY = double.Parse(data[3].Replace(".", ","));
            }

            public string Id { get; set; }
            public string Name { get; set; }
            public double CoordX { get; set; }
            public double CoordY { get; set; }
        }

        public static void WriteCanyonsToCsv(CanyonFetcher.CanyonJsonData canyons, string path)
        {
            var canyonInfos = canyons.Canyons.OrderBy(x => x.Id).Select(canyon => (canyon.Id, canyon.Name, canyon.CoordX, canyon.CoordY)).ToList();
            canyonInfos.AddRange(
                from commune in canyons.Communes 
                from canyon in commune.Canyons
                select (canyon.Id, canyon.Name, canyon.CoordX ?? commune.CoordX, canyon.CoordY ?? commune.CoordY)
            );

            var lines = canyonInfos
                .GroupBy(x => x.Id).Select(x => x.First())
                .OrderBy(x => x.Id)
                .Select(canyon => $"{canyon.Id},{canyon.Name},{canyon.CoordX},{canyon.CoordY}")
                .ToList();

            File.WriteAllLines(path, lines);
        }
    }
}