import { config } from 'app/config';

let currentEvent = null;
let ticketModal, ticketModalEl;

function updateTotalPrice() {
    if (!currentEvent) return;
    
    let total = 0;
    const quantityInputs = ticketModalEl.querySelectorAll('.quantity-input');
    
    quantityInputs.forEach(input => {
        const ticketType = input.dataset.ticketType;
        const price = currentEvent.prices[ticketType];
        const quantity = parseInt(input.value) || 0;
        total += price * quantity;
    });
    
    ticketModalEl.querySelector('#total-price-modal').textContent = total.toFixed(2);
    renderPayPalButton(total);
}

function renderPayPalButton(total) {
    const paypalButtonContainer = document.getElementById('paypal-button-container');
    paypalButtonContainer.innerHTML = '';
    if (total > 0 && typeof paypal !== 'undefined') {
         const paypalButtons = paypal.Buttons({
            createOrder: function(data, actions) {
                const quantityInputs = ticketModalEl.querySelectorAll('.quantity-input');
                const generalQty = parseInt(quantityInputs[0].value) || 0;
                const vipQty = parseInt(quantityInputs[1].value) || 0;

                const items = [];
                if (generalQty > 0) {
                    items.push({
                        name: `Boleto General - ${currentEvent.artist}`,
                        unit_amount: { value: currentEvent.prices.general.toFixed(2), currency_code: config.currency },
                        quantity: generalQty.toString()
                    });
                }
                if (vipQty > 0) {
                     items.push({
                        name: `Boleto VIP - ${currentEvent.artist}`,
                        unit_amount: { value: currentEvent.prices.vip.toFixed(2), currency_code: config.currency },
                        quantity: vipQty.toString()
                    });
                }

                return actions.order.create({
                    purchase_units: [{
                        description: `Boletos para ${currentEvent.artist}`,
                        amount: {
                            value: total.toFixed(2),
                            currency_code: config.currency,
                            breakdown: {
                                item_total: {
                                    value: total.toFixed(2),
                                    currency_code: config.currency
                                }
                            }
                        },
                        items: items
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    // Dispatch a custom event with the details
                    const event = new CustomEvent('payment.success', { detail: { details, event: currentEvent } });
                    document.dispatchEvent(event);
                    ticketModal.hide();
                });
            },
            onError: function(err) {
                console.error('Ocurrió un error en el proceso de pago de PayPal:', err);
                alert('Ocurrió un error con el pago. Por favor, inténtalo de nuevo.');
            },
            style: {
                layout: 'vertical',
                color: 'gold',
                shape: 'rect',
                label: 'pay'
            }
        });
        if (paypalButtons.isEligible()) {
             paypalButtons.render('#paypal-button-container');
        } else {
            paypalButtonContainer.innerHTML = "PayPal no está disponible.";
        }
    }
}


export function initializeModal(concerts) {
    ticketModalEl = document.getElementById('ticket-modal');
    ticketModal = new bootstrap.Modal(ticketModalEl);

    ticketModalEl.addEventListener('show.bs.modal', function (event) {
        const button = event.relatedTarget;
        const eventIndex = button.getAttribute('data-event-index');
        currentEvent = concerts[eventIndex];
        
        document.getElementById('modal-artist-name').textContent = currentEvent.artist;
        document.getElementById('modal-event-details').textContent = `${currentEvent.date} - ${currentEvent.time} | ${currentEvent.venue}`;
        
        document.getElementById('modal-general-price').textContent = `$${currentEvent.prices.general.toFixed(2)}`;
        document.getElementById('modal-vip-price').textContent = `$${currentEvent.prices.vip.toFixed(2)}`;
        
        const quantityInputs = ticketModalEl.querySelectorAll('.quantity-input');
        quantityInputs.forEach(input => input.value = 0);
        
        updateTotalPrice();
    });

    ticketModalEl.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('quantity-btn')) {
            const input = target.classList.contains('plus')
                ? target.previousElementSibling
                : target.nextElementSibling;
            let value = parseInt(input.value);

            if (target.classList.contains('plus')) {
                value++;
            } else if (value > 0) {
                value--;
            }
            input.value = value;
            updateTotalPrice();
        }
    });
    
    ticketModalEl.addEventListener('change', (e) => {
        if (e.target.classList.contains('quantity-input')) {
            if (parseInt(e.target.value) < 0 || e.target.value === '') {
                e.target.value = 0;
            }
            updateTotalPrice();
        }
    });
}