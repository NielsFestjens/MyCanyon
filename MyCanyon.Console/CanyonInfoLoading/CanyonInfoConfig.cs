namespace MyCanyon.Console.CanyonInfoLoading
{
    public class CanyonInfoConfig
    {
        public string RootDirectory => "C:\\temp\\canyons";
        public string JsonPath => "C:\\temp\\canyons\\canyons.json";
        public string CsvPath => "C:\\temp\\canyons\\canyons.csv";
        public string PointPathTemplate => "C:\\temp\\canyons\\{0}-points.csv";
        public string DescentecanyonJson => "https://www.descente-canyon.com/canyoning/carte.json";
        public string DescentecanyonMapTemplate => "https://www.descente-canyon.com/canyoning/canyon-carte/2{0}/carte.html";
    }
}