import { Item } from "./item";

export class Recipe {
    public id: number | null = null;
    constructor(
        public name: String,
        public imageURL: String,
        public items: Item[],
        public steps: String[],
        public creatorId: number | null,
        public itemWeights: number[]
    ){}
}