using System.Collections.Generic;
using System.Linq;
using MyCanyon.Console.CanyonInfoLoading;

namespace MyCanyon.Console
{
    public class CanyonInfo
    {
        public string Name { get; set; }
        public double CoordX { get; set; }
        public double CoordY { get; set; }
        public double Distance { get; set; }
        public List<CanyonPointInfo> Points { get; set; }
        public string Id { get; set; }

        public override string ToString() => $"{Id} - {Name}: {CoordX},{CoordY}";
        public CanyonRouteFetcher.CanyonRouteInfo RouteInfo { get; set; }
        public CanyonDescriptionFetcher.CanyonDescription Description { get; set; }
        public CanyonBooksFetcher.CanyonBooksInfo Books { get; set; }

        public class CanyonPointInfo
        {
            public string Type { get; set; }
            public string CoordX { get; set; }
            public string CoordY { get; set; }

            public override string ToString() => $"{Type}: {CoordX},{CoordY}";
        }
    }
}