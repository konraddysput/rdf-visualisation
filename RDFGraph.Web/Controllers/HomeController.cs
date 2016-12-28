using RDFGraph.Web.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace RDFGraph.Web.Controllers
{
    [RoutePrefix("")]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [Route("Read")]
        public ActionResult ReadData(string url)
        {
            if (string.IsNullOrEmpty(url))
            {
                url = "http://dbpedia.org/resource/Barack_Obama";
            }
            Uri uri;
            if (!Uri.TryCreate(url, UriKind.Absolute, out uri))
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest, "Invalid url adres");
            }
            return Json(RDFManager.GetTriples(uri), JsonRequestBehavior.AllowGet);


        }

    }
}