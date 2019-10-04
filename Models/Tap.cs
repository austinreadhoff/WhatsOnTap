using System;

namespace WhatsOnTap.Models
{
    public class Tap
    {
        public long? id { get; set; }
        public int order { get; set; }
        public Beer beer {get;set;}
        public long beerId {get;set;}
        public bool isEmpty {get;set;}
    }
}