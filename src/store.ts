// store.ts
import { makeAutoObservable } from "mobx";

class Store {
    constructor() {
        makeAutoObservable(this);
    }
    todos: string[] = [];
    newTodo: string = '';
    loginStatus: boolean = false; 
    user: string = '';
    password: string = '';

    addTodo() {
        this.todos.push(this.newTodo);
        this.newTodo = '';
    }
    setLoginStatus(status: boolean) {
        this.loginStatus = status;
    }
    setUser(user: string) {
        this.user = user;
    }
    setPassword(password: string) {
        this.password = password;
    }
}

const store = new Store();
export default store;