const todoForm = document.querySelector('#todo-form');
const todoInput = document.querySelector('#todo-input');
const todoList = document.querySelector('#todo-list');

// Retrieve todos from storage and render them
chrome.storage.sync.get('todos', ({ todos }) => {
  if (todos) {
    todos.forEach((todo) => addTodoToList(todo));
  }
});

// Handle form submission
todoForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const todo = todoInput.value.trim();
  if (todo) {
    addTodoToList(todo);
    saveTodoInStorage(todo);
    todoInput.value = '';
  }
});

// Add a todo to the list
function addTodoToList(todo) {
  const li = document.createElement('li');
  li.className = 'list-group-item ws-normal primary-color';
  li.innerHTML = `
    <div class="d-flex justify-content-between align-items-center">
      <span style="word-break: break-all;
      padding-right: 10px;">${todo}</span>
      <div style="min-width: 107px;">
        <button class="btn btn-sm btn-primary mr-2 edit-button">Edit</button>
        <button class="btn btn-sm btn-warning delete-button">Done</button>
      </div>
    </div>
  `;
  const editButton = li.querySelector('.edit-button');
  const deleteButton = li.querySelector('.delete-button');
  editButton.addEventListener('click', () => {
    // Get the text of the todo item
    const todoText =
      editButton.parentNode.parentNode.querySelector('span').textContent;

    // Show an input field and hide the todo text
    const inputField = document.createElement('input');
    inputField.setAttribute('class', 'edit-input-field');
    inputField.type = 'text';
    inputField.value = todoText;
    const todoTextElement =
      editButton.parentNode.parentNode.querySelector('span');
    todoTextElement.parentNode.insertBefore(inputField, todoTextElement);
    todoTextElement.style.display = 'none';

    // Hide the "Edit" button and show a "Save" button
    editButton.style.display = 'none';
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.classList.add(
      'btn',
      'btn-sm',
      'btn-success',
      'mr-1',
      'save-button'
    );
    editButton.parentNode.insertBefore(saveButton, editButton.nextSibling);

    // Add an event listener for the "Save" button
    saveButton.addEventListener('click', () => {
      // Get the new todo text and update the todo item
      const newTodoText = inputField.value;
      todoTextElement.textContent = newTodoText;

      // Show the todo text and hide the input field
      todoTextElement.style.display = 'block';
      inputField.style.display = 'none';

      // Hide the "Save" button and show the "Edit" button
      saveButton.style.display = 'none';
      editButton.style.display = 'inline-block';
    });
  });
  deleteButton.addEventListener('click', () => {
    deleteTodoFromList(li, todo);
    deleteTodoFromStorage(todo);
  });
  todoList.appendChild(li);
}

// Delete a todo from the list
function deleteTodoFromList(li, todo) {
  todoList.removeChild(li);
}

// Save a todo in storage
function saveTodoInStorage(todo) {
  chrome.storage.sync.get('todos', ({ todos }) => {
    todos = todos || [];
    todos.push(todo);
    chrome.storage.sync.set({ todos });
  });
}

// Delete a todo from storage
function deleteTodoFromStorage(todo) {
  chrome.storage.sync.get('todos', ({ todos }) => {
    todos = todos || [];
    todos = todos.filter((t) => t !== todo);
    chrome.storage.sync.set({ todos });
  });
}

// Select all "Edit" buttons and add an event listener
const editButtons = document.querySelectorAll('.edit-button');
editButtons.forEach((button) => {
  button.addEventListener('click', () => {
    // Get the text of the todo item
    const todoText =
      button.parentNode.parentNode.querySelector('span').textContent;

    // Show an input field and hide the todo text
    const inputField = document.createElement('input');
    inputField.setAttribute('class', 'edit-input-field');
    inputField.type = 'text';
    inputField.value = todoText;
    const todoTextElement = button.parentNode.parentNode.querySelector('span');
    todoTextElement.parentNode.insertBefore(inputField, todoTextElement);
    todoTextElement.style.display = 'none';

    // Hide the "Edit" button and show a "Save" button
    button.style.display = 'none';
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.classList.add(
      'btn',
      'btn-sm',
      'btn-success',
      'mr-1',
      'save-button'
    );
    button.parentNode.insertBefore(saveButton, button.nextSibling);

    // Add an event listener for the "Save" button
    saveButton.addEventListener('click', () => {
      // Get the new todo text and update the todo item
      const newTodoText = inputField.value;
      todoTextElement.textContent = newTodoText;

      // Show the todo text and hide the input field
      todoTextElement.style.display = 'block';
      inputField.style.display = 'none';

      // Hide the "Save" button and show the "Edit" button
      saveButton.style.display = 'none';
      button.style.display = 'inline-block';
    });
  });
});

// Add event listeners to existing delete buttons
const deleteButtons = document.querySelectorAll('.delete-button');
deleteButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const li = button.parentNode.parentNode.parentNode;
    const todoText = li.querySelector('span').textContent;
    deleteTodoFromList(li, todoText);
    deleteTodoFromStorage(todoText);
  });
});
