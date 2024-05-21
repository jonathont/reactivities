import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Activity, ActivityFormValues } from "../models/activity";
import agent from "../api/agent";
import { v4 as uuid } from 'uuid';
import { format } from "date-fns";
import { store } from "./store";
import { Profile } from "../models/profile";
import { Pagination, PagingParams } from "../models/pagination";


export default class ActivityStore {

    activityMap = new Map<string, Activity>();

    selectedActivity: Activity | undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;

    pagination: Pagination | null = null;
    pagingParams = new PagingParams();
    predicate = new Map().set('all', true);


    constructor() {
        makeAutoObservable(this);

        reaction(() => this.predicate.keys(),
            () => {
                this.pagingParams = new PagingParams();
                this.activityMap.clear();
                this.loadActivities();
            });
    }


    get activitiesByDate() {
        return Array.from(this.activityMap.values())
            .sort((a, b) => a.date!.getTime() - b.date!.getTime());
    }

    get groupedActivitiesByDate() {
        let l = Object.entries(
            this.activitiesByDate.reduce((activities, activity) => {
                const date = format(activity.date!, 'dd MM yyyy');

                ////activities[date] = activities[date] ? [...activities[date], activity] : [activity];

                if (activities[date])
                    activities[date].push(activity);
                else
                    activities[date] = [activity];

                return activities;
            }, {} as { [key: string]: Activity[] })
        );

        return l;
    }

    get axiosParams() {
        const params = new URLSearchParams();
        params.append('pageNumber', this.pagingParams.pageNumber.toString());
        params.append('pageSize', this.pagingParams.pageSize.toString());

        this.predicate.forEach((value, key) => {
            if (key === 'startDate')
                params.append(key, new Date((value as Date).valueOf() - (value as Date).getTimezoneOffset() * 60 * 1000).toISOString());
            else
                params.append(key, value);
        });

        return params;
    }

    setPredicate = (predicate: string, value?: string | Date) => {
        const resetPredicate = () => {
            this.predicate.forEach((value, key) => {
                if (key !== 'startDate') this.predicate.delete(key);
            });
        };

        switch (predicate) {
            case 'all':
                resetPredicate();
                this.predicate.set('all', true);
                break;
            case 'isGoing':
                resetPredicate();
                this.predicate.set('isGoing', true);
                break;
            case 'isHost':
                resetPredicate();
                this.predicate.set('isHost', true);
                break;
            case 'startDate':
                this.predicate.delete('startDate');
                this.predicate.set('startDate', value);
                break;
        }

    };

    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    };

    loadActivities = async () => {
        this.setLoadingInitial(true);

        try {

            const result = await agent.Activities.list(this.axiosParams);

            result.data.forEach(a => {
                this.setActivity(a);
            });

            this.setPagination(result.pagination);
            this.setLoadingInitial(false);

        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }

    };

    setPagination = (pagination: Pagination) => {
        this.pagination = pagination;
    }

    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity)
            this.selectedActivity = activity;
        else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                runInAction(() => {
                    this.setActivity(activity!);
                    this.selectedActivity = activity;
                    this.setLoadingInitial(false);
                });
            } catch (error) {
                console.log(error);
                runInAction(() => {
                    this.setLoadingInitial(false);
                });
            }
        }

        return activity;
    }

    private setActivity = (activity: Activity) => {
        const user = store.userStore.user;
        if (user) {
            activity.isGoing = activity.attendees!.some(
                a => a.username === user.username
            );
            activity.isHost = activity.hostUsername === user?.username;
        }

        activity.host = activity.attendees?.find(x => x.username === activity.hostUsername);

        activity.date = new Date(activity.date!);
        this.activityMap.set(activity.id, activity);
    }

    private getActivity = (id: string) => {
        return this.activityMap.get(id);
    }


    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    createActivity = async (activity: ActivityFormValues) => {
        const user = store.userStore.user;
        const attendee = new Profile(user!);

        try {
            activity.id = uuid();
            await agent.Activities.create(activity);
            const newActivity = new Activity(activity);
            newActivity.hostUsername = user!.username;
            newActivity.attendees = [attendee];

            this.setActivity(newActivity);

            runInAction(() => {
                this.selectedActivity = newActivity;
                //this.activityMap.set(newActivity.id, activity);
            });

            return newActivity.id;
        } catch (error) {
            console.log(error);
        }
    }

    updateActivity = async (activity: ActivityFormValues) => {

        try {
            await agent.Activities.update(activity);
            runInAction(() => {

                if (activity.id) {
                    let updatedActivity = <Activity>{ ...this.getActivity(activity.id), ...activity };
                    this.activityMap.set(activity.id, updatedActivity);
                    this.selectedActivity = updatedActivity;
                }

            });
        } catch (error) {
            console.log(error);
        }
    }

    deleteActivity = async (id: string) => {

        this.loading = true;
        try {
            await agent.Activities.delete(id);

            runInAction(() => {
                this.activityMap.delete(id);
                this.loading = false;
            });

        } catch (error) {
            console.log(error);

            runInAction(() => {
                this.loading = false;
            });
        }
    };

    updateAttendance = async () => {
        const user = store.userStore.user;
        this.loading = true;
        try {

            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                if (this.selectedActivity?.isGoing) {
                    this.selectedActivity.attendees =
                        this.selectedActivity.attendees?.filter(a => a.username !== user?.username);
                    this.selectedActivity.isGoing = false;
                } else {
                    const attendee = new Profile(user!);
                    this.selectedActivity?.attendees?.push(attendee);
                    this.selectedActivity!.isGoing = true;
                }

                this.activityMap.set(this.selectedActivity!.id, this.selectedActivity!);
            });

        } catch (error) {
            console.log(error)
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    // Not too sure about this design of using 'this.selectedActivity' vs passing activity
    cancelActivityToggle = async () => {
        this.loading = true;

        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled;
                this.activityMap.set(this.selectedActivity!.id, this.selectedActivity!);
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.loading = false;
            })
        }

    }

    updateProfileMainImage = (username: string, imageUrl: string) => {
        this.activityMap.forEach((a, key) => {
            if (a.hostUsername === username && a.host)
                a.host.image = imageUrl;
            if (a.attendees)
                a.attendees.forEach(at => {
                    if (at.username === username)
                        at.image = imageUrl;
                });
        });
    };

    clearSelectedActivity = () => {
        this.selectedActivity = undefined;
    };

    updateAttendeeFollowing = (username: string) => {
        this.activityMap.forEach(activity => {
            activity.attendees.forEach(attendee => {
                if (attendee.username === username) {
                    attendee.following ? attendee.followersCount-- : attendee.followersCount++;
                    attendee.following = !attendee.following;
                }
            });
        })

    };

}