using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Mobels;
using DatingApp.API.models;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DatingRepository : IDatingRepository

    {
        private readonly DataContext _context;
        public DatingRepository(DataContext context)
        {
            _context = context;
        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _context.Photos.FirstOrDefaultAsync(p => p.id == id);
            return photo;
        }

        public async Task<User> GetUser(int id)
        {
            var user = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.Id == id);
            return user;

        }

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            var users = _context.Users.Include(p => p.Photos).OrderByDescending(u => u.LastActive).AsQueryable();
            users = users.Where(u => u.Id != userParams.UserId);
            users = users.Where(u => u.Gender == userParams.Gender);
            if (userParams.Likers)
            {
                var userLikers = await GetUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(x => userLikers.Contains(x.Id));
            }

            if (userParams.Likees)
            {
                var userLikees = await GetUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(x => userLikees.Contains(x.Id));
            }
            if (userParams.MinAge != 18 || userParams.MaxAge != 99)
            {
                var minDob = DateTime.Today.AddYears(-userParams.MaxAge - 1);
                var maxDob = DateTime.Today.AddYears(-userParams.MinAge);
                users = users.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);
            }
            if (!string.IsNullOrEmpty(userParams.OrderBy))
            {
                switch (userParams.OrderBy)
                {
                    case "created":
                        users = users.OrderByDescending(u => u.Created);
                        break;
                    default:
                        users = users.OrderByDescending(u => u.LastActive);
                        break;
                }
            }
            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }
        private async Task<IEnumerable<int>> GetUserLikes(int id, bool likers)
        {
            var user = await _context.Users
            .Include(x => x.Likers)
            .Include(x => x.Likees)
            .FirstOrDefaultAsync(x => x.Id == id);

            if (likers)
            {
                return user.Likers.Where(x => x.LikeeId == id).Select(x => x.LikerId);
            }
            else
            {
                return user.Likees.Where(x => x.LikerId == id).Select(x => x.LikeeId);
            }
        }
        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }
        public async Task<Photo> GetMainPhotoForUser(int userId)
        {
            return await _context.Photos.Where(u => u.UserId == userId).FirstOrDefaultAsync(p => p.IsMain);
        }

        public Task<Like> GetLike(int userId, int recipientId)
        {
            return _context.Likes.FirstOrDefaultAsync(u =>
             u.LikerId == userId && u.LikeeId == recipientId);
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FirstOrDefaultAsync(m => m.Id == id);
        }

        // public Task<PagedList<Message>> GetMessagesForUser()
        // {
        //     throw new NotImplementedException();
        // }

        public async Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId)
        {
            var messages = await _context.Messages
           .Include(u => u.Sender).ThenInclude(p => p.Photos)
           .Include(u => u.Recipent).ThenInclude(p => p.Photos)
           .Where(m => m.RecipentId == userId && m.RecipentDeleted == false && m.SenderId == recipientId
            || m.RecipentId == recipientId && m.SenderId == userId && m.SenderDeleted == false)
            .OrderByDescending(m => m.MessageSent)
            .ToListAsync();

            return messages;
        }

        public async Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams)
        {
            var messages = _context.Messages
            .Include(u => u.Sender).ThenInclude(p => p.Photos)
            .Include(u => u.Recipent).ThenInclude(p => p.Photos)
            .AsQueryable();

            switch (messageParams.MessageContainer)
            {
                case "Inbox":
                    messages = messages.Where(u => u.RecipentId == messageParams.UserId 
                    && u.RecipentDeleted == false);
                    break;
                case "Outbox":
                    messages = messages.Where(u => u.SenderId == messageParams.UserId 
                    && u.SenderDeleted == false);
                    break;
                default:
                    messages = messages.Where(u => u.RecipentId == messageParams.UserId && u.RecipentDeleted == false && u.IsRead == false);
                    break;
            }
            messages = messages.OrderByDescending(d => d.MessageSent);
            return await PagedList<Message>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
        }
    }
}