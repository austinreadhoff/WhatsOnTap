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
    public class SettingController : Controller
    {
        private readonly WhatsOnTapContext _context;
        private readonly IHubContext<MenuHub> _menuHubContext;

        public SettingController(WhatsOnTapContext context, IHubContext<MenuHub> menuHubContext)
        {
            _context = context;
            _menuHubContext = menuHubContext;
        }

        [HttpGet]
        public IEnumerable<Setting> GetAll()
        {
            return _context.Setting.ToList();
        }

        [HttpGet("{id}")]
        public IActionResult GetById(long id)
        {
            var item = _context.Setting.FirstOrDefault(t => t.id == id);
            if (item == null)
            {
                return NotFound();
            }
            return new ObjectResult(item);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, [FromBody] Setting item)
        {
            if (item == null || id == 0)
            {
                return BadRequest();
            }

            var setting = _context.Setting.FirstOrDefault(t => t.id == id);
            if (setting == null)
            {
                return NotFound();
            }

            foreach(PropertyInfo prop in item.GetType().GetProperties()){
                if (prop.Name != "id"){
                    prop.SetValue(setting, prop.GetValue(item));
                }
            }

            _context.Setting.Update(setting);
            _context.SaveChanges();
            await _menuHubContext.Clients.All.SendAsync("MenuUpdated");
            return Ok( new { message= "Setting is updated successfully."});
        }

        [HttpPost("background")]
        public async Task<IActionResult> UploadBackground()
        {
            Setting backgroundSetting = _context.Setting.Where(s => s.key == "MenuBackground").FirstOrDefault();

            using (var ms = new MemoryStream())
            {
                var file = Request.Form.Files.FirstOrDefault();
                await file.CopyToAsync(ms);
                backgroundSetting.byteArrValue = ms.ToArray();

                _context.Setting.Update(backgroundSetting);
                _context.SaveChanges();
                await _menuHubContext.Clients.All.SendAsync("MenuUpdated");
                return Ok();
            }
        }
    }
}