using System;

namespace WhatsOnTap.Models
{
    public class Setting
    {
        public long? id { get; set; }
        public string key { get; set; }
        public string type {get;set;}
        public string stringValue {get;set;}
        public int intValue {get;set;}
        public bool boolValue {get;set;}
        public byte[] byteArrValue {get;set;}
    }
}