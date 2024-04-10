import { makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../models/activity";
import agent from "../api/agent";
import { v4 as uuid } from 'uuid';


export default class ActivityStore {

    activityMap = new Map<string, Activity>();

    selectedActivity: Activity | undefined;
    editMode = false;
    loading = false;
    loadingInitial = true;
    
    get activitiesByDate() {
        return Array.from(this.activityMap.values())
                    .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    }

    constructor() {
        makeAutoObservable(this);

        // makeObservable(this, {
        //     title: observable,
        //     setTitle: action.bound            
        // });
    }

    loadActivities = async () => {
        this.loadingInitial = true;

        try {

            const activities = await agent.Activities.list();
            activities.forEach(a => {
                this.setActivity(a);
            });
            this.setLoadingInitial(false);

        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }

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
        activity.date = activity.date.split('T')[0];
        this.activityMap.set(activity.id, activity);
    }

    private getActivity = (id: string) => {
        return this.activityMap.get(id);
    }


    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    createActivity = async (activity: Activity) => {
        this.loading = true;
        activity.id = uuid();
        
        try {
            await agent.Activities.create(activity);

            runInAction(() => {
                //this.activities.push(activity);
                this.activityMap.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            });

            return activity.id;
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    updateActivity = async (activity: Activity) => {
        this.loading = true;

        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                //this.activities = [...this.activities.filter(a => a.id !== activity.id), activity];
                this.activityMap.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    deleteActivity = async (id: string) => {

        this.loading = true;
        try {
            await agent.Activities.delete(id);

            runInAction(() => {
                //this.activities = this.activities.filter(a => a.id !== id);
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

}