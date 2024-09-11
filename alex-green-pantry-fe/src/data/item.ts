export class Item {
    public id: number | null = null;
    constructor(
        public name: String,
        public imageURL: String,
        public calPerOunce: number | null
    ){}
}