using Aspose.ThreeD;
using Aspose.ThreeD.Formats;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using WebApp3d.Models;

namespace WebApp3d.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult ConverFile(IFormFile stl)
        {
            var document = new Scene();
            var stream = stl.OpenReadStream();
            //StreamReader streamReader = new StreamReader(stream);
            //string text = streamReader.ReadToEnd();
            document.Open(stream);
            document.Save("Document.fbx", new FBXSaveOptions(FileFormat.FBX6100ASCII));
            return null;
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
