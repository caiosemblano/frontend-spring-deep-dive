import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:8080"
})

export class UserService {
    listAllUsers() {
        return axiosInstance.get("/user");
    }

    insertUser(user: Project.User) {
        return axiosInstance.post("/user", user);
    }

    updateUser(user: Project.User) {
            return axiosInstance.put("/user", user);
    }

    deleteUser(id: number) {
        return axiosInstance.delete("/user/" + id)
    }
}


