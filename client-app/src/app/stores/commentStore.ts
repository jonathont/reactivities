import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { ChatComment } from "../models/comment";
import { makeAutoObservable, runInAction } from "mobx";
import { store } from "./store";

export default class CommentStore {
    comments: ChatComment[] = [];
    hubConnection: HubConnection | null = null;

    constructor() {
        makeAutoObservable(this);
    }


    createHubConnection = (activityId: string) => {
        if (store.activityStore.selectedActivity) {
            this.hubConnection = new HubConnectionBuilder()
                .withUrl(`${process.env.REACT_APP_CHAT_URL}?activityId=${activityId}`, {
                    accessTokenFactory: () => store.userStore.user?.token!
                })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();

                this.hubConnection
                    .start()
                    .catch(error => console.log(`Error establishing connection: ${error}`));


                this.hubConnection
                    .on('LoadComments', (comments: ChatComment[]) => {
                        runInAction(() => {
                            comments.forEach(comment => {
                                comment.createdAt = new Date(comment.createdAt);
                            });
                            this.comments = comments;
                        });
                    });

                this.hubConnection 
                    .on('ReceiveComment', (comment: ChatComment) => {
                        comment.createdAt = new Date(comment.createdAt);                    
                        runInAction(() => this.comments.unshift(comment));
                    });
        }
    };

    stopHubConnection = () => {
        this.hubConnection?.stop().catch(error => console.log(`Error stopping connection: ${error}`));
    };

    clearComments = () => {
        this.comments = [];
        this.stopHubConnection();
    };

    sendComment = async (activityId: string, comment: any) => {
        comment.activityId = activityId;

        try {
            await this.hubConnection?.invoke('SendComment', comment)
        } catch (error) {
            console.log(error);
        }
    };
}