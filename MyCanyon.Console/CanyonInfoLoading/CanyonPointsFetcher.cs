using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace MyCanyon.Console.CanyonInfoLoading
{
    public class CanyonPointsFetcher
    {
        public static List<CanyonInfo> FetchCanyonPoints(List<CanyonCsvLoader.CanyonCsvInfo> canyons, string urlFormat, string csvLocationFormat)
        {
            var canyonInfos = new List<CanyonInfo>();
            Parallel.ForEach(canyons, canyon =>
            {
                var result = FetchCanyonPoints(canyon, urlFormat, csvLocationFormat).Result;
                canyonInfos.Add(new CanyonInfo
                {
                    Id = canyon.Id,
                    Name = canyon.Name,
                    CoordX = canyon.CoordX,
                    CoordY = canyon.CoordY,
                    Points = result.Select(x => new CanyonInfo.CanyonPointInfo
                    {
                        Type = x.Type,
                        CoordX = x.CoordX,
                        CoordY = x.CoordY
                    }).ToList()
                });
            });

            return canyonInfos;
        }

        public static async Task<List<CanyonPointCsvInfo>> FetchCanyonPoints(CanyonCsvLoader.CanyonCsvInfo canyon, string urlFormat, string csvLocationFormat)
        {
            var csvPath = string.Format(csvLocationFormat, canyon.Id);
            if (File.Exists(csvPath))
                return File.ReadAllLines(csvPath).Select(x => new CanyonPointCsvInfo(x.Split(","))).ToList();

            var url = string.Format(urlFormat, canyon.Id);
            var client = new HttpClient();
            var response = await client.GetAsync(url);
            var content = await response.Content.ReadAsStringAsync();
            var match = Regex.Matches(content, "var point = ({[^}]*});addMarker\\(point\\);");
            var pointData = match.Select(x => x.Value).ToList();
            var points = new List<CanyonPointCsvInfo>();
            foreach (var point in pointData)
            {
                var parts = Regex.Match(point, "var point = {position: new google.maps.LatLng\\((.*),(.*)\\),type: '(.*)',remarque: '[^}]*};addMarker\\(point\\);");
                points.Add(new CanyonPointCsvInfo(parts.Groups.Skip(1).Select(x => x.Value).ToArray()));
            }

            var text = "";
            foreach (var point in points)
            {
                text += $"{point.CoordX},{point.CoordY},{point.Type}\r\n";
            }
            File.WriteAllText(csvPath, text);

            return points;
        }

        public class CanyonPointCsvInfo
        {
            public CanyonPointCsvInfo(string[] data)
            {
                CoordX = data[0];
                CoordY = data[1];
                Type = data[2];
            }
            public string CoordX { get; set; }
            public string CoordY { get; set; }
            public string Type { get; set; }
        }
    }
}