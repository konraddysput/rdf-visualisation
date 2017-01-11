using RDFGraph.Web.Models;
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
        public static IEnumerable<TripleViewModel> GetTriples(Uri uri)
        {
            IGraph graph = new Graph();
            UriLoader.Load(graph, uri);

            return graph.Triples.Take(200).Select(n => new TripleViewModel()
            {
                Subject = n.Subject.ToString(),
                Predicate = n.Predicate.ToString(),
                Object = n.Object.ToString()
            });
        }
    }
}