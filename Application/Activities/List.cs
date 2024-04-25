using System;
using System.Collections.Generic;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        
        public class Query : IRequest<Result<List<ActivityDto>>>
        { }

        public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>
        {
            public DataContext Context { get; }
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                this._mapper = mapper;
                this.Context = context;
            }

            public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activities = await this.Context.Activities
                                        // .Include(a => a.Attendees)
                                        // .ThenInclude(u => u.AppUser)
                                        .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider) 
                                        .ToListAsync(cancellationToken);

                // .ProjectTo is an automapper extension for  cleaner alternative to eager loading (.include)
                // manually would be done via .select()

                //var activityDtos = _mapper.Map<List<ActivityDto>>(activities);

                return Result<List<ActivityDto>>.Success(activities);
            }
        }

    }
}