const aircraftGrid = document.getElementById('aircraftGrid');
const openAddBtn = document.getElementById('openAdd');

let fleet = JSON.parse(localStorage.getItem('myFleet')) || [];

renderFleet();


function addAircraft(tailNumber, nameType, hourNumber) {
    const newPlane = {
        id: Date.now(),
        tail: tailNumber,
        name: nameType,
        hours: hourNumber
    };

    fleet.push(newPlane);
    localStorage.setItem('myFleet', JSON.stringify(fleet));
    renderFleet();
    populateAircraftDropdown()
}


function renderFleet() {
    aircraftGrid.innerHTML = '';

    if (fleet.length === 0) {
        aircraftGrid.innerHTML = '<p class="empty-state">No aircraft added yet.</p>';
        return;
    }


    fleet.forEach(plane => {
        const card = document.createElement('div');
        card.className = 'aircraft-card';

        card.innerHTML = `
            <svg width="50" height="50" viewBox="0 0 24 24" style="background-color: #e2f4ff; border-radius: 8px;">
            <!-- Airplane Icon -->
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1-1-1s-1 .17-1 1V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5L21 16z" fill="#0277bd" />
        </svg>
            <div class="aircraft-info">
                <h3>${plane.tail}</h3>
                <p>${plane.name}</p>
                <p>${plane.hours}</p>
            </div>
            <button class="edit-button" id=${plane.tail}>...</button>
        `;

        aircraftGrid.appendChild(card);
    });
}

const addAircraftModal = document.getElementById('addAircraftModal');
const closeBtn = document.getElementById('closeBtn');

openAddBtn.addEventListener('click', () => {
    addAircraftModal.classList.add('active');
});

closeBtn.addEventListener('click', () => {
    addAircraftModal.classList.remove('active');
});

const aircraftForm = document.getElementById('aircraftForm');

aircraftForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const tailInput = aircraftForm.elements['tail-input'].value;
    const nameInput = aircraftForm.elements['name-input'].value;
    const hoursInput = aircraftForm.elements['hour-input'].value;

    addAircraft(tailInput, nameInput, hoursInput);

    aircraftForm.reset();
    addAircraftModal.classList.remove('active');
});

let currentEditedTail = null;
const editAircraftModal = document.getElementById('editAircraftModal');
const closeEditBtn = document.getElementById('closeEditBtn');
const editAircraftForm = document.getElementById('editAircraftForm');

aircraftGrid.addEventListener('click', (event) => {
    if (event.target.classList.contains('edit-button')) {
        const targetTail = event.target.id;
        const planeToEdit = fleet.find(p => p.tail === targetTail);

        if (planeToEdit) {
            currentEditingTail = targetTail;
            
            editAircraftForm.elements['edit-tail-input'].value = planeToEdit.tail;
            editAircraftForm.elements['edit-name-input'].value = planeToEdit.name;
            editAircraftForm.elements['edit-hour-input'].value = planeToEdit.hours;

            editAircraftModal.classList.add('active');
        }
    }
});

closeEditBtn.addEventListener('click', () => {
    editAircraftModal.classList.remove('active');
});

editAircraftForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const updatedTail = editAircraftForm.elements['edit-tail-input'].value.trim();
    const updatedName = editAircraftForm.elements['edit-name-input'].value.trim();
    const updatedHours = editAircraftForm.elements['edit-hour-input'].value.trim();

    if (!updatedTail && !updatedName && !updatedHours) {

        fleet = fleet.filter(plane => plane.tail !== currentEditingTail);
    } else {

        fleet = fleet.map(plane => {
            if (plane.tail === currentEditingTail) {
                return { ...plane, tail: updatedTail, name: updatedName };
            }
            return plane;
        });
    }

    localStorage.setItem('myFleet', JSON.stringify(fleet));
    renderFleet();
    
    editAircraftForm.reset();
    editAircraftModal.classList.remove('active');
});

const aircraftButton = document.getElementById('aircraftButton');
const checklistButton = document.getElementById('checklistButton');
const flightButton = document.getElementById('flightButton');

const aircraftDiv = document.getElementById('aircraftDiv');
const checklistDiv = document.getElementById('checklistDiv');
const flightDiv = document.getElementById('flightDiv');

aircraftButton.addEventListener('click', () => {
    aircraftButton.classList.add('active');
    checklistButton.classList.remove('active');
    flightButton.classList.remove('active');

    aircraftDiv.classList.add('active');
    checklistDiv.classList.remove('active');
    checklistDiv.classList.add('hidden');
    flightDiv.classList.remove('active');
    flightDiv.classList.add('hidden');

    aircraftDiv.classList.remove('hidden');
});

checklistButton.addEventListener('click', () => {
    aircraftButton.classList.remove('active');
    checklistButton.classList.add('active');
    flightButton.classList.remove('active');

    aircraftDiv.classList.remove('active');
    aircraftDiv.classList.add('hidden');
    checklistDiv.classList.add('active');
    flightDiv.classList.remove('active');
    flightDiv.classList.add('hidden');

    checklistDiv.classList.remove('hidden');
});


flightButton.addEventListener('click', () => {
    aircraftButton.classList.remove('active');
    checklistButton.classList.remove('active');
    flightButton.classList.add('active');

    aircraftDiv.classList.remove('active');
    aircraftDiv.classList.add('hidden');
    checklistDiv.classList.add('hidden');
    flightDiv.classList.add('active');

    flightDiv.classList.remove('hidden');
    renderFlights();
});


