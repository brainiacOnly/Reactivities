using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ProfileReader : IProfileReader
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;

        public ProfileReader(DataContext dataContext, IUserAccessor userAccessor)
        {
            this._userAccessor = userAccessor;
            this._context = dataContext;
        }

        public async Task<Profile> ReadProfile(string username)
        {
            var user = await _context.Users.SingleOrDefaultAsync(i => i.UserName == username);
            if (user == null)
                throw new RestException(HttpStatusCode.NotFound, new {User = "Not found"});

            var currentUser = await _context.Users.SingleOrDefaultAsync(i => i.UserName == _userAccessor.GetCurrentUsername());
            var profile = new Profile
                {
                    Username = user.UserName,
                    DisplayName = user.DisplayName,
                    Image = user.Photos.FirstOrDefault(i => i.IsMain)?.Url,
                    Photos = user.Photos,
                    Bio = user.Bio,
                    FollowersCount = user.Followers.Count(),
                    FollowingCount = user.Followings.Count()
                };
            
            if (currentUser.Followings.Any(i => i.TargetId == user.Id))
                profile.IsFollowed = true;

            return profile;
        }
    }
}