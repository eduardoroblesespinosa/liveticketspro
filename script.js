import { concerts } from 'app/eventsData';
import { renderEventCards } from 'app/ui/events';
import { initializeModal } from 'app/ui/modal';
import { initializeConfirmation } from 'app/ui/confirmation';
import { initializeContactForm } from 'app/ui/contact';

document.addEventListener('DOMContentLoaded', () => {
    // Render initial event cards
    const eventsContainer = document.getElementById('events-container');
    renderEventCards(concerts, eventsContainer);

    // Initialize all interactive components
    initializeModal(concerts);
    initializeConfirmation();
    initializeContactForm();

    // Main event listener for buying tickets
    eventsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.buy-tickets-btn');
        if (btn) {
            const eventIndex = btn.dataset.eventIndex;
            // The `show.bs.modal` event is now handled inside initializeModal
            // We just need to trigger it. A custom event could work better but this is simpler.
            const ticketModalEl = document.getElementById('ticket-modal');
            ticketModalEl.setAttribute('data-event-index', eventIndex);
        }
    });
});