using EchoNotesBackend.Models;
using Microsoft.AspNetCore.Mvc;

namespace EchoNotesBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotesController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetNotes()
        {
            var notes = new List<Note>
            {
                new Note { Id = "1", Title = "First Note", Content = "This is the first note from the backend." },
                new Note { Id = "2", Title = "Second Note", Content = "This is the second note." }
            };
            return Ok(notes);
        }
    }
}
