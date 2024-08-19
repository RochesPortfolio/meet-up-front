import { makeAutoObservable } from "mobx";

class Store {
    constructor() {
        makeAutoObservable(this);
    }
    todos: string[] = [];
    newTodo: string = '';
    addTodo() {
        this.todos.push(this.newTodo);
        this.newTodo = '';
    }
    
}

const store = new Store();
export default store;