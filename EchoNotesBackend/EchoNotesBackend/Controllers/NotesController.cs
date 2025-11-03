using EchoNotesBackend.Models;
using EchoNotesBackend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EchoNotesBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotesController : ControllerBase
    {
        private readonly INoteService _noteService;

        public NotesController(INoteService noteService)
        {
            _noteService = noteService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Note>>> GetNotes()
        {
            var notes = await _noteService.GetNotesAsync();
            return Ok(notes);
        }

        [HttpPost]
        public async Task<ActionResult<Note>> PostNote(CreateNoteDto createNoteDto)
        {
            var createdNote = await _noteService.CreateNoteAsync(createNoteDto);
            return CreatedAtAction(nameof(GetNotes), new { id = createdNote.Id }, createdNote);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNote(Guid id)
        {
            await _noteService.DeleteNoteAsync(id);
            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNote(Guid id, UpdateNoteDto updateNoteDto)
        {
            if (id != updateNoteDto.Id)
            {
                return BadRequest();
            }

            await _noteService.UpdateNoteAsync(id, updateNoteDto);
            return NoContent();
        }
    }
}