const addFlightButton = document.getElementById('addFlight');
const addFlightModal = document.getElementById('addFlightModal');
const closeFlightBtn = document.getElementById('closeFlightBtn');
const flightForm = document.getElementById('flightForm');

const flightGrid = document.getElementById('flightGrid');
let logbook = JSON.parse(localStorage.getItem('myLogbook')) || [];

function populateAircraftDropdown() {
    const selectDropdown = document.getElementById("planeDrop");
    if (!selectDropdown) return;
  
        selectDropdown.innerHTML = '<option value="">-- Select an Aircraft --</option>';
        fleet.forEach(plane => {
            const option = new Option(`${plane.tail} (${plane.name})`, plane.tail);
            selectDropdown.add(option);
        });
}

addFlightButton.addEventListener('click', () => {
    populateAircraftDropdown();
    addFlightModal.classList.add('active');
});

closeFlightBtn.addEventListener('click', () => {
    addFlightModal.classList.remove('active');
});

flightForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // 1. Gather all values from the form inputs
    const selectedTail = document.getElementById('planeDrop').value;
    const loggedHours = parseFloat(flightForm.elements['hour-input'].value);
    const dateInput = flightForm.elements['date-input'].value;
    const originInput = flightForm.elements['origin-input'].value.trim().toUpperCase();
    const destInput = flightForm.elements['dest-input'].value.trim().toUpperCase();
    const commandRole = document.getElementById('commandDrop').value;
    const timeInput = document.getElementById('timeDrop').value;

    // Validation checks
    if (!selectedTail) {
        alert("Please select an aircraft.");
        return;
    }
    if (isNaN(loggedHours) || loggedHours <= 0) {
        alert("Please enter a valid number of flight hours.");
        return;
    }

    // 2. Keep your existing logic: Update the aircraft's lifetime hours
    const planeToUpdate = fleet.find(plane => plane.tail === selectedTail);
    if (planeToUpdate) {
        const currentHours = parseFloat(planeToUpdate.hours) || 0;
        planeToUpdate.hours = currentHours + loggedHours;
        localStorage.setItem('myFleet', JSON.stringify(fleet));
        renderFleet();
    }

    // 3. New logic: Create the structured flight object
    const newFlight = {
        id: Date.now(),             // Unique identifier
        tail: selectedTail,         // Links flight back to the plane
        date: dateInput || new Date().toISOString().split('T')[0], // Fallback to today if blank
        origin: originInput || '---',
        dest: destInput || '---',
        hours: loggedHours,
        command: commandRole,
        time: timeInput,
    };

    // 4. Push to logbook array and save to its own LocalStorage key
    logbook.push(newFlight);
    localStorage.setItem('myLogbook', JSON.stringify(logbook));
    
    // 5. Update the UI grid
    renderFlights();

    // Reset and close UI modal
    flightForm.reset();
    addFlightModal.classList.remove('active');
});

populateAircraftDropdown();

function renderFlights() {
    flightGrid.innerHTML = ''; // Clear old cards

    logbook.forEach(flight => {
        const card = document.createElement('div');
        card.className = 'aircraft-card'; // Reuse your CSS styles
        
        card.innerHTML = `
            <div class="aircraft-info">
                <button id="${flight.id}" class="removeFlight">Remove Flight</button>
                <h3>${flight.origin} to ${flight.dest}</h3>
                <p>Date: ${flight.date} at ${flight.time}</p>
                <p>Tail: ${flight.tail}</p>
                <p>Hours: ${flight.hours}</p>
                <p>Position: ${flight.command}</p>
            </div>
        `;
        flightGrid.appendChild(card);
    });
}

// Listen to the entire grid container
flightGrid.addEventListener('click', (event) => {
    // Check if what the user clicked was actually a remove button
    if (event.target.classList.contains('removeFlight')) {
        
        // 1. Get the unique ID from the data attribute (convert string to number)
        const flightIdToRemove = Number(event.target.getAttribute('id'));
        
        // 2. Find the specific flight object BEFORE filtering it out of the array
        const flightToDelete = logbook.find(flight => flight.id === flightIdToRemove);
        
        if (flightToDelete) {
            // 3. Find the corresponding aircraft in your fleet array
            const planeToUpdate = fleet.find(plane => plane.tail === flightToDelete.tail);
            
            if (planeToUpdate) {
                // 4. Subtract the flight hours from the aircraft's current hours
                const currentHours = parseFloat(planeToUpdate.hours) || 0;
                const updatedHours = currentHours - parseFloat(flightToDelete.hours);
                
                // Prevent negative hours by defaulting to 0
                planeToUpdate.hours = updatedHours > 0 ? updatedHours : 0;
                
                // 5. Save the updated fleet to LocalStorage and redraw the aircraft panel
                localStorage.setItem('myFleet', JSON.stringify(fleet));
                renderFleet();
            }
        }

        // 6. Filter out the flight with that specific ID from the logbook
        logbook = logbook.filter(flight => flight.id !== flightIdToRemove);
        
        // 7. Save the updated logbook array back to LocalStorage
        localStorage.setItem('myLogbook', JSON.stringify(logbook));
        
        // 8. Refresh the UI cards instantly
        renderFlights();
    }
});