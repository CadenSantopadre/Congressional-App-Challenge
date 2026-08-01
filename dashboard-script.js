const aircraftGrid = document.getElementById('aircraftGrid');
const openAddBtn = document.getElementById('openAdd');

let fleet = JSON.parse(localStorage.getItem('myFleet')) || []; //Get the fleet from localstorage, otherwise it's empty

fleet = fleet.map(plane => ({
    ...plane, //Copy from plane(in const newPlane)
    //But let hours, currentTach, currentHobbs be something else
    currentTach: parseFloat(plane.currentTach) || 0,
    currentHobbs: parseFloat(plane.currentHobbs) || 0,
}));

if (JSON.stringify(fleet) !== localStorage.getItem('myFleet')) {
    localStorage.setItem('myFleet', JSON.stringify(fleet));
}

renderFleet(); //Run the function to get the fleet on screen


function addAircraft(tailNumber, nameType, tachCreation, hobbsCreation) {
    const parsedTach = parseFloat(tachCreation);
    const parsedHobbs = parseFloat(hobbsCreation);

    const newPlane = {
        id: Date.now(),
        tail: tailNumber.trim(),
        name: nameType.trim(),
        //Hobbs and Tach are weird, so we have to give a fallback
        currentTach: isNaN(parsedTach) ? 0 : parsedTach,
        currentHobbs: isNaN(parsedHobbs) ? 0 : parsedHobbs,
    };

    fleet.push(newPlane);
    localStorage.setItem('myFleet', JSON.stringify(fleet)); //Set it as a json so we can understand it
    renderFleet(); //Then render again since it was updated
    populateAircraftDropdown(); //Then update the dropdown for add flight
    ensureMandatoryMaintenance();
    renderMaintenance();
}


