using System.Collections.Generic;

namespace MyCanyon.Console
{
    public class CanyonInfo
    {
        public string Name { get; set; }
        public string CoordX { get; set; }
        public string CoordY { get; set; }
        public List<CanyonPointInfo> Points { get; set; }
        public string Id { get; set; }

        public class CanyonPointInfo
        {
            public string Type { get; set; }
            public string CoordX { get; set; }
            public string CoordY { get; set; }
        }
    }
}