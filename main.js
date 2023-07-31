const getFormData = () => {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const service = document.getElementById('service').value;
    return { name, phone, date, time, service };
};

const saveReservation = () => {
    const reservationData = getFormData();
    const reservations = getReservations();

    const isDuplicateReservation = reservations.some((reservation) => {
        return reservation.date === reservationData.date && reservation.time === reservationData.time;
    });

    if (isDuplicateReservation) {
        displayStatusMessage('Ya existe una reserva para esa fecha y hora.', 'error');
    } else {
        reservations.push(reservationData);
        localStorage.setItem('reservations', JSON.stringify(reservations));
        displayStatusMessage('Reserva realizada exitosamente', 'success');
        displayReservations();
    }
};

const getReservations = () => {
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    return reservations;
};

const displayReservations = () => {
    const reservations = getReservations();
    const reservationsList = document.getElementById('reservations');
    reservationsList.innerHTML = '';

    if (reservations.length === 0) {
        reservationsList.innerHTML = '<li>No se han realizado reservas.</li>';
    } else {
        reservations.forEach((reservation, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>Nombre: ${reservation.name}</span>
                <span>Fecha: ${reservation.date}</span>
                <button onclick="cancelReservation(${index})" ${reservation.canceled ? 'disabled' : ''}>${reservation.canceled ? 'Cancelado' : 'Cancelar'}</button>
            `;
            if (reservation.canceled) {
                listItem.classList.add('canceled');
            }
            reservationsList.appendChild(listItem);
        });
    }
};

const cancelReservation = (index) => {
    const reservations = getReservations();
    reservations.splice(index, 1);
    localStorage.setItem('reservations', JSON.stringify(reservations));
    displayReservations();
};

const displayStatusMessage = (message, type) => {
    const statusMessageDiv = document.getElementById('statusMessage');
    statusMessageDiv.innerText = message;
    statusMessageDiv.style.color = type === 'success' ? 'green' : 'red';
};

document.getElementById('reservationForm').addEventListener('submit', (event) => {
    event.preventDefault();
    saveReservation();
});

displayReservations();
