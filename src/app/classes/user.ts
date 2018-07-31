export class User {
    constructor (
        public email: string,
        public password: string
    ) { }
}

// Register class
export class Register {
    constructor(
        // public email: string,
        public fname: string,
        public username: string,
        public password: string
    ) { }
}

// Login class
export class Login {
    constructor(
        // public email: string,
        // public fname: string,
        public username: string,
        public password: string
    ) { }
}

// Viewers login class
export class ViewersLogin {
    constructor (
        public ward: string,
        public username: string
    ) {}
}

// New subject class
export class NewSubject {
    constructor(
        public subject: string
    ) { }
}
// New question class
export class NewQuestion {
    constructor(
        public question: string,
        public subject: string,
        public option1: string,
        public option2: string,
        public option3: string,
        public answer: string
    ) { }
}
// New parent/guardian
export class NewGuardian {
    constructor(
        public guardian: string,
        public username: string,
        public email: string,
        public phone: string,
        public relationship: string,
        public ward: string
    ) { }
}


// Answer class
export class Answer {
    constructor (
        public ans: string
    ) {}
}

// Game class
export class Game {
    constructor (
        public session_key: string
    ) {}
}

// Chat class
export class Chat {
    constructor (
        public chats: string,
        public message: string
    ) {}
}
