using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using WhatsOnTap.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SignalRWebPack.Hubs;

namespace WhatsOnTap.Controllers
{
    [Route("api/[controller]")]
    public class TapController : Controller
    {
        private readonly WhatsOnTapContext _context;
        private readonly IHubContext<MenuHub> _menuHubContext;

        public TapController(WhatsOnTapContext context, IHubContext<MenuHub> menuHubContext)
        {
            _context = context;
            _menuHubContext = menuHubContext;
        }

        [HttpGet]
        public IEnumerable<Tap> GetAll()
        {
            return _context.Tap.ToList();
        }

        [HttpGet("{id}")]
        public IActionResult GetById(long id)
        {
            var item = _context.Tap.FirstOrDefault(t => t.id == id);
            if (item == null)
            {
                return NotFound();
            }
            return new ObjectResult(item);
        }
        
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Tap item)
        {
            if (item == null)
            {
                return BadRequest();
            }
            _context.Tap.Add(item);
            _context.SaveChanges();
            await _menuHubContext.Clients.All.SendAsync("MenuUpdated");
            return Ok( new { message= "Tap added successfully."});
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, [FromBody] Tap item)
        {
            if (item == null || id == 0)
            {
                return BadRequest();
            }

            var tap = _context.Tap.FirstOrDefault(t => t.id == id);
            if (tap == null)
            {
                return NotFound();
            }

            foreach(PropertyInfo prop in item.GetType().GetProperties()){
                if (prop.Name != "id"){
                    prop.SetValue(tap, prop.GetValue(item));
                }
            }

            _context.Tap.Update(tap);
            _context.SaveChanges();
            await _menuHubContext.Clients.All.SendAsync("MenuUpdated");
            return Ok( new { message= "Tap is updated successfully."});
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            var tap = _context.Tap.FirstOrDefault(t => t.id == id);
            if (tap == null)
            {
                return NotFound();
            }

            _context.Tap.Remove(tap);
            _context.SaveChanges();
            await _menuHubContext.Clients.All.SendAsync("MenuUpdated");
            return Ok( new { message= "Tap is deleted successfully."});
        }
    }
}