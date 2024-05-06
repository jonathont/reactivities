import { makeAutoObservable, runInAction } from "mobx";
import { User, UserFormValues } from "../models/user";
import agent from "../api/agent";
import { store } from "./store";
import { router } from "../router/Routes";

export default class UserStore {

    user: User | null = null;

    constructor() {
        makeAutoObservable(this);
    }


    get isLoggedIn() {
        return !!this.user;
    }

    login = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.login(creds);
            
            runInAction(() => {
                store.commonStore.setToken(user.token);
                this.user = user;
                console.log(user);
            });

            router.navigate('/activities');
            
            store.modalStore.closeModal();
        } catch (error) {
            throw error;
        }
    };

    logout = async () => {
        store.commonStore.setToken(null);
        window.localStorage.removeItem('jwt');
        this.user = null;
        router.navigate('/');
    };

    getUser = async () => {
        try {
            const user = await agent.Account.current();
            runInAction(() => this.user = user);            
        } catch (error) {
            console.log(error);
        }
    };

    register = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.register(creds);
            
            runInAction(() => {
                store.commonStore.setToken(user.token);
                this.user = user;
                console.log(user);
            });

            router.navigate('/activities');
            
            store.modalStore.closeModal();
        } catch (error) {
            throw error;
        }
    };

    setImage = (image: string) => {
        if (this.user) {
            this.user.image = image;
            store.activityStore.updateProfileMainImage(this.user.username, image);
        }
    };

}