using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.Dtos
{
    public class UserForRegisterDto
    {
        [Required]
        public string Username { get; set; }
         [Required]
        // [StringLength(4, ErrorMessage = "The Password was to short.")]  
        public string Password { get; set; }

    }
}


