using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace MyCanyon.Console.CanyonInfoLoading
{
    public static class CanyonPointsFetcher
    {
        public static async Task<List<CanyonPointCsvInfo>> FetchCanyonPoints(CanyonInfo canyon, string urlFormat, string csvLocationFormat)
        {
            var csvPath = string.Format(csvLocationFormat, canyon.Id);
            if (File.Exists(csvPath))
                return (await File.ReadAllLinesAsync(csvPath)).Select(x => new CanyonPointCsvInfo(x.Split(","))).ToList();

            var content = await HttpFetcher.FetchContent(string.Format(urlFormat, canyon.Id));
            var match = Regex.Matches(content, "var point = ({[^}]*});addMarker\\(point\\);");
            var pointData = match.Select(x => x.Value).ToList();
            var points = new List<CanyonPointCsvInfo>();
            foreach (var point in pointData)
            {
                var parts = Regex.Match(point, "var point = {position: new google.maps.LatLng\\((.*),(.*)\\),type: '(.*)',remarque: '[^}]*};addMarker\\(point\\);");
                points.Add(new CanyonPointCsvInfo(parts.Groups.Values.Skip(1).Select(x => x.Value).ToArray()));
            }

            var text = "";
            foreach (var point in points)
            {
                text += $"{point.CoordX},{point.CoordY},{point.Type}\r\n";
            }
            await File.WriteAllTextAsync(csvPath, text);

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