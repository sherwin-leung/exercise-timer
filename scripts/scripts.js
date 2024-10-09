/**
 * * Global Variables
 */
let currentlySelectedExerciseButtonId;
let tempExerciseArray = [];

/**
 * * Constructors for various Objects
 */
class Exercise {
     constructor(name, duration) {
          this.name = name;
          this.duration = duration;
     }
}

class Routine {
     constructor(name, exerciseList) {
          this.name = name;
          this.exerciseList = exerciseList;
     }
}

/**
 * * On page load, run this function
 */
window.onload = pageLoad();

/**
 * This function is a collection of functions that need to be run upon the user loading the page
 */
function pageLoad() {
     testDisplay(); // ! testing only, remove later
     refreshExerciseCards();
     displayCurrentlyLoadedRoutine();
}

/**
 * * Helper Functions
 *
 * checkIfAlreadyExistsInLocalStorage() checks if an exercise or routine already exists in localStorage
 *
 * convertToTitleCase(str) takes a string and returns it As Title Case (capitalizes the first letter of each word in a string)
 *
 * hideShowNewRoutineButton() hides the [Save New Routine] button in the New Routine section
 *
 * showShowNewRoutineButton() show the [Save New Routine] button in the New Routine section
 *
 */

// ! for testing area, remove later
function testDisplay() {
     // puts stuff in the testing area
     const exercises = localStorage.getItem("exerciseDataKey");
     document.getElementById("testing-area").innerHTML = `Here are the exercises:<br>${exercises}`;

     const routines = localStorage.getItem("routineDataKey");
     document.getElementById("testing-area").innerHTML += `<br><br>Here are the routines:<br>${routines}`;
}

// Helper function
function checkIfAlreadyExistsInLocalStorage(arrayToCheck, name) {
     for (i = 0; i < arrayToCheck.length; i++) {
          if (arrayToCheck[i].name === name) {
               return true;
          }
     }
     return false;
}

// Helper function
function convertToTitleCase(str) {
     return str.toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());
}

// Helper function
function hideSaveNewRoutineButton() {
     document.getElementById("button-save-routine").style.display = "none";
}

// Helper function
function showSaveNewRoutineButton() {
     document.getElementById("button-save-routine").style.display = "block";
}

/**
 * * This function handles toggling on and off the view of certain contents when the main three buttons are clicked/tapped
 * @param divId indicates which div to toggle on and off
 */
function toggleViewOnAndOff(divId) {
     const view = document.getElementById(divId);

     if (view.style.display === "block") {
          view.style.display = "none";
     } else {
          view.style.display = "block";
     }
}

/**
 * * This function handles the creation and saving of new Exercises into localStorage
 */
function saveNewExerciseToLocalStorage() {
     event.preventDefault();

     // Get existing data from localStorage or retrieve an empty array if there is none as a fallback
     const existingExerciseData = JSON.parse(localStorage.getItem("exerciseDataKey")) || [];

     // Store user's input
     const exerciseName = document.getElementById("new-exercise-input").value;

     // Only create a new Exercise if its name isn't an empty string and it doesn't already exist
     if (exerciseName.trim().length > 0 && checkIfAlreadyExistsInLocalStorage(existingExerciseData, exerciseName) === false) {
          // Create a new Exercise Object and pushes it into the existing exercise data. Afterwards, save existing data with the new Exercise to localStorage
          const newExercise = new Exercise(exerciseName, 0);
          existingExerciseData.push(newExercise);
          localStorage.setItem("exerciseDataKey", JSON.stringify(existingExerciseData));

          // Refreshes buttons
          refreshExerciseCards();
     }

     // Always resets the input field to be empty
     document.getElementById("new-exercise-input").value = "";

     // ! for testing area, remove later
     testDisplay();
}

/**
 * * The following three functions work together
 * refreshExerciseCards() couples the two following functions together
 * clearExerciseCards() which clears all existing exercise cards
 * renderExerciseCards() which renders all the exercise cards anew
 */
