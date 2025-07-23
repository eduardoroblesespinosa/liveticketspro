export function renderEventCards(concerts, container) {
    container.innerHTML = '';
    concerts.forEach((event, index) => {
        const eventCol = document.createElement('div');
        eventCol.className = 'col-lg-12';

        eventCol.innerHTML = `
            <div class="card event-card-ticket flex-md-row">
                <div class="event-main col-md-8" style="background-image: url('${event.image}');">
                    <div class="card-body d-flex flex-column justify-content-center">
                        <h3 class="event-artist">${event.artist}</h3>
                        <p class="tour-name">Gira 2026</p>
                        <div class="event-meta">
                            <p class="event-date"><span>Fecha:</span> ${event.date}</p>
                            <p class="event-time"><span>Hora:</span> ${event.time}</p>
                            <p class="event-venue"><span>Lugar:</span> ${event.venue}</p>
                        </div>
                    </div>
                </div>
                <div class="event-stub col-md-4">
                    <div class="stub-logo">
                        <img src="logo.png" alt="Live! Logo">
                    </div>
                    <button class="btn btn-primary buy-tickets-btn" data-bs-toggle="modal" data-bs-target="#ticket-modal" data-event-index="${index}">Comprar Boletos</button>
                    <div class="stub-barcode"></div>
                </div>
            </div>
        `;
        container.appendChild(eventCol);
    });
}

