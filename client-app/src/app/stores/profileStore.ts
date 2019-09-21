import { RootStore } from "./rootStore";
import { observable, runInAction, action, computed } from "mobx";
import { IProfile, IPhoto, IProfileValues } from "../models/profile";
import agent from "../api/agent";
import { toast } from "react-toastify";

export default class ProfileStore {
    rootStore: RootStore

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    @observable profile: IProfile | null = null;
    @observable loadingProfile = true;
    @observable uploadingPhoto = false;
    @observable loading = false;
    @observable deletingPhoto = false;

    @computed get isCurrentUser() {
        if (this.rootStore.userStore.user && this.profile) {
            return this.rootStore.userStore.user.username === this.profile.username;
        }

        return false;
    }

    @computed get profileValues(): IProfileValues {
        return {
            displayName: this.profile!.displayName,
            bio: this.profile!.bio
        }
    }

    @action loadProfile = async (username: string) => {
        this.loadingProfile = true;
        try {
            const profile = await agent.Profiles.get(username);
            runInAction(() => {
                this.profile = profile;
                this.loadingProfile = false;
            });
        } catch(error) {
            runInAction(() => {
                this.loadingProfile = false;
            });
            console.log(error);
        }
    }

    @action uploadPhoto = async (file: Blob) => {
        this.uploadingPhoto = true;
        try {
            const photo = await agent.Profiles.uploadPhoto(file);
            runInAction(() => {
                if (this.profile) {
                    this.profile.photos.push(photo);
                    if (photo.isMain && this.rootStore.userStore.user) {
                        this.rootStore.userStore.user.image = photo.url;
                        this.profile.image = photo.url;
                    } 
                }

                this.uploadingPhoto = false;
            });
        } catch(error) {
            console.log(error);
            toast.error('Problem uploading photo');
            runInAction(() => {
                this.uploadingPhoto = false;
            });
        }
    }

    @action setMainPhoto = async (photo: IPhoto) => {
        this.loading = true;
        try {
            await agent.Profiles.setMainPhoto(photo.id);
            runInAction(() => {
                this.rootStore.userStore.user!.image = photo.url;
                this.profile!.photos.find(a => a.isMain)!.isMain = false;
                this.profile!.photos.find(a => a.id === photo.id)!.isMain = true;
                this.profile!.image = photo.url;
                this.loading = false;
            });
        } catch(error) {
            toast.error("Problem setting photo as main");
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    @action deletePhoto = async (photo: IPhoto) => {
        this.deletingPhoto = true;
        try {
            await agent.Profiles.deletePhoto(photo.id);
            runInAction(() => {
                this.profile!.photos = this.profile!.photos.filter(a => a.id !== photo.id);
                this.deletingPhoto = false;
            });
        } catch(error) {
            toast.error("Problem deleting the photo");
            runInAction(() => {
                this.deletingPhoto = false;
            });
        }
    }

    @action editProfile = async (profileValues: IProfileValues) => {
        this.loading = true;
        try {
            await agent.Profiles.update(profileValues);
            runInAction(() => {
                this.loading = false;
                this.profile!.displayName = profileValues.displayName;
                this.profile!.bio = profileValues.bio;

                if(this.rootStore.userStore.user!.displayName !== profileValues.displayName) {
                    this.rootStore.userStore.user!.displayName = profileValues.displayName;
                }
            });
        } catch(error) {
            runInAction(() => {
                this.loading = false;
            });

            console.log(error);
        }
    }
}