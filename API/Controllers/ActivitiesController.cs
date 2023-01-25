using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {

        [HttpGet]
        public async Task<ActionResult<List<Activity>>> GetActivities(CancellationToken ct)
        {            
            return await this.Mediator.Send(new Application.Activities.List.Query(), ct);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> GetActivity(Guid id)
        {
            return await this.Mediator.Send(new Application.Activities.Details.Query{ Id = id });
        }

        [HttpPost]
        public async Task<IActionResult> CreateActivity(Activity activity)
        {
            return Ok(await this.Mediator.Send(new Application.Activities.Create.Command{Activity = activity}));            
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid id, Activity activity)
        {
            activity.Id = id;
            return Ok(await Mediator.Send(new Application.Activities.Edit.Command{Activity = activity}));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            return Ok(await Mediator.Send(new Application.Activities.Delete.Command{ Id = id }));
        }

    }
}