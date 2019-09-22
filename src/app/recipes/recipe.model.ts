import { Ingredient } from '../shared/ingredient.model';

export class Recipe {
    public name: string;
    public description: string;
    public imagePath: string;
    public ingredients: Ingredient[];

    constructor(name: string, desc: string, imagePaht: string, ingredients:Ingredient[]){
        this.name = name;
        this.description = desc;
        this.imagePath = imagePaht;
        this.ingredients = ingredients;
    }
}