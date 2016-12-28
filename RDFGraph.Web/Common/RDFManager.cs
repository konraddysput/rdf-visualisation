using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using VDS.RDF;
using VDS.RDF.Parsing;

namespace RDFGraph.Web.Common
{
    public static class RDFManager
    {
        public static IEnumerable<Triple> GetTriples(Uri uri)
        {
            IGraph graph = new Graph();
            UriLoader.Load(graph, new Uri("http://dbpedia.org/resource/Barack_Obama"));
            return graph.Triples;
        }
    }
}