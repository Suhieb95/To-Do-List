const toDoText = document.getElementById("to-do-value");
const idTxt = document.getElementById("to-do-id");
const isChecked = document.getElementById("to-do-checked");
const list = document.querySelector(".list");
const saveBtn = document.querySelector(".save-btn");
const updateBtn = document.querySelector(".update-btn");
const taskLeft = document.getElementById("tasks-left");

window.onload = () => toDoText.focus();

loadToDos();
getActiveCount();

function loadToDos() {
  list.replaceChildren();
  const items = getToDos();
  if (items !== null) {
    items?.forEach((item) => {
      addToItem(item);
    });
  }
}

function getToDos() {
  const items = JSON.parse(localStorage.getItem("todos"));
  return items?.sort((a, b) => a.createdAt - b.createdAt);
}
function addToItem(item) {
  const div = document.createElement("div");
  const divContainer = document.createElement("div");
  const divToDoContainer = document.createElement("div");
  const btnDivContainer = document.createElement("div");
  const li = document.createElement("li");
  const delBtn = document.createElement("button");
  const editBtn = document.createElement("button");
  const checkBox = document.createElement("input");
  const createdAt = document.createElement("p");

  div.setAttribute("id", item.id);

  list.appendChild(div);
  div.appendChild(divContainer);
  div.appendChild(btnDivContainer);
  divContainer.appendChild(checkBox);
  divContainer.appendChild(divToDoContainer);

  addClassLists(div, divContainer, btnDivContainer, divToDoContainer);

  delBtn.innerText = "✖";
  editBtn.innerText = "✎";

  let formattedDateTime = formatDate(item.createdAt);
  createdAt.innerText = "Created At: " + formattedDateTime;

  checkBox.name = `${item.id}`;
  checkBox.type = "checkBox";
  checkBox.defaultChecked = item.completed;

  addEventListener(checkBox, li, delBtn, editBtn, item);
  drawCompletionElement(item.completed, li, item);

  divToDoContainer.appendChild(li);
  btnDivContainer.appendChild(delBtn);
  btnDivContainer.appendChild(editBtn);
  divToDoContainer.appendChild(createdAt);
}

function addClassLists(div, divContainer, btnDivContainer, divToDoContainer) {
  div.classList.add("to-do-item");
  div.classList.add("flex-row");
  div.classList.add("element-center");
  div.classList.add("card");
  div.classList.add("between");

  divContainer.classList.add("flex-row");
  divContainer.classList.add("element-center");
  divContainer.classList.add("todo-content-container");

  btnDivContainer.classList.add("flex-row");
  btnDivContainer.classList.add("element-center");
  btnDivContainer.classList.add("btn-container");

  divToDoContainer.classList.add("flex-col");
  divToDoContainer.classList.add("element-center");
  divToDoContainer.classList.add("todo-content-container");
}

function formatDate(item) {
  const options = {
    timeZone: "Asia/Dubai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  const formatter = new Intl.DateTimeFormat("en-GB", options);
  let formattedDateTime = formatter.format(new Date(item));
  formattedDateTime = formattedDateTime.replace(/(am|pm)/, (match) =>
    match.toUpperCase()
  );
  return formattedDateTime;
}

function addEventListener(checkBox, li, delBtn, editBtn, item) {
  checkBox.addEventListener("change", (value) => {
    const isChecked = value.target.checked;
    setCompletedTodo(isChecked, item.id);
    drawCompletionElement(isChecked, li, item);
  });
  delBtn.addEventListener("click", () => deleteToDo(item.id));
  editBtn.addEventListener("click", () => editToDo(item));
}

function drawCompletionElement(isChecked, li, item) {
  const del = document.createElement("del");
  if (isChecked) {
    del.textContent = item.value;
    li.textContent = "";
    li.appendChild(del);
  } else {
    li.textContent = item.value;
  }
}

function setCompletedTodo(checked, id) {
  const items = getToDos();
  const updatedItems = items?.map((item) => {
    return item.id === id ? { ...item, completed: checked } : item;
  });
  setToDos(updatedItems);
  getActiveCount();
}
function deleteToDo(id) {
  const items = getToDos();
  const updatedItems = items?.filter((item) => item.id !== id);
  setToDos(updatedItems);

  list.childNodes.forEach((ele) => {
    if (ele.getAttribute("id") == id) {
      list.removeChild(ele);
    }
  });
  getActiveCount();
  showSaveBtn();
}
function editToDo(item) {
  const items = getToDos();
  const itemToUpdate = items?.find((curr) => curr.id === item.id);
  toDoText.value = itemToUpdate.value;
  idTxt.value = item.id;
  isChecked.value = item.completed;
  showUpdateBtn();
}
function addToDo() {
  const value = toDoText.value;
  validateInput(value);
  const currentToDos = getToDos();
  let todoItems = [];
  const newItem = {
    id: parseInt(Math.random() * 10000),
    value: value,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  if (currentToDos !== null) {
    todoItems = [...(currentToDos ?? []), newItem];
  } else {
    todoItems = [newItem];
  }

  setToDos(todoItems);
  toDoText.value = "";
  addToItem(newItem);
  getActiveCount();
  toDoText.focus();
}
function validateInput(value) {
  const validationTxt = document.querySelector(".validation-text");
  const validationText = document.createElement("span");
  if (value === "") {
    if (validationTxt === null) {
      validationText.innerText = "To do value is Required!";
      validationText.classList.add("validation-text");

      toDoText.insertAdjacentElement("afterend", validationText);
    }
    throw new Error("Missing To do Value.");
  } else {
    if (validationTxt !== null) {
      validationTxt.remove();
    }
  }
}
function showUpdateBtn() {
  saveBtn.style.display = "none";
  updateBtn.style.display = "block";
}
function showSaveBtn() {
  saveBtn.style.display = "block";
  updateBtn.style.display = "none";
  toDoText.value = "";
}
function setToDos(todoItems) {
  localStorage.setItem("todos", JSON.stringify(todoItems));
}

function updateToDo() {
  validateInput(idTxt.value);
  const items = getToDos();
  const updatedItems = items.map((item) =>
    item.id === parseInt(idTxt.value)
      ? { ...item, value: toDoText.value }
      : item
  );
  setToDos(updatedItems);
  showSaveBtn();
  loadToDos();
}

function getActiveCount() {
  const items = getToDos();
  const count = items.filter((item) => item.completed === false);
  taskLeft.innerText = `You have ${count.length} Tasks Left!`;
}
