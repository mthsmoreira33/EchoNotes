using EchoNotesBackend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EchoNotesBackend.Services
{
    public interface INoteService
    {
        Task<IEnumerable<Note>> GetNotesAsync();
        Task<Note> CreateNoteAsync(NoteDto noteDto);
    }
}
