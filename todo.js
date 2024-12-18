const todoval = document.getElementById("todoinpt");
const todoalert = document.getElementById("alert");
const items = document.getElementById("list");
let todo = JSON.parse(localStorage.getItem("todo-list"));

if (!todo) {
  todo = [];
  localStorage.setItem("todo-list", JSON.stringify(todo));
}

let updateText = null; // To keep track of the item being edited

function CreateList() {
  if (todoval.value === "") {
    todoalert.innerText = "Please enter your task!!!";
    todoval.focus();
  } else {
    let li = document.createElement("li");
    const todoItems = `<div title="Hit Double Click and Complete" ondblclick="CompletedToDoItems(this)">${todoval.value}</div><div>
                        <i class="edit todo-controls fa-duotone fa-light fa-pen-to-square" onclick="UpdateToDoItems(this)"></i>
                        <i class="delete todo-controls fa-solid fa-trash xl" onclick="DeleteToDoItems(this)"></i></div>`;
    li.innerHTML = todoItems;
    items.appendChild(li);

    todo.push(todoval.value);
    localStorage.setItem("todo-list", JSON.stringify(todo));

    todoval.value = "";
    todoalert.innerText = "";
  }
}

function UpdateToDoItems(e) {
  const taskDiv = e.parentElement.parentElement.querySelector("div");
  if (taskDiv.style.textDecoration === "") {
    todoval.value = taskDiv.innerText;
    updateText = taskDiv;

    const addButton = document.getElementById("addlst");
    addButton.setAttribute("onclick", "UpdateOnSelectionItems()");
    todoval.focus();
  }
}

function UpdateOnSelectionItems() {
  if (todoval.value === "") {
    todoalert.innerText = "Please enter a valid task!";
    todoval.focus();
  } else {
    // Update the task in the DOM
    updateText.innerText = todoval.value;

    // Update the task in localStorage
    todo = JSON.parse(localStorage.getItem("todo-list"));
    const taskIndex = todo.indexOf(updateText.innerText);
    todo[taskIndex] = todoval.value;
    localStorage.setItem("todo-list", JSON.stringify(todo));

    const addButton = document.getElementById("addlst");
    addButton.setAttribute("onclick", "CreateList()");
    todoval.value = "";
    todoalert.innerText = "";

    // Re-attach the delete functionality
    reattachDeleteButtons();
  }
}

function DeleteToDoItems(e) {
  const taskDiv = e.parentElement.parentElement.querySelector("div");
  const taskText = taskDiv.innerText;
  const taskIndex = todo.indexOf(taskText);

  if (taskIndex > -1) {
    todo.splice(taskIndex, 1);
    localStorage.setItem("todo-list", JSON.stringify(todo));

    e.parentElement.parentElement.remove();
  }
}

function CompletedToDoItems(e) {
  const taskDiv = e.closest("li").querySelector("div");
  if (!taskDiv) return;

  if (taskDiv.style.textDecoration === "") {
    taskDiv.style.textDecoration = "line-through";
  } else {
    taskDiv.style.textDecoration = "";
  }

  const taskIndex = todo.indexOf(taskDiv.innerText);
  if (taskIndex > -1) {
    if (taskDiv.style.textDecoration === "line-through") {
      todo[taskIndex] = taskDiv.innerText + " (Completed)";
    } else {
      todo[taskIndex] = taskDiv.innerText.replace(" (Completed)", "");
    }
    localStorage.setItem("todo-list", JSON.stringify(todo));
  }
}

function reattachDeleteButtons() {
  // Reattach the delete event listeners after task updates
  const deleteButtons = document.querySelectorAll(".delete");
  deleteButtons.forEach((button) => {
    button.removeEventListener("click", deleteHandler); // Remove old listener
    button.addEventListener("click", deleteHandler); // Add new listener
  });
}

function deleteHandler(e) {
  const taskDiv = e.parentElement.parentElement.querySelector("div");
  const taskText = taskDiv.innerText;
  const taskIndex = todo.indexOf(taskText);

  if (taskIndex > -1) {
    todo.splice(taskIndex, 1);
    localStorage.setItem("todo-list", JSON.stringify(todo));

    e.parentElement.parentElement.remove();
  }
}

window.onload = () => {
  if (todo.length > 0) {
    todo.forEach((task) => {
      let li = document.createElement("li");
      const todoItems = `<div title="Hit Double Click and Complete" ondblclick="CompletedToDoItems(this)">${task}</div><div>
                          <i class="edit todo-controls fa-duotone fa-light fa-pen-to-square" onclick="UpdateToDoItems(this)"></i>
                          <i class="delete todo-controls fa-solid fa-trash xl" onclick="DeleteToDoItems(this)"></i></div>`;
      li.innerHTML = todoItems;
      items.appendChild(li);
    });
  }
};
