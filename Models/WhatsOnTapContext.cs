
using Microsoft.EntityFrameworkCore;

namespace WhatsOnTap.Models
{
    public class WhatsOnTapContext : DbContext
    {
        public WhatsOnTapContext(DbContextOptions<WhatsOnTapContext> options) : base(options)
        {
        }

        public DbSet<Beer> Beer { get; set; }
        public DbSet<Tap> Tap { get; set; }
        public DbSet<Style> Style { get; set; }
    }
}