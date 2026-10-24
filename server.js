const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Todo API!');
});

// In-memory array to store todos
let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build a REST API', completed: true },
];



// 1. GET /todos - Fetch all todos
app.get('/todos', (req, res) => {
  res.json(todos);
});

// 2. BONUS ROUTE: GET /todos/active (filter !completed)
// NOTE: This must be defined BEFORE GET /todos/:id so Express doesn't treat 'active' as an ID.
app.get('/todos/active', (req, res) => {
  const activeTodos = todos.filter((todo) => !todo.completed);
  res.json(activeTodos);
});

// 3. GET /todos/:id - Read a single todo by ID
app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  res.json(todo);
});

// 4. POST /todos - Create a new todo (with validation)
app.post('/todos', (req, res) => {
  const { task } = req.body;

  // Validation: Check if "task" field exists and is not empty
  if (!task || typeof task !== 'string' || task.trim() === '') {
    return res.status(400).json({ error: 'The "task" field is required.' });
  }

  const newTodo = {
    id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
    task: task.trim(),
    completed: false,
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// 5. PUT /todos/:id - Update an existing todo
app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  const { task, completed } = req.body;

  if (task !== undefined) todo.task = task;
  if (completed !== undefined) todo.completed = Boolean(completed);

  res.json(todo);
});

app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const todoIndex = todos.findIndex((t) => t.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  const deletedTodo = todos.splice(todoIndex, 1);
  res.json({ message: 'Todo deleted successfully', todo: deletedTodo[0] });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});