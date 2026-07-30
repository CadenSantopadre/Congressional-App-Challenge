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

aircraftButton.addEventListener('click', () => {
    aircraftButton.classList.add('active');
    checklistButton.classList.remove('active');
    flightButton.classList.remove('active');
});

checklistButton.addEventListener('click', () => {
    aircraftButton.classList.remove('active');
    checklistButton.classList.add('active');
    flightButton.classList.remove('active');
});


flightButton.addEventListener('click', () => {
    aircraftButton.classList.remove('active');
    checklistButton.classList.remove('active');
    flightButton.classList.add('active');
});