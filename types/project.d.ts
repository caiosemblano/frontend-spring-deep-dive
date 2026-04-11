declare namespace Project {
    type User = {
        id?: number,
        name: string
        login: string
        email: string
        password: string
    }

    type Resource = {
        id?: number,
        name: string
        key: string
    }

    type Profile = {
        id?: number,
        description: string
    }
}