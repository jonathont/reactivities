using System;
using System.Collections.Generic;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        
        public class Query : IRequest<List<Activity>>
        { }

        public class Handler : IRequestHandler<Query, List<Activity>>
        {
            private readonly ILogger<List> logger;

            public DataContext Context { get; }

            public Handler(DataContext context, ILogger<List> logger)
            {
                this.Context = context;
                this.logger = logger;
            }

            public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {

                // try
                // {
                //     for (var i = 0; i < 10; i++)
                //     {
                //         cancellationToken.ThrowIfCancellationRequested();
                //         await Task.Delay(1000);
                //         logger.LogInformation($"Task {i}");
                //     }
                // }
                // catch (Exception ex) when (ex is TaskCanceledException)
                // {
                //     logger.LogInformation($"Task was cancelled");
                // }

                return await this.Context.Activities.ToListAsync(cancellationToken);
            }
        }

    }
}