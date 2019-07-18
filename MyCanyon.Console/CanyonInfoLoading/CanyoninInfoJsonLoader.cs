using System.Collections.Generic;
using System.IO;
using Newtonsoft.Json;

namespace MyCanyon.Console.CanyonInfoLoading
{
    public class CanyoninInfoJsonLoader
    {
        public static List<CanyonInfo> Load(string path)
        {
            return JsonConvert.DeserializeObject<List<CanyonInfo>>(File.ReadAllText(path));
        }

        public static void Save(List<CanyonInfo> canyonInfos, string path)
        {
            File.WriteAllText(path, JsonConvert.SerializeObject(canyonInfos));
        }
    }
}