import {
  Module,
  VuexModule,
  Action,
  Mutation,
  MutationAction
} from 'vuex-module-decorators'

const sample = [
  {
    id: 1,
    title: 'title1',
    description: 'description1',
    count: 0
  },
  {
    id: 2,
    title: 'title2',
    description: 'description2',
    count: 0
  },
  {
    id: 3,
    title: 'title3',
    description: 'description3',
    count: 0
  }
]

export interface ITodo {
  id: number
  title: string
  description?: string
  count: number
}

export class TodoStore implements ITodo {
  id: number
  title: string
  description?: string
  count: number
  constructor(data: any) {
    this.id = typeof data.id !== 'undefined' ? data.id : 0
    this.title = typeof data.title !== 'undefined' ? data.title : ''
    this.description =
      typeof data.description !== 'undefined' ? data.description : ''
    this.count = typeof data.count !== 'undefined' ? data.count : 0
  }
}

export interface Todos {
  todos: ITodo[]
}

@Module({
  name: 'todos',
  stateFactory: true,
  namespaced: true
})
export default class TodosStore extends VuexModule implements Todos {
  sequence: number = 1
  todos: ITodo[] = []

  public get list() {
    return this.todos
  }

  @Action
  public async initialize() {
    if (this.todos.length == 0) {
      this.setTodos()
    }
  }

  @Mutation
  public setTodos() {
    let list: ITodo[] = []
    sample.forEach((e) => list.push(new TodoStore(e)))
    this.sequence = list.reduce((a, b) => (a.id > b.id ? a : b)).id
    this.todos = list
  }

  @Action
  public async editTodo(todo: ITodo) {
    this.editTodoMutation(todo)
  }

  @Mutation
  private editTodoMutation(todo: ITodo) {
    if (todo.id === 0) {
      todo.id = ++this.sequence
      this.todos.push(todo)
    } else {
      let index: number = this.todos.findIndex((e) => e.id === todo.id)
      if (index >= 0) {
        this.todos.splice(index, 1, todo)
      }
    }
  }

  @Action
  public setCount(data: { todo: ITodo; count: number }) {
    this.countMutation(data)
  }

  @Mutation
  private countMutation(data: { todo: ITodo; count: number }) {
    if (typeof data.count !== 'undefined') {
      data.todo.count = data.count
    }
  }

  @MutationAction({ mutate: ['todos'] })
  public async removeTodo(todo: ITodo) {
    return { todos: (this.state as TodosStore).todos.filter((e) => e !== todo) }
  }

  @Action
  public xremoveTodo(todo: ITodo) {
    this.removeTodoMutation(todo)
  }

  @Mutation
  private removeTodoMutation(todo: ITodo) {
    this.todos = this.todos.filter((e) => e !== todo)
  }
}
