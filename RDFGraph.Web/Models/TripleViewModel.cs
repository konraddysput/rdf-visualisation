using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using VDS.RDF;

namespace RDFGraph.Web.Models
{
    public class TripleViewModel
    {
        public string Subject { get; set; }
        public string Predicate { get; set; }
        public string Object { get; set; }

    }
}