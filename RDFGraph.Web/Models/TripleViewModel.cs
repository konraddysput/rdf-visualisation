using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using VDS.RDF;

namespace RDFGraph.Web.Models
{
    public class TripleViewModel
    {
        public INode Subject { get; set; }
        public INode Predicate { get; set; }
        public INode Object { get; set; }

    }
}