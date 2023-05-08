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
    <div class="d-flex justify-content-between align-items-start">
      <span style="word-break: break-word;">${todo}</span>
      <div style="min-width: 55px; text-align: right; padding-right: 5px">
        <button class="edit-button bg-transparent border-0 text-success pr-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
          </svg>
        </button>
        <button class="delete-button bg-transparent border-0 text-secondary p-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
      </svg>
        </button>
      </div>
    </div>
  `;
  const deleteButton = li.querySelector('.delete-button');
  const editButton = li.querySelector('.edit-button');

  const handleEditButton = (e) => {
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
    // Focus on edit input field
    inputField.focus();

    const saveButton = document.createElement('button');
    // saveButton.textContent = 'Save';
    saveButton.setAttribute('class', 'bg-transparent border-0 text-warning');
    saveButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-square" viewBox="0 0 16 16">
    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
    <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/>
  </svg>`;
    saveButton.classList.add('mr-1', 'save-button');
    editButton.parentNode.insertBefore(saveButton, editButton.nextSibling);

    // Add an event listener for the "Save" button and Enter key press on the input field
    saveButton.addEventListener('click', updateTodo);
    inputField.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
        updateTodo();
      }
    });

    function updateTodo() {
      // Get the new todo text and update the todo item
      const newTodoText = inputField.value;
      todoTextElement.textContent = newTodoText;

      // Show the todo text and hide the input field
      todoTextElement.style.display = 'block';
      inputField.style.display = 'none';

      // Hide the "Save" button and show the "Edit" button
      saveButton.style.display = 'none';
      editButton.style.display = 'inline-block';

      // Update the todo in storage
      updateTodoInStorage(todo, newTodoText);
    }

    // Update a todo in storage
    function updateTodoInStorage(oldTodo, newTodo) {
      chrome.storage.sync.get('todos', ({ todos }) => {
        todos = todos || [];
        todos = todos.map((t) => (t === oldTodo ? newTodo : t));
        chrome.storage.sync.set({ todos });
      });
    }
  };

  editButton.addEventListener('click', handleEditButton);

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
