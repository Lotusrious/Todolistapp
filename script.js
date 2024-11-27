// script.js

// DOM Elements
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const container = document.querySelector('.container');

// 상태 변수
let startY = 0;
let isPulling = false;

// localStorage에서 데이터 불러오기
window.onload = function () {
  const savedTodos = JSON.parse(localStorage.getItem('todos')) || []; // 저장된 데이터를 배열로 변환
  savedTodos.forEach((todo) => {
    createTodoItem(todo.text, todo.completed);
  });
};

// 새로운 할 일 항목 생성
function createTodoItem(text, completed = false) {
  const li = document.createElement('li');
  li.className = 'todo-item';
  if (completed) li.classList.add('completed'); // 완료 상태 반영

  const span = document.createElement('span');
  span.textContent = text;
  span.addEventListener('click', () => {
    li.classList.toggle('completed'); // 완료 상태 토글
    saveToLocalStorage(); // 상태 변경 후 저장
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.className = 'delete-btn';
  deleteBtn.addEventListener('click', () => {
    li.remove(); // 항목 삭제
    saveToLocalStorage(); // 삭제 후 저장
  });

  li.appendChild(span);
  li.appendChild(deleteBtn);
  todoList.appendChild(li);
}

// 할 일 추가 버튼 클릭 이벤트
addBtn.addEventListener('click', () => {
  const todoText = todoInput.value.trim();
  if (todoText !== '') {
    createTodoItem(todoText);
    saveToLocalStorage(); // 저장
    todoInput.value = ''; // 입력 필드 초기화
  }
});

// localStorage에 할 일 저장
function saveToLocalStorage() {
  const todos = [];
  document.querySelectorAll('.todo-item').forEach((item) => {
    todos.push({
      text: item.querySelector('span').textContent,
      completed: item.classList.contains('completed'),
    });
  });
  localStorage.setItem('todos', JSON.stringify(todos)); // JSON 형식으로 저장
}

// 터치 시작 시 초기 지점 저장
container.addEventListener('touchstart', (e) => {
  if (container.scrollTop === 0) { // 스크롤이 최상단일 때만 동작
    startY = e.touches[0].pageY; // 터치 시작 위치 저장
    isPulling = true; // 당기기 상태 활성화
  }
});

// 터치 이동 시 당기는 애니메이션 실행
container.addEventListener('touchmove', (e) => {
  if (isPulling) {
    const currentY = e.touches[0].pageY; // 현재 터치 위치
    const diff = currentY - startY; // 터치 이동 거리 계산

    if (diff > 0) { // 아래로 당길 때만 동작
      container.style.transform = `translateY(${Math.min(diff, 50)}px)`; // 최대 50px까지 당김
    }
  }
});

// 터치 종료 시 원래 상태로 복구
container.addEventListener('touchend', () => {
  if (isPulling) {
    isPulling = false; // 당기기 상태 비활성화
    container.style.transition = 'transform 0.2s ease-out'; // 복귀 애니메이션
    container.style.transform = 'translateY(0)'; // 원래 위치로 이동

    // 복귀 후 다음 동작을 위해 초기화
    setTimeout(() => {
      container.style.transition = ''; // 초기화하여 다음 애니메이션 준비
    }, 200);
  }
});
