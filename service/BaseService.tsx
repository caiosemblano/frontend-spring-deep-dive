import axios from "axios";
import { ProjectOptions } from "next/dist/build/swc/types";

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL_API
})

export class BaseService {

    url: string;

    constructor(url:string) {
        this.url = url;
    }


    listAll() {
        return axiosInstance.get(this.url);
    }

    searchById(id : number) {
        return axiosInstance.get(this.url + "/" + id);
    }

    insert(object: any) {
        return axiosInstance.post(this.url, object);
    }

    update(object: any) {
            return axiosInstance.put(this.url, object);
    }

    delete(id: number) {
        return axiosInstance.delete(this.url + "/" + id);
    }
}


