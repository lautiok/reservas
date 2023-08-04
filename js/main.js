const populateServicesSelect = () => {
    const selectElement = document.getElementById('service');
    services.forEach((service) => {
        const optionElement = document.createElement('option');
        optionElement.value = service.value;
        optionElement.textContent = service.name;
        selectElement.appendChild(optionElement);
    });
};

populateServicesSelect();

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
        Swal.fire({
            title: 'Ya existe una reserva para esa fecha y hora',
            icon: 'error',
            confirmButtonColor: '#ff8f9a'
        });
    } else {
        reservations.push(reservationData);
        localStorage.setItem('reservations', JSON.stringify(reservations));
        Swal.fire({
            title: 'Reserva realizada exitosamente',
            icon: 'success',
            confirmButtonColor: '#ff7987'
        });
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
                <button class="button" onclick="cancelReservation(${index})" ${reservation.canceled ? 'disabled' : ''}>${reservation.canceled ? 'Cancelado' : 'Cancelar'}</button>
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
    const reservationToCancel = reservations[index];

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
        title: '¿Desea eliminar su reserva?',
        text: `Usted va a cancelar su reserva para el dia: ${reservationToCancel.date}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Cancelar reserva!',
        cancelButtonText: 'volver',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            reservations.splice(index, 1);
            localStorage.setItem('reservations', JSON.stringify(reservations));
            displayReservations();

            swalWithBootstrapButtons.fire(
                'Reserva cancelada!',
                'Usted a eliminado su reserva',
                'success',
            );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire(
                'Cancelado',
                'Usted a cancelado su cancelación  :)',
                'error'
            );
        }
    });
};

const displayStatusMessage = (message, type) => {
    const statusMessageDiv = document.getElementById('statusMessage');
    statusMessageDiv.innerText = message;
    statusMessageDiv.style.color = type === 'success' ? 'green' : 'red';
};

document.getElementById('reservationForm').addEventListener('submit', (event) => {
    event.preventDefault();
    saveReservation();
    event.target.reset();
});

displayReservations();