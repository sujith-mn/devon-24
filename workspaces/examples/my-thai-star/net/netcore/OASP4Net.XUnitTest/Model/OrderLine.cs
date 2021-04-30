﻿using System;
using System.Collections.Generic;

namespace OASP4Net.Test.Model
{
    public partial class OrderLine
    {
        public OrderLine()
        {
            OrderDishExtraIngredient = new HashSet<OrderDishExtraIngredient>();
        }

        public long Id { get; set; }
        public long IdDish { get; set; }
        public long? Amount { get; set; }
        public string Comment { get; set; }
        public long IdOrder { get; set; }

        public Dish IdDishNavigation { get; set; }
        public Order IdOrderNavigation { get; set; }
        public ICollection<OrderDishExtraIngredient> OrderDishExtraIngredient { get; set; }
    }
}