function refreshExerciseCards() {
     clearExerciseCards();
     renderExerciseCards();
}

function clearExerciseCards() {
     const parentExerciseCardsContainer = document.getElementById("exercise-cards-container");
     let childButton = parentExerciseCardsContainer.firstElementChild;

     while (childButton) {
          parentExerciseCardsContainer.removeChild(childButton);
          childButton = parentExerciseCardsContainer.firstElementChild;
     }
}

function renderExerciseCards() {
     // Create the Add Rest button which is always at the beginning
     createNewExerciseCard("rest");

     // Grabs existing exercises data from localStorage and converts it into an array
     const existingExerciseDataInStringForm = localStorage.getItem("exerciseDataKey");
     const existingExerciseDataInArrayForm = existingExerciseDataInStringForm ? JSON.parse(existingExerciseDataInStringForm) : [];

     // Now for each  exercise in the array
     for (i = 0; i < existingExerciseDataInArrayForm.length; i++) {
          const name = existingExerciseDataInArrayForm[i].name;
          createNewExerciseCard(name);
     }

     // Add Event Listeners to to all exercise buttons
     addEventListenerToExerciseButtons();

     // Add Event Listeners to all add buttons
     addEventListenerToAddButtons();
}

/**
 * * This function creates an exercise "card", which consists of:
 * 1) A div container (parent)
 * 2) A button displaying the exercise's name (child)
 * 3) A label for the input below
 * 4) A number input for the exercise duration
 * 5) A button that allows the user to add the exercise & duration to a temporary array which will pushed into the Routine object later
 *
 * @param {*} name Retrieves name of exercise(s) from localStorage key/value pair exerciseDataKey
 */
function createNewExerciseCard(name) {
     // This is just so that if an exercise name is two words, like "jumping jacks", we won't get class/id/etc as "class="jumping jacks" but rather "class="jumping-jacks"
     const nameHyphenated = name.split(" ").join("-");

     // Create a new div which acts as as the card container
     const newButtonInputContainer = document.createElement("div");
     newButtonInputContainer.classList.add("exercise-card");
     document.getElementById("exercise-cards-container").append(newButtonInputContainer);

     // Create a button then append it to the parent container
     const newExerciseButton = document.createElement("button");
     newExerciseButton.textContent = name; // ! We do NOT want to force hyphenation here
     newExerciseButton.classList.add("button-exercise");
     newExerciseButton.id = `${nameHyphenated}`;
     newButtonInputContainer.append(newExerciseButton);

     // Create a new label and append it to the parent container
     const newDurationLabel = document.createElement("label");
     newDurationLabel.textContent = "Duration (in seconds)";
     newDurationLabel.classList.add("label-duration");
     newDurationLabel.htmlFor = `input-${nameHyphenated}`; // Setting for
     newButtonInputContainer.append(newDurationLabel);

     // Create a new input and append it to the parent container
     const newDurationInput = document.createElement("input");
     newDurationInput.classList.add("input-duration");
     newDurationInput.id = `input-${nameHyphenated}`;
     newDurationInput.type = "number";
     newDurationInput.name = `input-${nameHyphenated}`;
     newDurationInput.value = 60; // default value
     newButtonInputContainer.append(newDurationInput);

     // Create another button and append it to the parent container. This one is for submitting
     const newAddButton = document.createElement("button");
     newAddButton.textContent = "Add";
     newAddButton.classList.add("button-add");
     newButtonInputContainer.append(newAddButton);
}

/**
 * * This function gives all exercise buttons an Event Listener
 * On click of a button, it will unhide/"expand" the exercise card associated with  it and hide/"close" previous expanded cards
 * Also stores the id of the currently expanded button in global variable currentSelectedExerciseButtonId
 */
