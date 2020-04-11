using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.Dtos
{
    public class UserForRegisterDto
    {
        [Required]
        public string Username { get; set; }
         [Required]
      
        // [MaxLength(20, ErrorMessage="Password must be 10 characters or less"),MinLength(5)] 
        public string Password { get; set; }

    }
}


