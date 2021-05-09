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

    public class CanyonInfoLight
    {
        public CanyonInfoLight(CanyonInfo info)
        {
            Id = info.Id;
            Name = info.Name;
            Coord = new []{ info.CoordX, info.CoordY };
            Points = info.Points.Select(x => new CanyonPointInfoLight { Type = x.Type, Coord = new [] { x.CoordX, x.CoordY }}).ToArray();
            Score = info.Description.Score;
            Alti = info.Description.AltitudeDeparture;
            Diff = info.Description.HeightDifference;
            Length = info.Description.Length;
            Max = info.Description.MaxWaterfall;
            Quotation = info.Description.Quotation;
            Rope = info.Description.RopeLength;
            Navette = info.Description.Navette;
        }

        public string Id { get; set; }
        public string Name { get; set; }
        public double[] Coord { get; set; }
        public CanyonPointInfoLight[] Points { get; set; }
        public double? Score { get; set; }
        public string Alti { get; set; }
        public string Diff { get; set; }
        public string Length { get; set; }
        public string Max { get; set; }
        public string Quotation { get; set; }
        public string Rope { get; set; }
        public string Navette { get; set; }
    }

    public class CanyonPointInfoLight
    {
        public string Type { get; set; }
        public string[] Coord { get; set; }
    }
}