using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using WhatsOnTap.Models;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Text;

namespace WhatsOnTap.Controllers
{
    [Route("api/[controller]")]
    public class ImageController : Controller
    {
        private readonly WhatsOnTapContext _context;

        public ImageController(WhatsOnTapContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> UploadLabel()
        { 
            Beer beer = _context.Beer.Where(b => b.id == 1).FirstOrDefault();
            using (var sr = new StreamReader(Request.Body))
            {
                var body  = await sr.ReadToEndAsync();
                beer.label = Encoding.ASCII.GetBytes(body);

                _context.Beer.Update(beer);
                _context.SaveChanges();
                return Ok();
            }

        }
    }
}