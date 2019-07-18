using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace MyCanyon.Console.CanyonInfoLoading
{
    public class CanyonFetcher
    {
        public static async Task FetchCanyons(string url, string path)
        {
            if (File.Exists(path))
                return;

            var jsonCanyons = await GetCanyons(url);
            CanyonCsvLoader.WriteCanyonsToCsv(jsonCanyons, path);
        }

        public static async Task<CanyonJsonData> GetCanyons(string url)
        {
            var httpClient = new HttpClient();
            var response = await httpClient.GetAsync(url);
            var content = (await response.Content.ReadAsStringAsync()).Replace("var data=", "");
            return JsonConvert.DeserializeObject<CanyonJsonData>(content);
        }

        [JsonObject]
        public class CanyonJsonData
        {
            [JsonProperty(PropertyName = "c")]
            public List<CanyonInfo> Canyons { get; set; }

            [JsonProperty(PropertyName = "d")]
            public List<CommuneInfo> Communes { get; set; }
        }

        [JsonObject]
        [DebuggerDisplay("Canyon {Id} {Name} ({CoordX};{CoordY})")]
        public class CanyonInfo
        {
            [JsonProperty(PropertyName = "a")]
            public int Id { get; set; }

            [JsonProperty(PropertyName = "b")]
            public string NameRaw { get; set; }

            [JsonProperty(PropertyName = "c")]
            public string CoordX { get; set; }

            [JsonProperty(PropertyName = "d")]
            public string CoordY { get; set; }

            [JsonProperty(PropertyName = "e")]
            public double? Rating { get; set; }

            [JsonProperty(PropertyName = "f")]
            public string Something { get; set; }

            [JsonProperty(PropertyName = "g")]
            public string ReportDate { get; set; }

            [JsonProperty(PropertyName = "h")]
            public string Name { get; set; }
        }

        [JsonObject]
        [DebuggerDisplay("Commune {Id} {Name} ({CoordX};{CoordY})")]
        public class CommuneInfo
        {
            [JsonProperty(PropertyName = "i")]
            public int Id { get; set; }

            [JsonProperty(PropertyName = "j")]
            public string Name { get; set; }

            [JsonProperty(PropertyName = "c")]
            public string CoordX { get; set; }

            [JsonProperty(PropertyName = "d")]
            public string CoordY { get; set; }

            [JsonProperty(PropertyName = "k")]
            public int Amount { get; set; }

            [JsonProperty(PropertyName = "e")]
            public List<CanyonInfo> Canyons { get; set; }
        }
    }
}