﻿using System;

namespace KafktaListener.Models
{
    public class SodHolding
    {
        public string Key => $"{Security}-{Custodian}-{DisplayPurchaseDate}";
        public int TradingDay { get; set; }

        public string Security { get; set; }
        public string Custodian { get; set; }

        public DateTime? PurchaseDate { get; set; }
        public string DisplayPurchaseDate => PurchaseDate?.ToString("yyyy MMMM dd") ?? "Today";

        public decimal SodAmount { get; set; }
        public decimal TargetAmount { get; set; }
        public decimal SodPrice { get; set; }
        public decimal CostBasis { get; set; }
    }

    public class SodHoldingsMessage
    {
        public string Type { get; set; }
        public SodHolding[] Data { get; set; }
    }
}
