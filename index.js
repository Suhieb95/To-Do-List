const toDoText = document.getElementById("to-do-value");
const idTxt = document.getElementById("to-do-id");
const isChecked = document.getElementById("to-do-checked");
const list = document.querySelector(".list");
const saveBtn = document.querySelector(".save-btn");
const updateBtn = document.querySelector(".update-btn");

loadToDos();

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
  const li = document.createElement("li");
  const delBtn = document.createElement("button");
  const editBtn = document.createElement("button");
  const checkBox = document.createElement("input");
  const del = document.createElement("del");

  div.setAttribute("id", item.id);

  list.appendChild(div);
  div.appendChild(checkBox);

  div.classList.add("to-do-item");
  div.classList.add("flex");
  div.classList.add("flex-row");

  delBtn.innerText = "Delete";
  editBtn.innerText = "Edit";

  checkBox.name = `${item.id}`;
  checkBox.type = "checkBox";
  checkBox.defaultChecked = item.completed;

  checkBox.addEventListener("change", (value) => {
    const isChecked = value.target.checked;
    setCompletedTodo(isChecked, item.id);
    if (isChecked) {
      del.innerText = item.value;
      li.innerText = "";
      li.appendChild(del);
    } else {
      li.innerHTML = "";
      li.textContent = item.value;
    }
  });
  delBtn.addEventListener("click", () => deleteToDo(item.id));
  editBtn.addEventListener("click", () => editToDo(item));

  if (item.completed) {
    const del = document.createElement("del");
    del.innerText = item.value;
    li.innerText = "";
    li.appendChild(del);
  } else {
    li.innerHTML = "";
    li.textContent = item.value;
  }
  div.appendChild(li);
  div.appendChild(delBtn);
  div.appendChild(editBtn);
}

function setCompletedTodo(checked, id) {
  const items = getToDos();
  const updatedItems = items?.map((item) => {
    return item.id === id ? { ...item, completed: checked } : item;
  });
  setToDos(updatedItems);
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
  if (value !== "") {
    const currentToDos = getToDos();
    let todoItems = [];
    const newItem = {
      id: parseInt(Math.random() * 10000),
      value: value,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    if (currentToDos !== null) {
      todoItems = [...currentToDos, newItem];
    } else {
      todoItems = [newItem];
    }

    setToDos(todoItems);
    toDoText.value = "";
    addToItem(newItem);
  }
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
