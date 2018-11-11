using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using WhatsOnTap.Models;
using Microsoft.AspNetCore.Mvc;

namespace WhatsOnTap.Controllers
{
    [Route("api/[controller]")]
    public class StyleController : Controller
    {
        private readonly WhatsOnTapContext _context;

        public StyleController(WhatsOnTapContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<Style> GetAll()
        {
            return _context.Style.ToList();
        }

        [HttpGet("{id}")]
        public IActionResult GetById(long id)
        {
            var item = _context.Style.FirstOrDefault(t => t.id == id);
            if (item == null)
            {
                return NotFound();
            }
            return new ObjectResult(item);
        }
        
        [HttpPost]
        public IActionResult Create([FromBody] Style item)
        {
            if (item == null)
            {
                return BadRequest();
            }
            _context.Style.Add(item);
            _context.SaveChanges();

            return Ok( new { message= "Style added successfully."});
        }

        [HttpPut("{id}")]
        public IActionResult Update(long id, [FromBody] Style item)
        {
            if (item == null || id == 0)
            {
                return BadRequest();
            }

            var style = _context.Style.FirstOrDefault(t => t.id == id);
            if (style == null)
            {
                return NotFound();
            }

            foreach(PropertyInfo prop in item.GetType().GetProperties()){
                if (prop.Name != "id"){
                    prop.SetValue(style, prop.GetValue(item));
                }
            }

            _context.Style.Update(style);
            _context.SaveChanges();
            return Ok( new { message= "Style is updated successfully."});
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(long id)
        {
            var style = _context.Style.FirstOrDefault(t => t.id == id);
            if (style == null)
            {
                return NotFound();
            }

            _context.Style.Remove(style);
            _context.SaveChanges();
            return Ok( new { message= "Style is deleted successfully."});
        }
    }
}