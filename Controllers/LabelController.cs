using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using WhatsOnTap.Models;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using Microsoft.AspNetCore.SignalR;
using SignalRWebPack.Hubs;

namespace WhatsOnTap.Controllers
{
    [Route("api/[controller]")]
    public class LabelController : Controller
    {
        private readonly WhatsOnTapContext _context;
        private readonly IHubContext<MenuHub> _menuHubContext;

        public LabelController(WhatsOnTapContext context, IHubContext<MenuHub> menuHubContext)
        {
            _context = context;
            _menuHubContext = menuHubContext;
        }

        [HttpGet]
        public IEnumerable<Label> GetAll()
        {
            return _context.Label.ToList();
        }

        [HttpPost("label")]
        public async Task<IActionResult> UploadLabel(int beerId)
        {
            Beer beer = _context.Beer.Where(b => b.id == beerId).FirstOrDefault();

            using (var ms = new MemoryStream())
            {
                var file = Request.Form.Files.FirstOrDefault();
                await file.CopyToAsync(ms);
                Label label = new Label()
                {
                    image = ms.ToArray(),
                    extension = file.FileName.Substring(file.FileName.LastIndexOf('.')+1)
                };

                Label oldLabel = _context.Label.Where(l => l.id == beer.labelId).FirstOrDefault();
                if (oldLabel != null)
                {   
                    _context.Label.Remove(oldLabel);
                }
                _context.Label.Add(label);
                _context.SaveChanges();

                beer.labelId = label.id.Value;
                _context.Beer.Update(beer);
                _context.SaveChanges();

                await _menuHubContext.Clients.All.SendAsync("LabelUpdated", label, beerId);
                return Ok();
            }
        }
    }
}