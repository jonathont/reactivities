using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>?>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>?>
        {
            private readonly DataContext dataContext;

            public Handler(DataContext dataContext)
            {
                this.dataContext = dataContext;
            }

            public async Task<Result<Unit>?> Handle(Command request, CancellationToken cancellationToken)
            {            
                var activity = await this.dataContext.FindAsync<Activity>(request.Id);
                if (activity != null)
                    this.dataContext.Remove<Activity>(activity);
                else
                    return null;

                var result = await this.dataContext.SaveChangesAsync() > 0;
                
                if (!result)
                    return Result<Unit>.Failure("Failed to delete activity");

                return Result<Unit>.Success(Unit.Value);
            }
        }


    }
}