using System;
using System.IO;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace MyCanyon.Console.CanyonInfoLoading
{
    public static class CanyonDescriptionFetcher
    {
        public static async Task<CanyonDescription> FetchCanyonDescription(CanyonInfo canyon, string urlFormat, string csvLocationFormat)
        {
            var csvPath = string.Format(csvLocationFormat, canyon.Id);
            //if (File.Exists(csvPath))
            //    return JsonConvert.DeserializeObject<CanyonDescription>(await File.ReadAllTextAsync(csvPath));

            var url = string.Format(urlFormat, canyon.Id);
            var content = await HttpFetcher.FetchContent(url);
            var data = Regex.Match(content, "<div class=\"fichetechniqueintegree\">([\\S\\s]*)<\\/div>").Groups[1].Value;
            var resume = new CanyonDescription
            {
                Url = url,
                Score = Regex.Match(data, "<strong>([0-9.]*)</strong>/4").Groups[1].Value.ToNDouble(),
                AltitudeDeparture = Regex.Match(data, "Alti dép. ([0-9.]*)m").Groups[1].Value,
                HeightDifference = Regex.Match(data, "Dénivelé ([0-9.]*)m").Groups[1].Value,
                Length = Regex.Match(data, "Longueur ([0-9.]*)m").Groups[1].Value,
                MaxWaterfall = Regex.Match(data, "Casc. max ([0-9.]*)m").Groups[1].Value,
                Quotation = Regex.Match(data, "Cotation ([av0-7IV]*)").Groups[1].Value,
                RopeLength = Regex.Match(data, "Corde ([0-9.]*)m").Groups[1].Value,
                Approach = GetDuration(Regex.Match(data, "Approche: ([A-zÀ-ú0-9.]*)").Groups[1].Value),
                Descent = GetDuration(Regex.Match(data, "Descente: ([A-zÀ-ú0-9.]*)").Groups[1].Value),
                Return = GetDuration(Regex.Match(data, "Retour: ([A-zÀ-ú0-9.]*)").Groups[1].Value),
                Navette = Regex.Match(data, "Navette: ([A-zÀ-ú0-9.]*)").Groups[1].Value
            };

            await File.WriteAllTextAsync(csvPath, JsonConvert.SerializeObject(resume));

            return resume;
        }

        private static TimeSpan GetDuration(string value)
        {
            var duration = TimeSpan.Zero;

            // néant is 00:00:00
            if (value == "néant") return duration;

            // no indication => 4 becomes 04:00:00, 5 becomes 00:05:00
            if (int.TryParse(value, out var intValue))
                return intValue < 5 ? TimeSpan.FromHours(intValue) : TimeSpan.FromMinutes(intValue);

            // 3h becomes 3hmin, 3h30 becomes 3h30min
            if (!value.Contains("min"))
                value += "min";

            var hours = Regex.Match(value, "(\\d*)h").Groups[1].Value;
            var minutes = Regex.Match(value, "(\\d*)min").Groups[1].Value;

            return new TimeSpan(hours == "" ? 0 : int.Parse(hours), minutes == "" ? 0 : int.Parse(minutes), 0);
        }

        public class CanyonDescription
        {
            public string Url { get; set; }
            public double? Score { get; set; }
            public string AltitudeDeparture { get; set; }
            public string HeightDifference { get; set; }
            public string Length { get; set; }
            public string MaxWaterfall { get; set; }
            public string Quotation { get; set; }
            public string RopeLength { get; set; }
            public TimeSpan Approach { get; set; }
            public TimeSpan Descent { get; set; }
            public TimeSpan Return { get; set; }
            public string Navette { get; set; }
        }
    }
}