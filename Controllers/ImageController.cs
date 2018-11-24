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
        public async Task<IActionResult> UploadLabel(int id)
        { 
            Beer beer = _context.Beer.Where(b => b.id == id).FirstOrDefault();

            using (var ms = new MemoryStream())
            {
                var file = Request.Form.Files.FirstOrDefault();
                await file.CopyToAsync(ms);
                beer.label = ms.ToArray();

                _context.Beer.Update(beer);
                _context.SaveChanges();
                return Ok();
            }
        }
    }
}