using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Delete
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext dataContext;

            public Handler(DataContext dataContext)
            {
                this.dataContext = dataContext;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {            
                var activity = await this.dataContext.FindAsync<Activity>(request.Id);
                if (activity != null)
                    this.dataContext.Remove<Activity>(activity);

                await this.dataContext.SaveChangesAsync();
                
                return Unit.Value;
            }
        }


    }
}