using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace MyCanyon.Console.CanyonInfoLoading
{
    public static class CanyonBooksFetcher
    {
        public static async Task<CanyonBooksInfo> FetchCanyonBooks(CanyonInfo canyon, CanyonInfoConfig config, string urlFormat, string csvLocationFormat)
        {
            var csvPath = string.Format(csvLocationFormat, canyon.Id);
            if (File.Exists(csvPath))
                return JsonConvert.DeserializeObject<CanyonBooksInfo>(await File.ReadAllTextAsync(csvPath));

            var url = string.Format(urlFormat, canyon.Id);
            var content = await HttpFetcher.FetchContent(url);
            var data = Regex.Match(content, "Livres? \\/ Topoguides?<\\/h2><\\/div>([\\S\\s]*)<div class=\"list-group-item\"><h2><span class=\"ic glyphicon-random\"><\\/span> Carte<\\/h2>").Groups[1].Value;

            var matches = Regex.Matches(data, "<a href=\"([/A-z0-9.-]*)\"><h5>");
            var bookUrls = new List<string>();
            foreach (Match match in matches)
            {
                bookUrls.Add(match.Groups[1].Value);
            }
            var books = new CanyonBooksInfo
            {
                Url = url,
                BookUrls = bookUrls,
                ABookIsOwned = config.OwnedBooks.Any(x => bookUrls.Contains(x))
            };

            await File.WriteAllTextAsync(csvPath, JsonConvert.SerializeObject(books));

            return books;
        }

        public class CanyonBooksInfo
        {
            public string Url { get; set; }
            public List<string> BookUrls { get; set; }
            public bool ABookIsOwned { get; set; }
        }
    }
}