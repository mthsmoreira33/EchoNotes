
using EchoNotesBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace EchoNotesBackend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Note> Notes { get; set; }
    }
}
