using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;
using Persistence;

namespace Infrastructure.Security
{
    public class IsHostRequirement : IAuthorizationRequirement
    {

    }

    public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly DataContext _dataContext;

        public IsHostRequirementHandler(IHttpContextAccessor httpContextAccessor, DataContext dataContext)
        {
            this._dataContext = dataContext;
            this._httpContextAccessor = httpContextAccessor;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
        {
            if (context.Resource is AuthorizationFilterContext authContext)
            {
                var currentUserName = _httpContextAccessor.HttpContext.User?.Claims?.SingleOrDefault(i => i.Type == ClaimTypes.NameIdentifier)?.Value;
                var activityId = Guid.Parse(authContext.RouteData.Values["id"].ToString());
                var activity = _dataContext.Activities.Find(activityId);
                var host = activity.UserActivities.FirstOrDefault(i => i.IsHost);
                if (host?.AppUser?.UserName == currentUserName)
                {
                    context.Succeed(requirement);
                }
            } 
            else 
            {
                context.Fail();
            }

            return Task.CompletedTask;
        }
    }
}