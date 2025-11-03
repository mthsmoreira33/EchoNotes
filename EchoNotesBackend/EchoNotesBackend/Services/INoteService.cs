using EchoNotesBackend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EchoNotesBackend.Services
{
    public interface INoteService
    {
        Task<IEnumerable<Note>> GetNotesAsync();
        Task<Note> CreateNoteAsync(CreateNoteDto createNoteDto);
        Task UpdateNoteAsync(Guid id, UpdateNoteDto updateNoteDto);
        Task DeleteNoteAsync(Guid id);
    }
}
