using System;

namespace WhatsOnTap.Models
{
    public class Beer
    {
        public long? id { get; set; }
        public string name { get; set; }
        public int styleId {get;set;}
        public double abv {get;set;}
        public double ibu {get;set;}
        public double og {get;set;}
        public double fg {get;set;}
        public double srm {get;set;}
        public string description {get;set;}
        public byte[] label {get;set;}
    }
}