/* eslint-disable no-unused-vars, prefer-const */
/* globals fetch, moment */
const apiUrl = "http://localhost:3000/notes"
let form = document.getElementById("notes")
let noteInput = document.getElementById("textbox")
let savedNoteList = document.querySelector(".saved_notes")
let formIsValid

form.addEventListener("submit", validate)
function validate(event) {
  event.preventDefault()

  formIsValid = true
}

function markFormInvalid() {
  formIsValid = false
}

rendersavedNotes();

form.addEventListener("submit", function (event) {
  event.preventDefault()

  createNewNoteItem(noteInput.value)
});

// POST with validation
function createNewNoteItem(inputText) {
  let parentEl = noteInput.parentElement
  if (noteInput.value) {
    parentEl.classList.remove("input-invalid")
    parentEl.classList.add("input-valid")
  } else {
    parentEl.classList.remove("input-valid")
    parentEl.classList.add("input-invalid")
    InvalidMessageName();
  }
  fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      item: inputText,
      created: moment().format("MMMM Do YYYY, h:mm:ss a")
    })
  })
    .then((response) => response.json())
    .then(() => {
      noteInput.value = ""
      rendersavedNotes()
    })
}


//Show all the saved notes
function rendersavedNotes() {
  savedNoteList.innerHTML = ""
  fetch(apiUrl, {
    method: "GET" 
  })
    .then((response) => response.json())
    .then(function (data) {
      
      let list = document.createElement("ul")
      list.id = "item-list"
      for (let item of data) {
        let listItem = document.createElement("li")
        listItem.dataset.id = item.id
        listItem.innerText = item.item
    // Creating Icon. I wanted to create an edit Icon beside the delete icon, but I couldn't figure it out    
        let deleteIcon = document.createElement("span")
        deleteIcon.id = "delete"
        deleteIcon.classList.add("fa", "fa-trash", "mar-l-xs")
        listItem.appendChild(deleteIcon)
        list.appendChild(listItem)
      }
      savedNoteList.appendChild(list)
    })
}

//Delete
savedNoteList.addEventListener("click", deleteSavedNoteItem);

function deleteSavedNoteItem(event) {
  let targetEl = event.target;
  if (targetEl.matches("#delete")) {
   
    let itemId = targetEl.parentElement.dataset.id;
    let itemToDelete = document.querySelector(`li[data-id='${itemId}']`)
    
    fetch(`${apiUrl}/${itemId}`, {
      method: "DELETE",
    }).then(function () {
      document.querySelector("#item-list").removeChild(itemToDelete);
    })
  }
}
/*function editSavedNotes ()
fetch(apiUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item: inputText, created: moment().format('MMMM Do YYYY, h:mm:ss a') })
  })
  .then(response => response.json())
    .then(() => {
      noteInput.value = '' // the input should be cleared
      rendersavedNotes()
    })*/

function InvalidMessageName() {
  let existingEl = document.getElementById("textbox")
  let newElement = document.createElement("p");
  let invalidMessage = document.createTextNode("Field cannot be left balnk")
  newElement.classList.add("blankmessage")
  newElement.appendChild(invalidMessage)
  existingEl.appendChild(newElement)
}
