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
                CoordX = data[2];
                CoordY = data[3];
            }

            public string Id { get; set; }
            public string Name { get; set; }
            public string CoordX { get; set; }
            public string CoordY { get; set; }
        }

        public static void WriteCanyonsToCsv(CanyonFetcher.CanyonJsonData canyons, string path)
        {
            var text = "";
            foreach (var canyon in canyons.Canyons)
            {
                text += $"{canyon.Id},{canyon.Name},{canyon.CoordX},{canyon.CoordY}\r\n";
            }

            foreach (var commune in canyons.Communes)
            {
                foreach (var canyon in commune.Canyons)
                {
                    text += $"{canyon.Id},{canyon.Name},{canyon.CoordX ?? commune.CoordX},{canyon.CoordY ?? commune.CoordY}\r\n";
                }
            }
            File.WriteAllText(path, text);
        }
    }
}