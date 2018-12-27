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
    public class BeerController : Controller
    {
        private readonly WhatsOnTapContext _context;
        private readonly IHubContext<MenuHub> _menuHubContext;

        public BeerController(WhatsOnTapContext context, IHubContext<MenuHub> menuHubContext)
        {
            _context = context;
            _menuHubContext = menuHubContext;
        }

        [HttpGet]
        public IEnumerable<Beer> GetAll()
        {
            return _context.Beer.ToList();
        }

        [HttpGet("{id}")]
        public IActionResult GetById(long id)
        {
            var item = _context.Beer.FirstOrDefault(t => t.id == id);
            if (item == null)
            {
                return NotFound();
            }
            return new ObjectResult(item);
        }
        
        [HttpPost]
        public IActionResult Create([FromBody] Beer item)
        {
            if (item == null)
            {
                return BadRequest();
            }
            _context.Beer.Add(item);
            _context.SaveChanges();

            return Ok( new { message= "Beer added successfully."});
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, [FromBody] Beer item)
        {
            if (item == null || id == 0)
            {
                return BadRequest();
            }

            var beer = _context.Beer.FirstOrDefault(t => t.id == id);
            if (beer == null)
            {
                return NotFound();
            }

            foreach(PropertyInfo prop in item.GetType().GetProperties()){
                if (prop.Name != "id"){
                    prop.SetValue(beer, prop.GetValue(item));
                }
            }

            _context.Beer.Update(beer);
            _context.SaveChanges();
            await _menuHubContext.Clients.All.SendAsync("MenuUpdated");
            return Ok( new { message= "Beer is updated successfully."});
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(long id)
        {
            var beer = _context.Beer.FirstOrDefault(t => t.id == id);
            if (beer == null)
            {
                return NotFound();
            }

            _context.Beer.Remove(beer);
            _context.SaveChanges();
            return Ok( new { message= "Beer is deleted successfully."});
        }

        [HttpPost("label")]
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
                await _menuHubContext.Clients.All.SendAsync("MenuUpdated");
                return Ok();
            }
        }
    }
}