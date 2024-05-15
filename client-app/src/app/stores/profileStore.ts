import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Photo, Profile } from "../models/profile";
import agent from "../api/agent";
import { store } from "./store";

export default class ProfileStore {
    profile: Profile | null = null;
    loadingProfile: boolean = false;
    uploading: boolean = false;
    loading: boolean = false;
    loadingFollowings: boolean = false;
    followings: Profile[] = [];
    activeTab: number = 0;

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.activeTab,
            activeTab => {
                if (activeTab === 3 || activeTab === 4) {
                    const predicate = activeTab === 3 ? 'followers' : 'following';
                    this.loadFollowings(predicate);                    
                } else {
                    this.followings = [];
                }
            }
        );
    }

    get isCurrentUser() {
        if (store.userStore.user && this.profile)
            return store.userStore.user.username === this.profile.username;
        return false;
    }

    setActiveTab = (activeTab: any) => {
        this.activeTab = activeTab;
    };

    loadProfile = async (username: string) => {
        this.loadingProfile = true;

        try {
            const profile = await agent.Profiles.get(username);
            runInAction(() => {
                this.profile = profile;
                this.loadingProfile = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => this.loadingProfile = false);
        }
    };


    updateProfile = async (profile: Partial<Profile>) => {
        if (this.profile) {
            await agent.Profiles.put(profile);
            this.profile.displayName = profile.displayName || '';
            this.profile.bio = profile.bio || '';
        }
    }


    uploadPhoto = async (file: Blob) => {
        this.uploading = true;

        try {
            const response = agent.Profiles.uploadPhoto(file);
            const photo = (await response).data;
            runInAction(() => {
                if (this.profile) {
                    this.profile.photos?.push(photo);
                    if (photo.isMain && store.userStore.user) {
                        store.userStore.setImage(photo.url);
                        this.profile.image = photo.url;
                    }
                }

                this.uploading = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => this.uploading = false);
        }
    };

    deletePhoto = async (photo: Photo) => {
        if (photo.isMain)
            return;

        this.loading = true;

        try {
            await agent.Profiles.deletePhoto(photo.id);

            runInAction(() => {
                if (this.profile) {
                    this.profile.photos = this.profile.photos?.filter(p => p.id !== photo.id);
                    this.loading = false;
                }
            });
        } catch (error) {
            runInAction(() => this.loading = false);
        }

    };

    setMainPhoto = async (photo: Photo) => {
        this.loading = true;

        try {
            await agent.Profiles.setMainPhoto(photo.id);
            store.userStore.setImage(photo.url);
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    this.profile.photos.find(p => p.isMain)!.isMain = false;
                    this.profile.photos.find(p => p.id === photo.id)!.isMain = true;
                    this.profile.image = photo.url;
                    this.loading = false;
                }
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loading = false);
        }
    };

    updateFollowing = async (username: string, following: boolean) => {
        this.loading = true;
        try {
            await agent.Profiles.updateFollowing(username);
            store.activityStore.updateAttendeeFollowing(username);
            runInAction(() => {
                if (this.profile && this.profile.username !== store.userStore.user?.username
                     && this.profile.username === username) {
                    following ? this.profile.followersCount++ : this.profile.followersCount--;
                    this.profile.following = !this.profile.following;
                }

                if (this.profile && this.profile.username === store.userStore.user?.username) {
                    following ? this.profile.followingCount++ : this.profile.followingCount--;
                }

                this.followings.forEach(profile => {
                    if (profile.username === username) {
                        profile.following ? profile.followersCount-- : profile.followersCount++;
                        profile.following = !profile.following;
                    }
                });

                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => this.loading = false);
        }

    };

    loadFollowings = async (predicate: string) => {

        this.loadingFollowings = true;

        try {
            const followings = await agent.Profiles.listFollowings(this.profile!.username, predicate);

            runInAction(() => {
                this.followings = followings;
                this.loadingFollowings = false;
            });

        } catch (error) {
            console.log(error);
            runInAction(() => this.loadingFollowings = false);
        }

    };
}