﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GibsonsLeague.Core.Models
{
    public class User
    {
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string AuthProvider { get; set; }
    }
}
