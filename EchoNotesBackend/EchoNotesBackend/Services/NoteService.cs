using EchoNotesBackend.Data;
using EchoNotesBackend.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EchoNotesBackend.Services
{
    public class NoteService : INoteService
    {
        private readonly ApplicationDbContext _context;

        public NoteService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Note>> GetNotesAsync()
        {
            return await _context.Notes.ToListAsync();
        }

        public async Task<Note> CreateNoteAsync(NoteDto noteDto)
        {
            var note = new Note
            {
                Title = noteDto.Title,
                Content = noteDto.Content
            };

            _context.Notes.Add(note);
            await _context.SaveChangesAsync();
            return note;
        }
    }
}
