import axios, { AxiosError, AxiosResponse } from 'axios';
import { Activity, ActivityFormValues } from '../models/activity';
import { toast } from 'react-toastify';
import { router } from '../router/Routes';
import { store } from '../stores/store';
import { User, UserFormValues } from '../models/user';
import { Photo, Profile, UserActivity } from '../models/profile';
import { PaginatedResult } from '../models/pagination';

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use(config => {

    const token = store.commonStore.token;
    if (token)
        config.headers.Authorization = `Bearer ${token}`;
    return config;

});

axios.interceptors.response.use(async response => {

    if (process.env.NODE_ENV === 'development')
        await sleep(800);

    const pagination = response.headers['pagination'];
    if (pagination) {
        response.data = new PaginatedResult(response.data, JSON.parse(pagination));
        return response as AxiosResponse<PaginatedResult<any>>;
    }

    return response;

}, (error: AxiosError) => {
    //const {data: any, status} = error.response!;
    const data: any = error.response!.data;
    const status = error.response!.status;
    const config = error.response!.config;

    switch (status) {
        case 400:
            
            if (typeof data === 'string')
                toast.error(data);

            // If invalid entity id/guid response, redirect to not-found
            if (config.method === 'get' && data.errors.hasOwnProperty('id')) {
                router.navigate('/not-found');
            }

            if (data.errors) {
                const modelStateErrors = [];

                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modelStateErrors.push(data.errors[key]);
                    }
                }

                throw modelStateErrors.flat();

            }

            break;
        case 401:
            toast.error('unauthorised');
            break;
        case 404:
            toast.error('not found');
            router.navigate('/not-found');
            break;
        case 500:
            store.commonStore.setServerError(data);
            router.navigate('/server-error');
            break;        
    }
    
    return Promise.reject(error);

});



const responseBody =  <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
}

const Activities = {

    list: (params: URLSearchParams) => axios.get<PaginatedResult<Activity[]>>('/activities', { params })
                                            .then(responseBody),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: ActivityFormValues) => requests.post('/activities', activity),
    update: (activity: ActivityFormValues) => requests.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del(`/activities/${id}`),
    attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {})
};

const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user)    
};

const Profiles = {
    get: (username: string) => requests.get<Profile>(`/profiles/${username}`),
    put: (profile: Partial<Profile>) => requests.put<Profile>('/profiles', profile),
    uploadPhoto: (file: Blob) => {
        let formData = new FormData();
        formData.append('File', file);
        return axios.post<Photo>('photos', formData, {
            headers: { 'Content-type': 'multipart/form-data' }
        });
    },
    setMainPhoto: (id: string) => requests.post(`/photos/${id}/setMain`, {}),
    deletePhoto: (id: string) => requests.del(`/photos/${id}`),
    updateFollowing: (username: string) => requests.post(`/follow/${username}`, {}),
    listFollowings: (username: string, predicate: string) => requests.get<Profile[]>(`/follow/${username}?predicate=${predicate}`),
    getActivities: (username: string, predicate: string) => requests.get<UserActivity[]>(`/profiles/${username}/activities?predicate=${predicate}`)
};

const agent = {
    Activities,
    Account,
    Profiles
}

export default agent;