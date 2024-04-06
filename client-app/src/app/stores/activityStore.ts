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
        
        try {

            const activities = await agent.Activities.list();
            activities.forEach(a => {
                a.date = a.date.split('T')[0];
                this.activityMap.set(a.id, a);
            });
            this.setLoadingInitial(false);

        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }

    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    selectActivity = (id: string) => {
        this.selectedActivity = this.activityMap.get(id);
    }

    cancelSelectedActivity = () => {
        this.selectedActivity = undefined;
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

                if (id == this.selectedActivity?.id) {
                    this.cancelSelectedActivity();
                    this.editMode = false;
                }

                this.loading = false;
            });

        } catch (error) {
            console.log(error);

            runInAction(() => {
                this.loading = false;
            });
        }
    };

    openForm = (id?: string) => {
        if (id)
            this.selectActivity(id);
        else
            this.cancelSelectedActivity();

        this.editMode = true;
    }

    closeForm = () => {
        this.editMode = false;
    }



}