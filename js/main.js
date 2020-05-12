let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let todoList = [
  {
    event: "Dentist AppoIntment",
    startDate: "2020-05-05",
    endDate: "2020-05-05",
  },
  {
    event: "Ashley's Birthday",
    startDate: "2020-05-18",
    endDate: "2020-05-24",
  },
  {
    event: "Proposal Date",
    startDate: "2020-05-05",
    endDate: "2020-05-31",
  },
];

todoList = new Proxy(todoList, {
  set(target, prop, val) {
    // 拦截写入属性操作
    target[prop] = val;
    showTodos(target);
    return true;
  },
});

const addTodoButton = document.getElementById("addTodo");

const formDialog = document.getElementById("formDialog");
const confirmBtn = document.getElementById("confirmBtn");
const cancelBtn = document.querySelector("#cancelBtn");
const todoEventInput = document.getElementById("todoEventInput");
const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");

const todoItems = document.querySelector(".todoItems");
const todosDock = document.getElementById("todosDock");
const currentWeekday = todosDock.querySelector(".currentWeekday");
const currentDay = todosDock.querySelector(".currentDay");
const monthShow = document.querySelector(".month-current");
const yearShow = document.querySelector(".year");
const prevMonthShow = document.querySelector(".month-prev");
const nextMonthShow = document.querySelector(".month-next");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");

function showTodos(todoList) {
  todoItems.innerHTML = "";
  todoList.forEach((i) => {
    let todoItem = document.createElement("div");
    todoItem.classList.add("todoItem");
    let todoDate = document.createElement("div");
    todoDate.innerText = i.endDate.split("-").pop();
    todoDate.classList.add("todoDate");
    let todoDetail = document.createElement("div");
    todoDetail.innerText = i.event;
    todoDetail.classList.add("todoDetail");
    todoItem.append(todoDate);
    todoItem.append(todoDetail);
    todoItems.append(todoItem);
  });
}


function initCalendar() {
  let today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();
  
  prevMonthBtn.addEventListener("click",previous)
  nextMonthBtn.addEventListener("click",next)

  showCalendar(currentMonth, currentYear);

  function next() {
    currentYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    showCalendar(currentMonth, currentYear);
  }

  function previous() {
    currentYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    showCalendar(currentMonth, currentYear);
  }

  function jump() {
    currentYear = parseInt(selectYear.value);
    currentMonth = parseInt(selectMonth.value);
    showCalendar(currentMonth, currentYear);
  }

  function showCalendar(month, year) {
    let firstDay = new Date(year, month, 1).getDay();
    let daysOfPrevMonth = new Date(year, month, 0).getDate();
    prevMonthDays = Array.from(
      { length: daysOfPrevMonth },
      (e, i) => i + 1
    ).slice(daysOfPrevMonth - firstDay);
    let daysInMonth = 32 - new Date(year, month, 32).getDate();

    let calendarDays = document.querySelector(".calendar-days"); // body of the calendar

    // clearing all previous cells
    calendarDays.innerHTML = "";

    // filing data about month and in the page via DOM.
    monthShow.innerText = months[month];
    prevMonthShow.innerText = months[month - 1 > 0 ? month - 1 : 11];
    nextMonthShow.innerText = months[month + 1 < 12 ? month + 1 : 0];
    yearShow.innerText = year;

    // creating all cells
    let date = 1;
    let fragment = new DocumentFragment();
    for (let i = 0; i < 6; i++) {
      //creating individual cells, filing them up with data.
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          let cell = document.createElement("div");
          let cellText = document.createTextNode(prevMonthDays[j]);
          cell.classList.add("day");
          cell.appendChild(cellText);
          cell.classList.add("prev-month");
          fragment.appendChild(cell);
        } else if (date > daysInMonth) {
          break;
        } else {
          let cell = document.createElement("div");
          let cellText = document.createTextNode(date);
          cell.classList.add("day");
          if (
            date === today.getDate() &&
            year === today.getFullYear() &&
            month === today.getMonth()
          ) {
            cell.classList.add("currentDay");
          } // color today's date
          if (j === 0 || j === 6) {
            cell.classList.add("weekend");
          } else {
            cell.classList.add("workday");
          }
          cell.appendChild(cellText);
          fragment.appendChild(cell);
          date++;
        }
      }
      calendarDays.appendChild(fragment); // appending each row into calendar body.
    }
  }

}

function initEventDocks() {
  let today = new Date();
  currentWeekday.innerText = daysOfWeek[today.getDay()];
  currentDay.innerText = `${months[today.getMonth()]} ${today.getDate()}`;

  showTodos(todoList);
}

function initModalForm() {
  // "Update details" button opens the <dialog> modally
  addTodoButton.addEventListener("click", function onOpen() {
    if (typeof formDialog.showModal === "function") {
      formDialog.showModal();
    } else {
      alert("The <dialog> API is not supported by this browser");
    }
  });

  //close the dialog modal
  cancelBtn.addEventListener("click", () => {
    clearForm();
    formDialog.close();
  });

  confirmBtn.addEventListener("click", () => {
    todoList.push({
      event: todoEventInput.value,
      startDate: startDate.value,
      endDate: endDate.value,
    });
    clearForm();
    formDialog.close();
  });

  function clearForm() {
    todoEventInput.value = "";
    let today = new Date();
    todayStr = `${today.getFullYear()}-${today
      .getMonth()
      .toString()
      .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

    startDate.value = todayStr;
    endDate.value = todayStr;
  }
}

function ready(fn) {
  if (document.readyState != "loading") {
    fn(); //ie9
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

function init() {
  initCalendar();
  initEventDocks();
  initModalForm();
}

ready(init);