function renderFleet() {
    aircraftGrid.innerHTML = ''; //Set the html as nothing for right now

    if (fleet.length === 0) {//Then if there's nothing, say no aircraft added yet
        aircraftGrid.innerHTML = '<p class="empty-state">No aircraft added yet.</p>';
        return;
    }


    fleet.forEach(plane => { //For each plane we'll add a div class='aircraft-card' with innerHTML below
        const card = document.createElement('div');
        card.className = 'aircraft-card';

        const flightHours = parseFloat(plane.hours) || 0;
        const tachHours = parseFloat(plane.currentTach) || 0;
        const hobbsHours = parseFloat(plane.currentHobbs) || 0;

        card.innerHTML = `
            <svg width="50" height="50" viewBox="0 0 24 24" style="background-color: #e2f4ff; border-radius: 8px;">
            <!--Airplane Icon from google-->
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1-1-1s-1 .17-1 1V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5L21 16z" fill="#0277bd" />
        </svg>
            <div class="aircraft-info">
                <h3>${plane.tail}</h3>
                <p>${plane.name}</p>
                <p>Tach: ${tachHours.toFixed(1)}</p> <!--To fixed one means we go to one decimal point--!>
                <p>Hobbs: ${hobbsHours.toFixed(1)}</p>
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
}); //When modal is active, then it pops up, else it's hidden

closeBtn.addEventListener('click', () => {
    addAircraftModal.classList.remove('active');
});

const aircraftForm = document.getElementById('aircraftForm');

aircraftForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const tailInput = aircraftForm.elements['tail-input'].value;
    const nameInput = aircraftForm.elements['name-input'].value;
    const tachCreation = aircraftForm.elements['tach-input'].value;
    const hobbsCreation = aircraftForm.elements['hobbs-input'].value; //Used to be hourInput

    addAircraft(tailInput, nameInput, tachCreation, hobbsCreation);

    aircraftForm.reset();
    addAircraftModal.classList.remove('active');
});

const editAircraftModal = document.getElementById('editAircraftModal');
const closeEditBtn = document.getElementById('closeEditBtn');
const editAircraftForm = document.getElementById('editAircraftForm');

aircraftGrid.addEventListener('click', (event) => { //If there's a click on aircraft grid then...
    if (event.target.classList.contains('edit-button')) { //Check if it's the edit button
        const targetTail = event.target.id; //The tail will be the ID of the edit button
        const planeToEdit = fleet.find(p => p.tail === targetTail); //Then we look for the matching plane

        if (planeToEdit) { //If there's an editable plane, then...
            currentEditingTail = targetTail;//Set currentTail = targetTail
            
            editAircraftForm.elements['edit-tail-input'].value = planeToEdit.tail;
            editAircraftForm.elements['edit-name-input'].value = planeToEdit.name;
            editAircraftForm.elements['edit-hour-input'].value = planeToEdit.hours;

            editAircraftModal.classList.add('active'); //Then let us see it
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

    if (!updatedTail && !updatedName && !updatedHours) {//If everyhting is blank...

        fleet = fleet.filter(plane => plane.tail !== currentEditingTail);//Delete it
    } else {
        fleet = fleet.map(plane => {
            if (plane.tail === currentEditingTail) {
                return { ...plane, tail: updatedTail, name: updatedName, hours: updatedHours}; //Otherwise copy everything with updated stuff
            }
            return plane;
        });
    }

    localStorage.setItem('myFleet', JSON.stringify(fleet));
    renderFleet(); //REnder the fleet again
    renderMaintenance();
    
    editAircraftForm.reset();
    editAircraftModal.classList.remove('active');
});

const aircraftButton = document.getElementById('aircraftButton');
const checklistButton = document.getElementById('checklistButton');
const flightButton = document.getElementById('flightButton');
const maintenanceButton = document.getElementById('maintenanceButton');

const aircraftDiv = document.getElementById('aircraftDiv');
const checklistDiv = document.getElementById('checklistDiv');
const flightDiv = document.getElementById('flightDiv');
const maintenanceDiv = document.getElementById('maintenanceDiv');

aircraftButton.addEventListener('click', () => { 
    // When switching tabs on sidebar, change the div form hidden to not-hidden 
    aircraftButton.classList.add('active'); 
    checklistButton.classList.remove('active'); 
    flightButton.classList.remove('active'); 
    maintenanceButton.classList.remove('active'); 

    aircraftDiv.classList.add('active'); 
    aircraftDiv.classList.remove('hidden'); 
    checklistDiv.classList.remove('active'); 
    checklistDiv.classList.add('hidden'); 
    flightDiv.classList.remove('active'); 
    flightDiv.classList.add('hidden'); 
    maintenanceDiv.classList.remove('active');
    maintenanceDiv.classList.add('hidden');
}); 

checklistButton.addEventListener('click', () => { 
    aircraftButton.classList.remove('active'); 
    checklistButton.classList.add('active'); 
    flightButton.classList.remove('active'); 
    maintenanceButton.classList.remove('active'); 

    aircraftDiv.classList.remove('active'); 
    aircraftDiv.classList.add('hidden'); 
    checklistDiv.classList.add('active'); 
    checklistDiv.classList.remove('hidden');
    flightDiv.classList.remove('active'); 
    flightDiv.classList.add('hidden'); 
    maintenanceDiv.classList.remove('active');
    maintenanceDiv.classList.add('hidden');

    renderChecklists(); 
}); 

flightButton.addEventListener('click', () => { 
    aircraftButton.classList.remove('active'); 
    checklistButton.classList.remove('active'); 
    flightButton.classList.add('active'); 
    maintenanceButton.classList.remove('active'); 

    aircraftDiv.classList.remove('active'); 
    aircraftDiv.classList.add('hidden'); 
    checklistDiv.classList.remove('active');
    checklistDiv.classList.add('hidden'); 
    flightDiv.classList.add('active'); 
    flightDiv.classList.remove('hidden'); 
    maintenanceDiv.classList.remove('active');
    maintenanceDiv.classList.add('hidden');

    renderFlights(); 
}); 

maintenanceButton.addEventListener('click', () => { 
    aircraftButton.classList.remove('active'); 
    checklistButton.classList.remove('active'); 
    flightButton.classList.remove('active'); 
    maintenanceButton.classList.add('active'); 

    aircraftDiv.classList.remove('active'); 
    aircraftDiv.classList.add('hidden'); 
    checklistDiv.classList.remove('active'); 
    checklistDiv.classList.add('hidden'); 
    flightDiv.classList.remove('active'); 
    flightDiv.classList.add('hidden'); 
    maintenanceDiv.classList.add('active');
    maintenanceDiv.classList.remove('hidden');

    ensureMandatoryMaintenance();
    renderMaintenance();
});



const addFlightButton = document.getElementById('addFlight');
const addFlightModal = document.getElementById('addFlightModal');
const closeFlightBtn = document.getElementById('closeFlightBtn');
const flightForm = document.getElementById('flightForm');

const flightGrid = document.getElementById('flightGrid');
let logbook = JSON.parse(localStorage.getItem('myLogbook')) || []; //Logbook is a seperate data structure, just for flights

function populateAircraftDropdown() {
    const selectDropdown = document.getElementById("planeDrop");
    selectDropdown.innerHTML = '';
    if (!selectDropdown) return;
        fleet.forEach(plane => {
            const option = new Option(`${plane.tail} (${plane.name})`, plane.tail); //Shows up as "tail (name)" with value=tail
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

    const selectedTail = document.getElementById('planeDrop').value;
    const dateInput = flightForm.elements['date-input'].value;
    const originInput = flightForm.elements['origin-input'].value.trim().toUpperCase();
    const destInput = flightForm.elements['dest-input'].value.trim().toUpperCase();
    const commandRole = document.getElementById('commandDrop').value;
    const timeInput = document.getElementById('timeDrop').value;

    const tachStart = parseFloat(flightForm.elements['tach-start'].value);
    const tachEnd = parseFloat(flightForm.elements['tach-end'].value);
    const hobbsStart = parseFloat(flightForm.elements['hobbs-start'].value);
    const hobbsEnd = parseFloat(flightForm.elements['hobbs-end'].value);

    let loggedHours = NaN;
    if (!isNaN(tachStart) && !isNaN(tachEnd)) {
        loggedHours = tachEnd - tachStart;
    } else if (!isNaN(hobbsStart) && !isNaN(hobbsEnd)) {
        loggedHours = hobbsEnd - hobbsStart;
    }

    if (isNaN(loggedHours) || loggedHours <= 0) {
        alert("Please enter valid Hobbs and Tach start/end times.");
        return;
    }

    const planeToUpdate = fleet.find(plane => plane.tail === selectedTail);
    let previousTach = 0;
    let previousHobbs = 0;

    if (planeToUpdate) {
        previousTach = parseFloat(planeToUpdate.currentTach) || 0;
        previousHobbs = parseFloat(planeToUpdate.currentHobbs) || 0;

        const currentHours = parseFloat(planeToUpdate.hours) || 0;
        planeToUpdate.hours = currentHours + loggedHours;

        if (!isNaN(tachEnd)) {
            planeToUpdate.currentTach = tachEnd;
        }

        if (!isNaN(hobbsEnd)) {
            planeToUpdate.currentHobbs = hobbsEnd;
        }

        localStorage.setItem('myFleet', JSON.stringify(fleet));
        renderFleet();
    }

    const newFlight = {
        id: Date.now(),
        tail: selectedTail,
        date: dateInput || new Date().toISOString().split('T')[0],
        origin: originInput || '---',
        dest: destInput || '---',
        hours: loggedHours,
        tachStart: !isNaN(tachStart) ? tachStart : null,
        tachEnd: !isNaN(tachEnd) ? tachEnd : null,
        hobbsStart: !isNaN(hobbsStart) ? hobbsStart : null,
        hobbsEnd: !isNaN(hobbsEnd) ? hobbsEnd : null,
        previousTach: previousTach,
        previousHobbs: previousHobbs,
        command: commandRole,
        time: timeInput,
    };

    logbook.push(newFlight);
    localStorage.setItem('myLogbook', JSON.stringify(logbook));

    renderFlights();
    flightForm.reset();
    addFlightModal.classList.remove('active');
});

populateAircraftDropdown();

function renderFlights() {
    flightGrid.innerHTML = ''; //Clear old cards

    logbook.forEach(flight => {
        const card = document.createElement('div');
        card.className = 'aircraft-card'; //Reuse CSS styles since I don't feel like making a new one
        
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

//Same deal as before
flightGrid.addEventListener('click', (event) => {
    if (event.target.classList.contains('removeFlight')) {
        
        const flightIdToRemove = Number(event.target.getAttribute('id'));
        const flightToDelete = logbook.find(flight => flight.id === flightIdToRemove);
        
        if (flightToDelete) {
            const planeToUpdate = fleet.find(plane => plane.tail === flightToDelete.tail);
            
            if (planeToUpdate) {
                const currentHours = parseFloat(planeToUpdate.hours) || 0;
                const hoursToSubtract = parseFloat(flightToDelete.hours) || 0;
                planeToUpdate.hours = Math.max(0, currentHours - hoursToSubtract);

                const laterFlights = logbook.filter(flight => flight.tail === flightToDelete.tail && flight.id > flightToDelete.id);
                const isMostRecentFlight = laterFlights.length === 0;

                if (isMostRecentFlight) {
                    const restoredTach = parseFloat(flightToDelete.previousTach) ?? 0;
                    const restoredHobbs = parseFloat(flightToDelete.previousHobbs) ?? 0;
                    planeToUpdate.currentTach = restoredTach;
                    planeToUpdate.currentHobbs = restoredHobbs;
                }
    
                localStorage.setItem('myFleet', JSON.stringify(fleet));
                renderFleet();
            }
        }
        logbook = logbook.filter(flight => flight.id !== flightIdToRemove);
        localStorage.setItem('myLogbook', JSON.stringify(logbook));    
        renderFlights();
    }
});

const checklistGrid = document.getElementById('checklistGrid');

function renderChecklists() {
    let CFR6157a = 0;
    let CFR6157aString = "";

    logbook.forEach(flight => {
        if(flight.time === "DAY" && Math.abs((new Date(flight.date) - Date.now()) / 86400000) < 90) {
            CFR6157a++;
        }
    });

    logbook.forEach(flight => {
        if(flight.time === "NIGHT-full" && Math.abs((new Date(flight.date) - Date.now()) / 86400000) < 90) {
            CFR6157a++;
        }
    });

    logbook.forEach(flight => {
        if(flight.time === "NIGHT-touch" && Math.abs((new Date(flight.date) - Date.now()) / 86400000) < 90) {
            CFR6157a++;
        }
    });

    checklistGrid.innerHTML = '';
    
    const card1 = document.createElement('div');
    card1.className = 'aircraft-card'; 
    
    if(CFR6157a > 3){
        CFR6157aString = '<p><strong style="color: green;">Cleared per CFR §61.57(a)</strong></p>'
    } else {
        CFR6157aString = '<p><strong style="color: red;">Not Cleared per CFR §61.57(a)</strong></p>'
    }

    card1.innerHTML = `
        <div class="aircraft-info">
            <label for="DayCurrency">Day Passenger Currency:</label>
            <progress id="DayCurrency" max='3' value='${CFR6157a}'></progress>
            <p>${CFR6157a} / 3 flights</p>
            ${CFR6157aString}
        </div>
    `;

    checklistGrid.appendChild(card1);

    let CFR6157b = 0;
    let CFR6157bString = "";

    const card2 = document.createElement('div');
    card2.className = 'aircraft-card';

    logbook.forEach(flight => {
        if(flight.time === "NIGHT-full" && Math.abs((new Date(flight.date) - Date.now()) / 86400000) < 90) {
            CFR6157b++;
        }
    });

    if(CFR6157b > 3){
        CFR6157bString = '<p><strong style="color: green;">Cleared per CFR §61.57(b)</strong></p>'
    } else {
        CFR6157bString = '<p><strong style="color: red;">Not Cleared per CFR §61.57(b)</strong></p>'
    }

    card2.innerHTML = `
        <div class="aircraft-info">
            <label for="NightCurrency">Night Passenger Currency:</label>
            <progress id="NightCurrency" max='3' value='${CFR6157b}'></progress>
            <p>${CFR6157b} / 3 flights</p>
            ${CFR6157bString}
        </div>
    `;
    checklistGrid.appendChild(card2);



    let CFR6157c1 = 0;
    let CFR6157cString = "";

    const card3 = document.createElement('div');
    card3.className = 'aircraft-card';

    if(CFR6157c1 > 3){
        CFR6157cString = '<p><strong style="color: green;">Cleared per CFR §61.57(c)</strong></p>'
    } else {
        CFR6157cString = '<p><strong style="color: red;">Not Cleared per CFR §61.57(c)</strong></p>'
    }

    card3.innerHTML = `
        <div class="aircraft-info">
            <label for="InstrumentApproaches">Flight Readiness:</label>
            <progress id="InstrumentApproaches" max='6' value='${CFR6157c1}'></progress>
            <p>${CFR6157c1} / 3 flights</p>
            ${CFR6157cString}
        </div>
    `;
    checklistGrid.appendChild(card3);
}

const commandDrop = document.getElementById('commandDrop');
const ifrDetails = document.querySelector('.ifr-details');

commandDrop.addEventListener('change', (e) => {
  if (e.target.value === 'Dual') {
    ifrDetails.open = true; 
  }
});

let maintenance = JSON.parse(localStorage.getItem('myMaintenance')) || [];

if (!Array.isArray(maintenance)) {
    maintenance = [];//If no array for maintenance, let it be blank
}

maintenance = maintenance.filter(Boolean).map(item => {//Filter through items
    //Check if it uses hours or days
    const intervalType = item.intervalType === 'hours' ? 'hours' : 'calendar';
    const fallbackDate = new Date().toISOString().split('T')[0]; //Fallback is a /date
    const normalizedDate = item.lastDoneDate && String(item.lastDoneDate).trim()
        ? String(item.lastDoneDate).trim()
        : fallbackDate; //Otherwise we want 2027-08-01 for example

    return {
        ...item,
        tail: item.tail || '',
        type: item.type || 'Custom',
        description: item.description || '',
        intervalType,
        intervalValue: parseFloat(item.intervalValue) || 0,
        hourSource: item.hourSource || 'flightHours',
        lastDoneHours: intervalType === 'hours' ? (parseFloat(item.lastDoneHours) || 0) : null,
        lastDoneDate: normalizedDate,
        isMandatory: Boolean(item.isMandatory),
    };
});

localStorage.setItem('myMaintenance', JSON.stringify(maintenance));

const maintenanceModal = document.getElementById('addMaintenanceModal');

const maintenanceAddButton = document.getElementById('addMaintBtn');
maintenanceAddButton.addEventListener('click', () => {
    maintenanceModal.classList.add('active');
});

const maintenanceCloseButton = document.getElementById('closeMaintBtn');
maintenanceCloseButton.addEventListener('click', () => {
    maintenanceModal.classList.remove('active');
});

function prefillStartTimes() {
    const selectedTail = document.getElementById('planeDrop').value;
    const selectedPlane = fleet.find(plane => plane.tail === selectedTail);

    if (selectedPlane) {
        flightForm.elements['tach-start'].value = selectedPlane.currentTach ?? '';
        flightForm.elements['hobbs-start'].value = selectedPlane.currentHobbs ?? '';
    }
}

addFlightButton.addEventListener('click', () => {
    populateAircraftDropdown();
    prefillStartTimes(); //Prefill after dropdown is populated so there's a selected plane
    addFlightModal.classList.add('active');
});

document.getElementById('planeDrop').addEventListener('change', prefillStartTimes);

const maintenanceGrid = document.getElementById('maintenanceGrid');

function renderMaintenance() { //To render maintenance, we...
    maintenanceGrid.innerHTML = '';//Clear the html first

    if (maintenance.length === 0) { //We have legally required ones so this should never happen
        maintenanceGrid.innerHTML = '<p class="empty-state">No maintenance items tracked yet.</p>';
        return;
    }


    maintenance.forEach(item => {
        const plane = fleet.find(p => p.tail === item.tail);
        if (!plane) return; //This negates the deleted plane still showing cards issue
        const card = document.createElement('div');
        card.className = 'aircraft-card';

        let usedValue, maxValue, remainingText, statusString; //Let these be editable

        //Trying to debug
        maintenance.forEach(item => {
            try {
                const plane = fleet.find(p => p.tail === item.tail);
                if (!plane) return;
                // ... rest of existing code ...
            } catch (err) {
                console.error('Failed to render maintenance item:', item, err);
            }
        });

        if(item.intervalType === 'hours') {//When asking for hours
            const currentValue = item.hourSource === 'tach'//currentVal is the truth value of source=tach
                ? (parseFloat(plane?.currentTach) || 0)//If yes, then give currentTach
                : (parseFloat(plane?.hours) || 0);//If no, then give hours

            maxValue = item.intervalValue;
            usedValue = currentValue % maxValue; //Do modulo for the inspections

            const remaining = maxValue - usedValue;

            remainingText = `${remaining.toFixed(1)} hrs remaining (${item.hourSource === 'tach' ? 'tach' : 'flight hrs'})`;


            if (remaining <= 0) {
                statusString = '<p><strong style="color: red;">OVERDUE</strong></p>';
            } else if (remaining <= 10) {
                statusString = '<p><strong style="color: orange;">Due Soon</strong></p>';
            } else {
                statusString = '<p><strong style="color: green;">OK</strong></p>';
            }
        }   else { //calendar-based
            const parsedDate = new Date(item.lastDoneDate);
            const safeDate = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
            const dueDate = new Date(safeDate);

            dueDate.setMonth(dueDate.getMonth() + (parseFloat(item.intervalValue) || 0));

            const daysTotal = (parseFloat(item.intervalValue) || 0) * 30; //rough month-to-day conversion for the bar
            const daysSince = Math.max(0, Math.floor((Date.now() - safeDate) / 86400000));
            const daysRemaining = Math.floor((dueDate - Date.now()) / 86400000);

            usedValue = daysSince;
            maxValue = daysTotal;
            remainingText = `Due ${dueDate.toISOString().split('T')[0]} (${daysRemaining} days)`;

            if (daysRemaining <= 0) {
                statusString = '<p><strong style="color: red;">OVERDUE</strong></p>';
            } else if (daysRemaining <= 30) {
                statusString = '<p><strong style="color: orange;">Due Soon</strong></p>';
            } else {
                statusString = '<p><strong style="color: green;">OK</strong></p>';
            }
        }

        const removeButtonHtml = item.isMandatory
            ? ''
            : `<button class="remove-maint" id="${item.description}">Remove</button>`;

        const badgeHtml = item.isMandatory
            ? '<span style="font-size:0.75em; color:#888;">REQUIRED</span>'
            : '<span style="font-size:0.75em; color:#888;">CUSTOM</span>';

        card.innerHTML = `
            <div class="aircraft-info">
                <h3>${item.type} - ${item.tail} ${badgeHtml}</h3>
                <p>${item.description}</p>
                <progress max='${maxValue}' value='${Math.min(usedValue, maxValue)}'></progress>
                <p>${remainingText}</p>
                ${statusString}
                <button class="edit-maint" id="${item.description}">Edit</button>
                ${removeButtonHtml}
            </div>
        `;
        maintenanceGrid.appendChild(card);
    });
}

maintenanceGrid.addEventListener('click', (event) => {
  if (event.target.classList.contains('remove-maint')) {
    const descriptionToRemove = event.target.id;
    
    // Find the closest aircraft card element to extract the text/tail context
    const cardElement = event.target.closest('.aircraft-card');
    // Find the matching plane in the array where the item description matches
    const targetItem = maintenance.find(item => item.description === descriptionToRemove);
    
    if (targetItem) {
      // Filter out using BOTH description and tail to protect other planes
      maintenance = maintenance.filter(item => !(item.description === descriptionToRemove && item.tail === targetItem.tail));
      localStorage.setItem('myMaintenance', JSON.stringify(maintenance));
      renderMaintenance();
    }
  }
});


const MANDATORY_ITEMS = [
    { type: '100hr', description: '100 Hour Inspection', intervalType: 'hours', intervalValue: 100, hourSource: 'tach'},
    { type: 'Annual', description: 'Annual Inspection', intervalType: 'calendar', intervalValue: 12 },
    { type: 'Transponder', description: 'Transponder/Pitot-Static Check (91.411/91.413)', intervalType: 'calendar', intervalValue: 24 },
    { type: 'ELT Battery', description: 'ELT Battery/Inspection', intervalType: 'calendar', intervalValue: 12 },
];

function ensureMandatoryMaintenance() { //This makes sure our required logs are in
    fleet.forEach(plane => {
        MANDATORY_ITEMS.forEach(template => {
            const exists = maintenance.some(item => item.tail === plane.tail && item.type === template.type);
            
            if (!exists) {
                maintenance.push({
                    id: Date.now() + Math.floor(Math.random() * 1000), 
                    tail: plane.tail, 
                    type: template.type, 
                    description: template.description, 
                    intervalType: template.intervalType, 
                    intervalValue: template.intervalValue, 
                    lastDoneHours: template.intervalType === 'hours' ? 0 : null, 
                    lastDoneDate: template.intervalType === 'calendar' ? new Date().toISOString().split('T')[0] : null, 
                    isMandatory: true 
                });
            }
        });
    });
    localStorage.setItem('myMaintenance', JSON.stringify(maintenance));
}


function populateMaintPlaneDropdown() {
    const dropdown = document.getElementById('maintPlaneDrop');
    if (!dropdown) return;
    dropdown.innerHTML = '';
    fleet.forEach(plane => {
        dropdown.add(new Option(`${plane.tail} (${plane.name})`, plane.tail));
    });
}

maintenanceAddButton.addEventListener('click', () => {
    populateMaintPlaneDropdown();
    maintenanceModal.classList.add('active');
});

const maintenanceForm = document.getElementById('maintenanceForm');

maintenanceForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const selectedTail = document.getElementById('maintPlaneDrop').value;
    const description = maintenanceForm.elements['maint-description'].value.trim();
    const intervalType = document.getElementById('intervalTypeDrop').value; // 'hours' or 'calendar'
    const intervalValue = parseFloat(maintenanceForm.elements['interval-value'].value);
    const lastDoneHours = maintenanceForm.elements['last-done-hours'].value;
    const lastDoneDate = maintenanceForm.elements['last-done-date'].value;
    const hourSource = document.getElementById('hourSourceDrop')?.value || 'flightHours';

    if (!selectedTail || !description || isNaN(intervalValue)) {
        alert("Please fill out all required fields.");
        return;
    }

    maintenance.push({
        id: Date.now(),
        tail: selectedTail,
        type: 'Custom',
        description: description,
        intervalType: intervalType,
        intervalValue: intervalValue,
        hourSource: hourSource,
        lastDoneHours: intervalType === 'hours' ? parseFloat(lastDoneHours) || 0 : null,
        lastDoneDate: intervalType === 'calendar' ? (lastDoneDate || new Date().toISOString().split('T')[0]) : null,
        isMandatory: false
    });

    localStorage.setItem('myMaintenance', JSON.stringify(maintenance));
    renderMaintenance();

    maintenanceForm.reset();
    maintenanceModal.classList.remove('active');
});


document.getElementById('intervalTypeDrop').addEventListener('change', (e) => {
    const hoursContainer = editMaintenanceForm.querySelector('.hours-done');
    const calendarContainer = editMaintenanceForm.querySelector('.date-done');

    if (e.target.value === 'hours') {
        hoursContainer.style.display = '';       // Show hours block
        calendarContainer.style.display = 'none'; // Hide calendar block
    } else {
        hoursContainer.style.display = 'none';    // Hide hours block
        calendarContainer.style.display = '';    // Show calendar block
    }
});


ensureMandatoryMaintenance();
renderMaintenance();