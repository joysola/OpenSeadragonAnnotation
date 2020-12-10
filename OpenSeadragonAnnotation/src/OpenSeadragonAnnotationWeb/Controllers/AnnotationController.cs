using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OpenSeadragonAnnotationWeb.Controllers
{
    public class AnnotationController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<bool> StoreAnno()
        {
            var result = false;
            return result;
        }
    }
}
