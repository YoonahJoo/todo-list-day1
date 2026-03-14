const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const errorMessage = document.getElementById("error-message");
const filterButtons = document.querySelectorAll(".filter-btn");

// 브라우저 저장소에서 기존 데이터 불러오기
let todos = JSON.parse(localStorage.getItem("todos")) || [];

// 현재 선택된 필터 상태
let currentFilter = "all";

// 처음 페이지 열릴 때 화면에 그리기
renderTodos();

todoForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const taskText = todoInput.value.trim();

  if (taskText === "") {
    errorMessage.textContent = "Please enter a task.";
    return;
  }

  errorMessage.textContent = "";

  const newTodo = {
    id: Date.now(),
    text: taskText,
    completed: false,
  };

  todos.push(newTodo);

  saveTodos();
  renderTodos();

  todoInput.value = "";
  todoInput.focus();
});

// 필터 버튼 클릭 이벤트
filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    currentFilter = button.dataset.filter;
    updateActiveFilterButton();
    renderTodos();
  });
});

// localStorage에 저장
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// 화면 그리기
function renderTodos() {
  todoList.innerHTML = "";

  let filteredTodos = todos;

  if (currentFilter === "active") {
    filteredTodos = todos.filter(function (todo) {
      return !todo.completed;
    });
  } else if (currentFilter === "completed") {
    filteredTodos = todos.filter(function (todo) {
      return todo.completed;
    });
  }

  filteredTodos.forEach(function (todo) {
    const listItem = document.createElement("li");
    listItem.className = "todo-item";

    if (todo.completed) {
      listItem.classList.add("completed");
    }

    const textSpan = document.createElement("span");
    textSpan.className = "todo-text";
    textSpan.textContent = todo.text;

    const actionsDiv = document.createElement("div");
    actionsDiv.className = "todo-actions";

    const completeButton = document.createElement("button");
    completeButton.className = "action-btn";
    completeButton.textContent = "Done";

    completeButton.addEventListener("click", function () {
      toggleTodo(todo.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "action-btn";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {
      deleteTodo(todo.id);
    });

    actionsDiv.appendChild(completeButton);
    actionsDiv.appendChild(deleteButton);

    listItem.appendChild(textSpan);
    listItem.appendChild(actionsDiv);

    todoList.appendChild(listItem);
  });
}

// 완료 / 미완료 토글
function toggleTodo(id) {
  todos = todos.map(function (todo) {
    if (todo.id === id) {
      return {
        ...todo,
        completed: !todo.completed,
      };
    }
    return todo;
  });

  saveTodos();
  renderTodos();
}

// 삭제
function deleteTodo(id) {
  todos = todos.filter(function (todo) {
    return todo.id !== id;
  });

  saveTodos();
  renderTodos();
}

// 현재 선택된 필터 버튼 스타일 업데이트
function updateActiveFilterButton() {
  filterButtons.forEach(function (button) {
    if (button.dataset.filter === currentFilter) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
}