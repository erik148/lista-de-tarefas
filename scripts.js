const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const toggleBtn = document.getElementById('toggle-theme');
const filterBtns = document.querySelectorAll('.filter-btn');

let currentFilter = 'all';

function getTasks() {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}

function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';
  const tasks = getTasks();

  tasks.forEach((task, index) => {
    if (
      currentFilter === 'pending' && task.completed ||
      currentFilter === 'completed' && !task.completed
    ) return;

    const li = document.createElement('li');
    li.classList.add('task-item');
    if (task.completed) li.classList.add('completed');

    const span = document.createElement('span');
    span.textContent = task.text;
    span.style.cursor = 'pointer';

    span.addEventListener('click', () => {
      task.completed = !task.completed;
      saveTasks(tasks);
      renderTasks();
    });

    const actions = document.createElement('div');
    actions.classList.add('task-actions');

    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️';
    editBtn.classList.add('edit');
    editBtn.title = 'Editar';
    editBtn.addEventListener('click', () => {
      const newText = prompt('Editar tarefa:', task.text);
      if (newText) {
        task.text = newText.trim();
        saveTasks(tasks);
        renderTasks();
      }
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️';
    deleteBtn.classList.add('delete');
    deleteBtn.title = 'Apagar';
    deleteBtn.addEventListener('click', () => {
      li.classList.add('deleting');
      setTimeout(() => {
        tasks.splice(index, 1);
        saveTasks(tasks);
        renderTasks();
      }, 400);
    });

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    li.appendChild(span);
    li.appendChild(actions);
    taskList.appendChild(li);
  });
}

function handleAddTask() {
  const text = taskInput.value.trim();
  if (text) {
    const tasks = getTasks();
    tasks.push({ text, completed: false });
    saveTasks(tasks);
    taskInput.value = '';
    renderTasks();
  }
}

addBtn.addEventListener('click', handleAddTask);
taskInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') handleAddTask();
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.id.replace('filter-', '');
    renderTasks();
  });
});

function updateDateTime() {
  const now = new Date();
  const DateTimeDiv = document.getElementById('date-time');
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  DateTimeDiv.textContent = now.toLocaleDateString('pt-BR', options);
}
updateDateTime();
setInterval(updateDateTime, 60000);

function setTheme(isDark) {
  if (isDark) {
    document.body.classList.add('dark-mode');
    toggleBtn.textContent = '☀️';
  } else {
    document.body.classList.remove('dark-mode');
    toggleBtn.textContent = '🌙';
  }
  localStorage.setItem('darkMode', isDark ? 'true' : 'false');
}

const savedTheme = localStorage.getItem('darkMode');
setTheme(savedTheme === 'true');

toggleBtn.addEventListener('click', () => {
  document.body.classList.add('transitioning');
  const isDark = !document.body.classList.contains('dark-mode');
  setTimeout(() => setTheme(isDark), 100);
  setTimeout(() => document.body.classList.remove('transitioning'), 600);
});

renderTasks();


