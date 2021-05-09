using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyCanyon.Console.CanyonInfoLoading
{
    public static class CanyonInfoFetcher
    {
        public static List<CanyonInfo> FetchCanyonInfo(List<CanyonCsvLoader.CanyonCsvInfo> canyons, CanyonInfoConfig config)
        {
            var canyonInfos = canyons
                .Select(canyon => new CanyonInfo
                {
                    Id = canyon.Id,
                    Name = canyon.Name,
                    CoordX = canyon.CoordX,
                    CoordY = canyon.CoordY,
                    Distance = GetDistance(canyon.CoordX, canyon.CoordY, config.CenterX, config.CenterY)
                })
                //.OrderBy(x => x.Distance)
                .Take(config.Amount)
                .ToList();

            Parallel.ForEach(canyonInfos, canyon =>
            {
                canyon.Points = CanyonPointsFetcher.FetchCanyonPoints(canyon, config.DescentecanyonMapTemplate, config.PointPathTemplate).Result.Select(x => new CanyonInfo.CanyonPointInfo
                {
                    Type = x.Type,
                    CoordX = x.CoordX,
                    CoordY = x.CoordY
                }).ToList();
                //canyon.RouteInfo = CanyonRouteFetcher.FetchCanyonRoute(canyon, config, config.GoogleMapsDistanceApiTemplate, config.RoutePathTemplate).Result;
                canyon.Description = CanyonDescriptionFetcher.FetchCanyonDescription(canyon, config.DescentecanyonDescriptionTemplate, config.ResumePathTemplate).Result;
                canyon.Books = CanyonBooksFetcher.FetchCanyonBooks(canyon, config, config.DescentecanyonBibliographieTemplate, config.BooksPathTemplate).Result;
            });

            return canyonInfos;
        }

        private static double GetDistance(double lat1, double lon1, double lat2, double lon2)
        {
            var lat1Rad = lat1 * Math.PI / 180;
            var lat2Rad = lat2 * Math.PI / 180;
            var latDRad = (lat2 - lat1) * Math.PI / 180;
            var lonDRad = (lon2 - lon1) * Math.PI / 180;

            var a = Math.Pow(Math.Sin(latDRad / 2), 2) + Math.Cos(lat1Rad) * Math.Cos(lat2Rad) * Math.Pow(Math.Sin(lonDRad / 2), 2);
            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return c * 6371000;
        }
    }
}