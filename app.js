let tasks = [];
let isAscending = true;
let draggedTask = null;
let draggedTaskIndex = null;
let sortStatus = null;
let targetTask = null; 
let touchStartY = 0; 

const taskContainer = document.getElementById("taskContainer");
const addTaskControl = document.getElementById("addTaskControl");
const sortTasksButton = document.getElementById("sortTasks");
const newTaskSection = document.getElementById("newTaskSection");
const newTaskInput = newTaskSection.querySelector("input");
const newTaskRemoveButton = newTaskSection.querySelector("button");
const addTextButton = document.querySelector(".add-text");

const sortingButtons = {
  ascending: {
    active: "assets/artan-aktiv.svg",
    passive: "assets/artan.svg",
  },
  descending: {
    active: "assets/aktiv-azalan.svg",
    passive: "assets/azalan.svg",
  },
};

sortTasksButton.innerHTML = `<img src="${sortingButtons.ascending.passive}" />`;

sortTasksButton.addEventListener("mouseenter", (e) => {
  if (e.target.innerHTML.includes(sortingButtons.ascending.passive)) {
    e.target.innerHTML = `<img src="${sortingButtons.ascending.active}">`;
  } else if (e.target.innerHTML.includes(sortingButtons.descending.passive)) {
    e.target.innerHTML = `<img src="${sortingButtons.descending.active}">`;
  }
});

sortTasksButton.addEventListener("mouseleave", (e) => {
  if (e.target.innerHTML.includes(sortingButtons.ascending.active)) {
    e.target.innerHTML = `<img src="${sortingButtons.ascending.passive}">`;
  } else if (e.target.innerHTML.includes(sortingButtons.descending.active)) {
    e.target.innerHTML = `<img src="${sortingButtons.descending.passive}">`;
  }
});

function init() {
  renderTasks();

  if (tasks.length === 0) {
    taskContainer.classList.add("hidden");
  } else {
    newTaskSection.classList.add("hidden");
  }

  addTextButton.addEventListener("click", addTask);
  document.querySelector(".add-icon").addEventListener("click", () => {
    newTaskSection.classList.remove("hidden");
  });

  sortTasksButton.addEventListener("click", sortTasks);
  newTaskRemoveButton.addEventListener("click", () => {
    newTaskInput.value = "";
    if (tasks.length > 0) {
      toggleView();
    }
  });
}

function renderTasks() {
  if (tasks.length === 0) {
    taskContainer.classList.add("hidden");
  } else {
    taskContainer.classList.remove("hidden");
  }
  taskContainer.innerHTML = "";
  tasks.forEach((task, index) => createTaskElement(task, index));
  updateTaskNumbers();
  enableDragAndDrop();
}

function toggleView() {
  newTaskSection.classList.toggle("hidden");
}

function addTask() {
  const taskText = newTaskInput.value.trim();
  if (!taskText) return;
  tasks.push({ text: taskText });
  if (sortStatus) {
    sortTasks();
    sortTasks();
  }
  newTaskInput.value = "";
  toggleView();
  renderTasks();
}

function sortTasks() {
  sortStatus = true;
  tasks.sort((a, b) => {
    const textA = a.text.toLowerCase();
    const textB = b.text.toLowerCase();
    return isAscending ? textA.localeCompare(textB) : textB.localeCompare(textA);
  });

  isAscending = !isAscending;
  sortTasksButton.innerHTML = isAscending
    ? `<img src="${sortingButtons.ascending.active}" />`
    : `<img src="${sortingButtons.descending.active}" />`;

  renderTasks();
}

function updateTaskNumbers() {
  const taskItems = taskContainer.querySelectorAll(".task-item");
  taskItems.forEach((task, index) => {
    const taskNumber = task.querySelector(".task-number");
    taskNumber.textContent = `${index + 1}.`;
  });
}

function enableDragAndDrop() {
  const taskItems = taskContainer.querySelectorAll(".task-item");

  taskItems.forEach((task) => {
    task.addEventListener("dragstart", (event) => dragStart(event, task));
    task.addEventListener("dragover", dragOver);
    task.addEventListener("drop", (event) => dragDrop(event, task));

    task.addEventListener("touchstart", (event) => touchStart(event, task));
    task.addEventListener("touchmove", touchMove);
    task.addEventListener("touchend", touchEnd);
  });

  taskContainer.addEventListener("dragend", () => {
    if (draggedTask) {
      draggedTask.style.display = "flex";
      draggedTask = null;
    }
  });
}


function dragStart(event, task) {
  draggedTask = task;
  setTimeout(() => (task.style.display = "none"), 0);
  draggedTaskIndex = [...taskContainer.children].indexOf(task);
}

function dragOver(event) {
  event.preventDefault();
}

function dragDrop(event, targetTask) {
  const targetIndex = [...taskContainer.children].indexOf(targetTask);
  const draggedIndex = draggedTaskIndex;

  if (targetIndex !== draggedIndex) {
    const [movedTask] = tasks.splice(draggedIndex, 1);
    tasks.splice(targetIndex, 0, movedTask);
    renderTasks();
  }
  draggedTask.style.display = "flex";
  draggedTask = null;
}

function touchStart(event, task) {
  draggedTask = task;
  draggedTaskIndex = [...taskContainer.children].indexOf(task);
  touchStartY = event.touches[0].clientY;
}

function touchMove(event) {
  if (!draggedTask) return;

  event.preventDefault();
  const currentY = event.touches[0].clientY;

  const touchPoint = document.elementFromPoint(
    event.touches[0].clientX,
    currentY
  );

  if (touchPoint) {
    targetTask = touchPoint.closest(".task-item");
  }
}

function touchEnd() {
  if (draggedTask && targetTask && draggedTask !== targetTask) {
    const targetIndex = [...taskContainer.children].indexOf(targetTask);

    const [movedTask] = tasks.splice(draggedTaskIndex, 1);
    tasks.splice(targetIndex, 0, movedTask);

    renderTasks();
  }

  draggedTask = null;
  targetTask = null;
}


function createTaskElement(task, index) {
  const taskItem = document.createElement("li");
  taskItem.classList.add("task-item");
  taskItem.setAttribute("draggable", "true");

  const taskNumber = document.createElement("span");
  taskNumber.classList.add("task-number");
  taskNumber.textContent = `${index + 1}.`;

  const taskText = document.createElement("p");
  taskText.innerText = task.text;

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("remove-button");
  deleteButton.innerHTML = "✕";
  deleteButton.addEventListener("click", () => {
    tasks.splice(index, 1);
    renderTasks();
    if (tasks.length === 0) {
      toggleView();
    }
  });

  taskItem.appendChild(taskNumber);
  taskItem.appendChild(taskText);
  taskItem.appendChild(deleteButton);
  taskContainer.appendChild(taskItem);
}

init();
