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

        public async Task<Note> CreateNoteAsync(CreateNoteDto createNoteDto)
        {
            var note = new Note
            {
                Title = createNoteDto.Title,
                Content = createNoteDto.Content
            };

            _context.Notes.Add(note);
            await _context.SaveChangesAsync();
            return note;
        }

        public async Task UpdateNoteAsync(Guid id, UpdateNoteDto updateNoteDto)
        {
            var note = await _context.Notes.FindAsync(id);
            if (note == null)
            {
                // This case should ideally be handled by the controller, but for robustness
                throw new KeyNotFoundException($"Note with ID {id} not found.");
            }

            note.Title = updateNoteDto.Title;
            note.Content = updateNoteDto.Content;

            _context.Entry(note).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteNoteAsync(Guid id)
        {
            var note = await _context.Notes.FindAsync(id);
            if (note == null)
            {
                throw new KeyNotFoundException($"Note with ID {id} not found.");
            }

            _context.Notes.Remove(note);
            await _context.SaveChangesAsync();
        }
    }
}
