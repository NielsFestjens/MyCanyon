using System.Net.Http;
using System.Threading.Tasks;

namespace MyCanyon.Console.CanyonInfoLoading
{
    public static class HttpFetcher
    {
        private static readonly HttpClient _client = new HttpClient();

        public static async Task<string> FetchContent(string url)
        {
            var response = await _client.GetAsync(url);
            return await response.Content.ReadAsStringAsync();
        }
    }
}