using System.Collections.Generic;

namespace MyCanyon.Console.CanyonInfoLoading
{
    public class CanyonInfoConfig
    {
        public double CenterX = 45.310360;
        public double CenterY = 7.534647;
        public int Amount = int.MaxValue;
        public List<string> OwnedBooks = new List<string>
        {
            "/canyoning/topoguide/1232/topoguide.html",
            "/boutique/produit/135/Canyoning-Nord-Italia.html"
        };

        public string RootDirectory => "D:\\from C\\temp\\canyons2";
        public string JsonPath => $"{RootDirectory}\\canyons.json";
        public string JsonPathLight => $"{RootDirectory}\\canyons-light.json";
        public string CsvPath => $"{RootDirectory}\\canyons.csv";
        public string PointPathTemplate => $"{RootDirectory}\\{{0}}-points.csv";
        public string ResumePathTemplate => $"{RootDirectory}\\{{0}}-resume.json";
        public string RoutePathTemplate => $"{RootDirectory}\\{{0}}-route.json";
        public string BooksPathTemplate => $"{RootDirectory}\\{{0}}-books.json";
        public string OutputPath => $"{RootDirectory}\\canyons-filtered.csv";

        public string GoogleMapsApiKey => $"AIzaSyBZXYbd3HQsXC_TJYN5HnyxBKsJQbp2m_U";
        public string GoogleMapsDistanceApiTemplate => $"https://maps.googleapis.com/maps/api/distancematrix/json?origins={{0}},{{1}}&destinations={{2}},{{3}}&key={GoogleMapsApiKey}";

        public string DescentecanyonJson => "https://www.descente-canyon.com/canyoning/carte.json";
        public string DescentecanyonResumeTemplate => "https://www.descente-canyon.com/canyoning/canyon/2{0}";
        public string DescentecanyonDescriptionTemplate => "https://www.descente-canyon.com/canyoning/canyon-description/2{0}";
        public string DescentecanyonBibliographieTemplate => "https://www.descente-canyon.com/canyoning/canyon-bibliographie/2{0}";
        public string DescentecanyonMapTemplate => "https://www.descente-canyon.com/canyoning/canyon-carte/2{0}";

    }
}