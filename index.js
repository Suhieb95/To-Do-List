const toDoText = document.getElementById("to-do-value");
const idTxt = document.getElementById("to-do-id");
const isChecked = document.getElementById("to-do-checked");
const list = document.querySelector(".list");
const saveBtn = document.querySelector(".save-btn");
const updateBtn = document.querySelector(".update-btn");
const taskLeft = document.getElementById("tasks-left");
const date = document.getElementById("time");

document.addEventListener("DOMContentLoaded", () => {
  toDoText.focus();
  document
    .querySelector("form")
    .addEventListener("submit", (e) => e.preventDefault());
});

loadToDos();
getActiveCount();

function loadToDos() {
  list.replaceChildren();
  const items = getToDos();
  if (items !== null) {
    items?.forEach((item) => {
      addToItem(item);
      setCompletedDiv(item.id, item.completed);
    });
  }
}

function getToDos() {
  const items = JSON.parse(localStorage.getItem("todos"));
  return items?.sort((a, b) => a.createdAt - b.createdAt) ?? [];
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
  const dueOn = document.createElement("p");
  const editIco = editIcon();

  div.setAttribute("id", item.id);

  list.appendChild(div);
  div.appendChild(divContainer);
  div.appendChild(btnDivContainer);
  divContainer.appendChild(checkBox);
  divContainer.appendChild(divToDoContainer);

  addClassLists(div, divContainer, btnDivContainer, divToDoContainer);

  delBtn.innerText = "✖";

  createdAt.innerText = `Created At: ${formatDate(item.createdAt)}`;
  dueOn.innerText = `Due On: ${formatDate(item.dueOn)}`;

  var dueOnDate = new Date(item.dueOn);
  var currDate = new Date();
  let isValidDueDate = dueOnDate > currDate;
  let isDueOnToday = currDate.getDate() === dueOnDate.getDate();

  if (!isValidDueDate) {
    dueOn.style.color = "red";
    if (isDueOnToday) {
      dueOn.innerText = "Due: Today";
    }
  }

  checkBox.name = `${item.id}`;
  checkBox.type = "checkBox";
  checkBox.defaultChecked = item.completed;

  addEventListener(checkBox, li, delBtn, editBtn, item);
  drawCompletionElement(item.completed, li, item);

  divToDoContainer.appendChild(li);
  btnDivContainer.appendChild(delBtn);
  btnDivContainer.appendChild(editBtn);
  divToDoContainer.appendChild(dueOn);
  divToDoContainer.appendChild(createdAt);
  editBtn.appendChild(editIco);
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
  setCompletedDiv(id, checked);
}
function setCompletedDiv(id, checked) {
  const toDo = document.querySelectorAll(".to-do-item");
  const element = Array.from(toDo).find((ele) => ele.getAttribute("id") == id);
  if (checked) {
    element.setAttribute("completed", "");
  } else {
    element.removeAttribute("completed");
  }
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
  const dateValidationTxt = document.querySelector(".date-validation-text");
  const validationTxt = document.querySelector(".validation-text");
  const items = getToDos();
  const itemToUpdate = items?.find((curr) => curr.id === item.id);
  toDoText.value = itemToUpdate.value;
  idTxt.value = item.id;
  date.value = item.dueOn;
  isChecked.value = item.completed;
  showUpdateBtn();
  removeElements([validationTxt, dateValidationTxt]);
}
function addToDo() {
  const value = toDoText.value;
  const dateValue = date.value;

  validateInput(value);
  validateDate(dateValue);

  const currentToDos = getToDos();
  let todoItems = [];
  const newItem = {
    id: parseInt(Math.random() * 10000),
    value: value,
    completed: false,
    createdAt: new Date().toISOString(),
    dueOn: dateValue,
  };
  if (currentToDos !== null) {
    todoItems = [...currentToDos, newItem];
  } else {
    todoItems = [newItem];
  }

  setToDos(todoItems);
  addToItem(newItem);
  getActiveCount();
  resetInput();
}
function resetInput() {
  toDoText.value = "";
  date.value = null;
  toDoText.focus();
}
function validateInput(value) {
  const validationTxt = document.querySelector(".validation-text");
  const validationText = document.createElement("span");

  if (value === "") {
    if (validationTxt === null) {
      validationText.innerText = "To do value is Required!";
      validationText.classList.add("validation-text");
      document
        .querySelectorAll(".element-center .between")[0]
        .insertAdjacentElement("afterend", validationText);
    }
    throw new Error("Missing To do Value.");
  } else {
    removeElements([validationTxt]);
  }
}
function validateDate(value) {
  const dateValidationTxt = document.querySelector(".date-validation-text");
  const validationText = document.createElement("span");
  if (!isValidDate(value)) {
    if (dateValidationTxt === null) {
      validationText.innerText = "To do Date is Required!";
      validationText.classList.add("validation-text");
      document
        .querySelectorAll(".element-center .between")[1]
        .insertAdjacentElement("afterend", validationText);
    }
    throw new Error("Missing To do Date.");
  } else {
    removeElements([validationText]);
  }
}
function removeElements(ele) {
  ele.forEach((element) => {
    if (element !== null) {
      element.remove();
    }
  });
}
function isValidDate(value) {
  const date = new Date(value);
  return !isNaN(date);
}

function showUpdateBtn() {
  saveBtn.style.display = "none";
  updateBtn.style.display = "block";
}
function showSaveBtn() {
  saveBtn.style.display = "block";
  updateBtn.style.display = "none";
}
function setToDos(todoItems) {
  localStorage.setItem("todos", JSON.stringify(todoItems));
}

function updateToDo() {
  validateInput(idTxt.value);
  validateDate(date.value);
  const items = getToDos();
  const updatedItems = items.map((item) =>
    item.id === parseInt(idTxt.value)
      ? { ...item, value: toDoText.value, dueOn: date.value }
      : item
  );
  setToDos(updatedItems);
  showSaveBtn();
  loadToDos();
  resetInput();
}

function getActiveCount() {
  const items = getToDos();
  const count = items.filter((item) => item.completed === false);
  taskLeft.innerText = `You have ${count.length} Tasks Left!`;
}
function editIcon() {
  const editIco = document.createElement("img");

  editIco.src = "./pen-solid.svg";
  editIco.title = "Edit";
  editIco.alt = "Edit";
  editIco.loading = "eager";
  editIco.type = "image/svg+xml";
  editIco.width = "16";
  editIco.height = "16";
  editIco.style.marginTop = "7px";

  return editIco;
}
