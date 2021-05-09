using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace MyCanyon.Console.CanyonInfoLoading
{
    public static class CanyonRouteFetcher
    {
        public static async Task<CanyonRouteInfo> FetchCanyonRoute(CanyonInfo canyon, CanyonInfoConfig config, string urlFormat, string csvLocationFormat)
        {
            var csvPath = string.Format(csvLocationFormat, canyon.Id);
            if (File.Exists(csvPath))
                return JsonConvert.DeserializeObject<CanyonRouteInfo>(await File.ReadAllTextAsync(csvPath));

            var url = string.Format(urlFormat, config.CenterX, config.CenterY, canyon.CoordX, canyon.CoordY);
            var content = await HttpFetcher.FetchContent(url);
            var matrix = JsonConvert.DeserializeObject<RouteMatrix>(content);

            var routeInfo = new CanyonRouteInfo
            {
                Url = url,
                Distance = matrix.Rows[0].Elements[0].Distance?.Value ?? 0,
                Duration = TimeSpan.FromSeconds(matrix.Rows[0].Elements[0].Duration?.Value ?? 0)
            };

            await File.WriteAllTextAsync(csvPath, JsonConvert.SerializeObject(routeInfo));

            return routeInfo;
        }

        [JsonObject]
        private class RouteMatrix
        {
            public List<Row> Rows { get; set; }

            [JsonObject]
            public class Row
            {
                public List<Element> Elements { get; set; }
            }

            [JsonObject]
            public class Element
            {
                public ValueWithText Distance { get; set; }
                public ValueWithText Duration { get; set; }
            }

            [JsonObject]
            public class ValueWithText
            {
                public int Value { get; set; }
                public string Text { get; set; }
            }
        }

        public class CanyonRouteInfo
        {
            public string Url { get; set; }
            public double Distance { get; set; }
            public TimeSpan Duration { get; set; }
        }
    }
}