function addEventListenerToExerciseButtons() {
     const exerciseButtons = document.querySelectorAll(".button-exercise");

     exerciseButtons.forEach(function (currentButton) {
          currentButton.addEventListener("click", function () {
               // Hide all labels, inputs, and add buttons first
               const allContainers = document.querySelectorAll(".exercise-card");
               allContainers.forEach(function (container) {
                    container.querySelector("label").style.display = "none";
                    container.querySelector("input").style.display = "none";
                    container.querySelector(".button-add").style.display = "none";
               });

               // Find the parent container of the button
               const currentContainer = currentButton.closest(".exercise-card");

               // Select the label, input, and add button within the same container and unhide them
               currentContainer.querySelector("label").style.display = "block";
               currentContainer.querySelector("input").style.display = "block";
               currentContainer.querySelector(".button-add").style.display = "block";

               // Stores id of current exerciseButton selected/"expanded" in global variable to keep track of which is selected/"expanded"
               currentlySelectedExerciseButtonId = currentButton.id;
          });
     });
}

/**
 * * This function allows the user to use the exercise cards to add exercises into a temporary array which will then be used as a property of new Routines
 * Paired with it is the Event Listener that assigns the function to ALL [Add] buttons
 */
function addToTempExerciseList() {
     const exerciseDuration = document.getElementById(`input-${currentlySelectedExerciseButtonId}`).value;

     const newExercise = new Exercise(currentlySelectedExerciseButtonId, exerciseDuration);
     tempExerciseArray.push(newExercise); // tempExerciseArray in global variables
}

// Paired with above and below
function addEventListenerToAddButtons() {
     const addButtons = document.querySelectorAll(".button-add");

     addButtons.forEach(function (currentButton) {
          currentButton.addEventListener("click", function () {
               addToTempExerciseList();

               // Shows button to allow user to save the Routine
               showSaveNewRoutineButton();
          });
     });
}

/**
 * * This function handles the creation and saving of new Routines into localStorage
 * Paired with it is the Event Listener that assigns the function to the [Save New Routine] button
 */
function saveNewRoutineToLocalStorage() {
     // Store name of new Routine from input
     const routineName = document.getElementById("new-routine-input").value;

     // Only create a new Routine if its name isn't an empty string
     if (routineName.trim().length > 0) {
          const newRoutine = new Routine(routineName, tempExerciseArray);
          localStorage.setItem("routineDataKey", JSON.stringify(newRoutine));

          // ! still developing this function
          // Displays to the user the currently loaded Routine
          displayCurrentlyLoadedRoutine();

          // Always resets the input field to be empty
          document.getElementById("new-routine-input").value = "";

          // Empties out the temporary array
          tempExerciseArray = [];

          // Hides the [Save New Routine] button for next time
          hideSaveNewRoutineButton();

          // ! testing only, remove later
          testDisplay();
     }
}

// Paired with above
document.getElementById("button-save-routine").addEventListener("click", function () {
     saveNewRoutineToLocalStorage();
});

/**
 * * This function displays the currently loaded Routine to the user. It persists on page load and refreshes when user saves a new Routine
 */
function displayCurrentlyLoadedRoutine() {
     // Grab the saved Routine from localStorage
     const currentlyLoadedRoutine = JSON.parse(localStorage.getItem("routineDataKey"));

     if (currentlyLoadedRoutine !== null) {
          // Displaying the Routine's name
          const currentlyLoadedRoutineName = document.getElementById("currently-loaded-routine-name");
          currentlyLoadedRoutineName.textContent = currentlyLoadedRoutine.name;

          // Displaying the exercise list in the Routine
          const exerciseDetails = document.getElementById("exercise-details");

          let exerciseDetailsHTML = "<ol>";
          for (i = 0; i < currentlyLoadedRoutine.exerciseList.length; i++) {
               exerciseDetailsHTML += `<li>${currentlyLoadedRoutine.exerciseList[i].name} - ${currentlyLoadedRoutine.exerciseList[i].duration} seconds</li>`;
          }
          exerciseDetailsHTML += "</ol>";

          exerciseDetails.innerHTML = exerciseDetailsHTML;
     }
}

// TODO:
