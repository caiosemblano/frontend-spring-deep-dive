import axios from "axios";
import { ProjectOptions } from "next/dist/build/swc/types";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:8080"
})

export class BaseService {

    url: string;

    constructor(url:string) {
        this.url = url;
    }


    listAllUsers() {
        return axiosInstance.get(this.url);
    }

    searchById(id : number) {
        return axiosInstance.get(this.url + "/" + id);
    }

    insertUser(object: any) {
        return axiosInstance.post(this.url, object);
    }

    updateUser(object: any) {
            return axiosInstance.put(this.url, object);
    }

    deleteUser(id: number) {
        return axiosInstance.delete(this.url + "/" + id);
    }
}


