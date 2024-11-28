// script.js

const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const calendarModal = document.getElementById('calendar-modal');
const deadlineInput = document.getElementById('deadline-input');
const setDeadlineBtn = document.getElementById('set-deadline-btn');
let currentTaskIndex = null; // 데드라인 설정 시 사용할 현재 작업 인덱스

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// 초기 렌더링
renderTasks();
updateCurrentTime();

// ** 현재 시간 업데이트 **
function updateCurrentTime() {
  setInterval(() => {
    const now = new Date();
    const currentTimeDiv = document.getElementById('current-time');
    currentTimeDiv.textContent = `Current Time: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  }, 1000);
}

// ** 새 작업 추가 **
addBtn.addEventListener('click', () => {
  const taskText = todoInput.value.trim();
  if (!taskText) return;

  addTask(taskText);
});

// 작업 추가 함수
function addTask(text) {
  const task = { text, subTasks: [], completed: false, deadline: null };
  tasks.push(task);
  renderTasks();
  saveToLocalStorage();
  todoInput.value = ''; // 입력 필드 초기화
}

// 작업 렌더링
function renderTasks() {
  todoList.innerHTML = ''; // 초기화
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = `todo-item ${task.completed ? 'completed' : ''}`;

    const header = document.createElement('div');
    header.className = 'todo-header';

    header.innerHTML = `
      <span>${task.text}</span>
      <div class="actions">
        <button onclick="markAsDone(${index})" class="done-btn" ${task.completed ? 'disabled' : ''}>Done</button>
        <button onclick="editTask(${index})" ${task.completed ? 'disabled' : ''}>Edit</button>
        <button onclick="deleteTask(${index})" class="delete-btn">Delete</button>
        <button onclick="addSubTask(${index})" ${task.completed ? 'disabled' : ''}>Sub-task</button>
        <button onclick="openDeadlineModal(${index})" ${task.completed ? 'disabled' : ''}>Set Deadline</button>
      </div>
    `;

    li.appendChild(header);

    if (task.deadline) {
      const deadlineDiv = document.createElement('div');
      deadlineDiv.className = 'deadline';
      deadlineDiv.textContent = `Deadline: ${new Date(task.deadline).toLocaleString()}`;
      li.appendChild(deadlineDiv);
    }

    if (task.subTasks.length > 0) {
      const subTaskList = document.createElement('div');
      subTaskList.className = 'sub-task-list';
      task.subTasks.forEach((subTask, subIndex) => {
        const subTaskDiv = document.createElement('div');
        subTaskDiv.className = `sub-task ${subTask.completed ? 'completed' : ''}`;
        subTaskDiv.innerHTML = `
          <span>${subTask.text}</span>
          <div class="actions">
            <button onclick="markAsDone(${index}, ${subIndex})" class="done-btn" ${subTask.completed ? 'disabled' : ''}>Done</button>
            <button onclick="editTask(${index}, ${subIndex})" ${subTask.completed ? 'disabled' : ''}>Edit</button>
            <button onclick="deleteTask(${index}, ${subIndex})" class="delete-btn">Delete</button>
          </div>
        `;
        subTaskList.appendChild(subTaskDiv);
      });
      li.appendChild(subTaskList);
    }

    todoList.appendChild(li);
  });
}

// ** 작업 완료 (Done 클릭 시 처리) **
function markAsDone(index, subIndex = null) {
  if (subIndex === null) {
    tasks[index].completed = true;
  } else {
    tasks[index].subTasks[subIndex].completed = true;
  }
  renderTasks();
  saveToLocalStorage();
}

// ** 작업 삭제 **
function deleteTask(index, subIndex = null) {
  if (subIndex === null) {
    tasks.splice(index, 1);
  } else {
    tasks[index].subTasks.splice(subIndex, 1);
  }
  renderTasks();
  saveToLocalStorage();
}

// ** 세부 작업 추가 **
function addSubTask(index) {
  const subTaskText = prompt('Enter sub-task:');
  if (subTaskText) {
    const subTask = { text: subTaskText, completed: false };
    tasks[index].subTasks.push(subTask);
    renderTasks();
    saveToLocalStorage();
  }
}

// ** 데드라인 설정 모달 열기 **
function openDeadlineModal(index) {
  currentTaskIndex = index;
  calendarModal.classList.remove('hidden');
}

// ** 데드라인 설정 완료 **
setDeadlineBtn.addEventListener('click', () => {
  if (currentTaskIndex === null) return;
  const deadline = deadlineInput.value;
  if (deadline) {
    tasks[currentTaskIndex].deadline = new Date(deadline).toISOString();
    currentTaskIndex = null;
    calendarModal.classList.add('hidden');
    renderTasks();
    saveToLocalStorage();
  }
});

// ** 로컬 저장소 저장 **
function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
