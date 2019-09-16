<template>
  <div>
    <no-ssr>
      <v-data-table
        dense
        :headers="headers"
        :items="todos"
        :items-per-page="5"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="dark">
            <v-toolbar-title>{{ title }}</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" dark class="mb-2" @click="newTodo()"
                  >New Item</v-btn
                >
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12>
                        <v-text-field
                          v-model="editedItem.title"
                          label="Title"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <v-text-field
                          v-model="editedItem.description"
                          label="description"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <v-text-field
                          v-model="editedItem.count"
                          label="count"
                        ></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close"
                    >Cancel</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.action="{ item }">
          <v-icon small @click="incTodo(item)">
            mdi-arrow-up-bold
          </v-icon>
          <v-icon small @click="decTodo(item)">
            mdi-arrow-down-bold
          </v-icon>
          <v-icon small class="mr-2" @click="editTodo(item)">
            mdi-lead-pencil
          </v-icon>
          <v-icon small @click="deleteTodo(item)">
            mdi-trash-can
          </v-icon>
        </template>
      </v-data-table>
    </no-ssr>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { todosModule } from '../store'
import { TodoStore, ITodo } from '@/store/todos'

@Component({
  layout: 'base',
  components: {}
})
export default class TodoBody extends Vue {
  title: string = 'My Todos'
  dialog: boolean = false
  formTitle: string = 'ダイアログ'

  editedItem: ITodo = new TodoStore({})

  headers: {
    text: string
    align?: string
    sortable?: boolean
    value: string
  }[] = [
    { text: 'ID', value: 'id' },
    {
      text: 'タイトル',
      align: 'left',
      sortable: true,
      value: 'title'
    },
    { text: '内容', value: 'description' },
    { text: '値', value: 'count' },
    { text: '操作', value: 'action', sortable: false }
  ]

  get todos() {
    return todosModule.list
  }

  mounted() {
    todosModule.initialize()
  }

  incTodo(item: ITodo) {
    todosModule.setCount({ todo: item, count: item.count + 1 })
  }

  decTodo(item: ITodo) {
    todosModule.setCount({ todo: item, count: item.count - 1 })
  }

  newTodo() {
    this.editedItem = new TodoStore({})
    this.dialog = true
  }

  editTodo(item: ITodo) {
    this.editedItem = new TodoStore(item)
    this.dialog = true
  }

  async deleteTodo(item: ITodo) {
    if (confirm('削除してよろしいですか。')) {
      await todosModule.removeTodo(item)
    }
  }

  close() {
    this.dialog = false
    setTimeout(() => {}, 300)
  }

  save() {
    todosModule.editTodo(this.editedItem)
    this.close()
  }
}
</script>
