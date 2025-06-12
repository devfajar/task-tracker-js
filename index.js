const fs = require('fs');
const { Command } = require('commander');
const program = new Command();

const filePath = './data.json';

// Function to read data from the JSON file
function loadTasks() {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}

function saveTasks(tasks) {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2), 'utf8');
}

program.command('add <description>')
.description('Add a new task')
.action((description) => {
  const tasks = loadTasks();
  const newTask = { 
    id: tasks.length + 1,
    description,
    status: 'todo',
    createdAt: new Date().toISOString(),
  }
  tasks.push(newTask);
  saveTasks(tasks);
  console.log(`Task added successfully {ID: ${newTask.id}}`);
});

program.command('update <id> <description>')
.description('Update an existing task')
.action((id, description) => {
  const tasks = loadTasks();
  const task = tasks.find(t => t.id === parseInt(id));
  if (!task) {
    console.error(`Task with ID ${id} not found.`);
    return;
  }
  task.description = description;
  saveTasks(tasks);
  console.log(`Task ${id} updated successfully.`);
});

program.command('delete <id>')
.description('Delete a task')
.action((id) => {
  let tasks = loadTasks();
  const initialLength = tasks.length;
  tasks = tasks.filter(t => t.id !== parseInt(id));
  if (tasks.length === initialLength) {
    console.error(`Task with ID ${id} not found.`);
    return;
  }
  saveTasks(tasks);
  console.log(`Task ${id} deleted successfully.`);
}); 


program.command('mark-in-progress <id>')
.description('Mark a task as in progress')
.action((id) => {
  const tasks = loadTasks();
  const task = tasks.find(t => t.id === parseInt(id));
  if (!task) {
    console.error(`Task with ID ${id} not found.`);
    return;
  }
  task.status = 'in-progress';
  saveTasks(tasks);
  console.log(`Task ${id} marked as in progress.`);
});

program.command('mark-done <id>')
.description('Mark a task as done')
.action((id) => {
  const tasks = loadTasks();
  const task = tasks.find(t => t.id === parseInt(id));
  if (!task) {
    console.error(`Task with ID ${id} not found.`);
    return;
  }
  task.status = 'done';
  saveTasks(tasks);
  console.log(`Task ${id} marked as done.`);
});

program.command('list')
.description('List all tasks')  
.action(() => {
  const tasks = loadTasks();
  if (tasks.length === 0) {
    console.log('No tasks found.');
    return;
  }
  tasks.forEach(task => {
    console.log(`ID: ${task.id}, Description: ${task.description}, Status: ${task.status}, Created At: ${task.createdAt}`);
  });
});

// program.command('list [status]')
//   .description('List tasks by status (optional: todo, in-progress, done)')
//   .action((status) => {
//     const tasks = loadTasks();
//     if (status) {
//       // Menampilkan task berdasarkan status jika status diberikan
//       const filteredTasks = tasks.filter(t => t.status === status);
//       if (filteredTasks.length === 0) {
//         console.log(`No tasks with status: ${status}`);
//       } else {
//         filteredTasks.forEach(task => {
//           console.log(`${task.id}: ${task.description} [${task.status}]`);
//         });
//       }
//     } else {
//       // Menampilkan semua task jika tidak ada status yang diberikan
//       if (tasks.length === 0) {
//         console.log('No tasks available.');
//       } else {
//         tasks.forEach(task => {
//           console.log(`${task.id}: ${task.description} [${task.status}]`);
//         });
//       }
//     }
//   });
program.parse(process.argv);