export class User {
    constructor (
        public email: string,
        public password: string
    ) { }
}

export class Register {
    constructor(
        // public email: string,
        public fname: string,
        public username: string,
        public password: string
    ) { }
}
export class Login {
    constructor(
        // public email: string,
        // public fname: string,
        public username: string,
        public password: string
    ) { }
}


