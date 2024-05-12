const TODO_PATH = `$HOME/.config/todo/todo.json`;

class TodoType {
  task: string;

  constructor(todo: string) {
    this.task = todo;
  }
}

const todo = Variable<TodoType>(new TodoType(""));

export const Todo = () => Widget.Label({
  setup: () => {
    Utils.interval(1000, () => {
      Utils.execAsync(['sh', '-c', `cat ${TODO_PATH}`])
        .then(v => todo.value = JSON.parse(v))
        .catch(e => print(e));
    })
  },
  use_markup: true,
  label: todo.bind().as(t => `<b>TODO:</b> ${t.task}`),
  justification: 'center',
  truncate: 'end',
  class_name: 'todo',
});
