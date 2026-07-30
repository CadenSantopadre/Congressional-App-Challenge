const aircraftGrid = document.getElementById('aircraftGrid');
const openAddBtn = document.getElementById('openAdd');

let fleet = JSON.parse(localStorage.getItem('myFleet')) || [];

renderFleet();


function addAircraft(tailNumber, modelType, imageUrl) {
    const newPlane = {
        id: Date.now(),
        tail: tailNumber,
        model: modelType,
        img: imageUrl || 'https://placeholder.com'
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
                <p>${plane.model}</p>
            </div>
        `;

        aircraftGrid.appendChild(card);
    });
}


openAddBtn.addEventListener('click', () => {
    const tail = prompt("Enter Tail Number (e.g., P1903):");
    const model = prompt("Enter Aircraft Type (e.g., C172):");
    
    if (tail && model) {
        addAircraft(tail, model);
    }
});

const aircraftModal = document.getElementById('aircraftModal');
const closeBtn = document.getElementById('closeBtn');

openAddBtn.addEventListener('click', () => {
    aircraftModal.classList.add('active');
});

closeBtn.addEventListener('click', () => {
    aircraftModal.classList.remove('active');
});

const aircraftForm = document.getElementById('aircraftForm');

aircraftForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const tailInput = aircraftForm.elements['tail-input'].value;
    const nameInput = aircraftForm.elements['name-input'].value;

    addAircraft(tailInput, nameInput);

    aircraftForm.reset();
    aircraftModal.classList.remove('active');
});

