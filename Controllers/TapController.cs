
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using WhatsOnTap.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
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
            return _context.Tap
                .Include(t => t.beer).ThenInclude(b => b.style)
                .Include(t => t.beer).ThenInclude(b => b.label)
                .ToList();
        }

        [HttpGet("{id}")]
        public IActionResult GetById(long id)
        {
            var item = _context.Tap
                .Where(t => t.id == id)
                .Include(t => t.beer).ThenInclude(b => b.style)
                .Include(t => t.beer).ThenInclude(b => b.label)
                .FirstOrDefault();
            if (item == null)
            {
                return NotFound();
            }
            return new ObjectResult(item);
        }

        [HttpGet]
        [Route("GetCount")]
        public int GetCount()
        {
            return _context.Tap.Count();
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

            ReorderTapsOnAddEdit(item);
            _context.SaveChanges();

            item.beer = _context.Beer
                .Where(b => b.id == item.beerId)
                .Include(b => b.style)
                .Include(b => b.label)
                .FirstOrDefault();

            await _menuHubContext.Clients.All.SendAsync("TapCreated", item);
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
            
            if (item.beer.id != item.beerId){
                item.beer = _context.Beer
                    .Where(b => b.id == item.beerId)
                    .Include(b => b.style)
                    .Include(b => b.label)
                    .FirstOrDefault();
            }

            foreach(PropertyInfo prop in item.GetType().GetProperties()){
                if (prop.Name != "id"
                    && prop.Name != "beer")
                {
                    prop.SetValue(tap, prop.GetValue(item));
                }
            }

            _context.Tap.Update(tap);
            _context.SaveChanges();

            ReorderTapsOnAddEdit(tap);
            _context.SaveChanges();

            await _menuHubContext.Clients.All.SendAsync("TapUpdated", item);
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
            ReorderTapsOnDelete(id);
            _context.SaveChanges();

            await _menuHubContext.Clients.All.SendAsync("TapDeleted", id);
            return Ok( new { message= "Tap is deleted successfully."});
        }

        #region private helpers
        
        private void ReorderTapsOnAddEdit(Tap editedTap)
        {
            if (_context.Tap.Count(t => t.order == editedTap.order) > 1)
            {
                List<Tap> taps = _context.Tap.OrderBy(t => t.order).ToList();
                taps.Remove(editedTap);
                taps.Insert(editedTap.order-1, editedTap);

                for(int i=0; i<taps.Count; i++)
                {
                    taps[i].order = i+1;
                    _context.Tap.Update(taps[i]);
                }
            }
        }

        private void ReorderTapsOnDelete(long deletedId)
        {
            List<Tap> taps = _context.Tap
            .Where(t => t.id != deletedId)
            .OrderBy(t => t.order)
            .ToList();

            for(int i=0; i<taps.Count; i++)
            {
                taps[i].order = i+1;
                _context.Tap.Update(taps[i]);
            }
        }

        #endregion
    }
}