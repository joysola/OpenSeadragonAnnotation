
using SqlSugar;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain
{
    public class AnnoMark
    {
        [SugarColumn(IsPrimaryKey = true, IsIdentity = true)]
        public int ID { get; set; }
        [SugarColumn(IsNullable = false)]
        public string guid { get; set; }
        [SugarColumn(IsNullable = false)]
        public string type { get; set; }
        public string version { get; set; }
        public string originX { get; set; }
        public string originY { get; set; }
        public double left { get; set; }
        public double top { get; set; }
        public double width { get; set; }
        public double height { get; set; }
        public string fill { get; set; }
        public string stroke { get; set; }
        public double strokeWidth { get; set; }
        //public string strokeDashArray { get; set; }
        public string strokeLineJoin { get; set; }
        public double strokeMiterLimit { get; set; }
        public double scaleX { get; set; }
        public double scaleY { get; set; }
        public double angle { get; set; }
        public bool flipX { get; set; }
        public bool flipY { get; set; }
        public double opacity { get; set; }
        //public int shadow { get; set; }
        public bool visible { get; set; }
        public string backgroundColor { get; set; }
        public string fillRule { get; set; }
        public string paintFirst { get; set; }
        public string globalCompositeOperation { get; set; }
        public int skewX { get; set; }
        public int skewY { get; set; }
        public int rx { get; set; }
        public int ry { get; set; }

    }
}
