export class Account {
    public id: number | null = null;
    constructor(
        public name: String,
        public username: String,
        public password: String
    ){}
}