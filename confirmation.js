let confirmationModal;

function showConfirmationTicket(paymentDetails) {
    const { details, event: currentEvent } = paymentDetails;
    const transactionId = details.id;
    const items = details.purchase_units[0].items;

    document.getElementById('ticket-artist-name').textContent = currentEvent.artist;
    document.getElementById('stub-artist').textContent = currentEvent.artist;
    document.getElementById('ticket-event-date').textContent = `${currentEvent.date} - ${currentEvent.time}`;
    document.getElementById('ticket-event-venue').textContent = currentEvent.venue;

    let ticketInfoText = '';
    let qrData = `Transacción: ${transactionId}\nArtista: ${currentEvent.artist}\n`;
    let ticketTypeSummary = '';

    items.forEach(item => {
        const qty = item.quantity;
        const type = item.name.includes('General') ? 'General' : 'VIP';
        ticketInfoText += `<p>${qty} x Boleto ${type}</p>`;
        qrData += `Boleto ${type}: ${qty}\n`;
        if (ticketTypeSummary) ticketTypeSummary += ' / ';
        ticketTypeSummary += `${qty}x ${type}`;
    });
    
    document.getElementById('ticket-type-info').innerHTML = ticketInfoText;
    document.getElementById('stub-ticket-type').textContent = ticketTypeSummary;

    // Generate QR Code
    const qrCodeContainer = document.getElementById('qrcode');
    qrCodeContainer.innerHTML = '';
    try {
        const qr = qrcode(0, 'L');
        qr.addData(qrData);
        qr.make();
        qrCodeContainer.innerHTML = qr.createImgTag(4, 4);
    } catch (e) {
        console.error("Error generating QR code:", e);
        qrCodeContainer.textContent = 'Error al generar QR.';
    }

    confirmationModal.show();
}

export function initializeConfirmation() {
    const confirmationModalEl = document.getElementById('confirmation-modal');
    confirmationModal = new bootstrap.Modal(confirmationModalEl);
    
    const printTicketBtn = document.getElementById('print-ticket-btn');

    document.addEventListener('payment.success', (e) => {
        showConfirmationTicket(e.detail);
    });
    
    printTicketBtn.addEventListener('click', () => {
        const ticketContent = document.querySelector('.ticket-design');
        if (ticketContent) {
            const printWindow = window.open('', '', 'height=800,width=800');
            printWindow.document.write('<html><head><title>Tu Boleto</title>');
            printWindow.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">');
            printWindow.document.write('<link rel="stylesheet" href="style.css"><link rel="stylesheet" href="components/ticket.css">');
            printWindow.document.write('<style>body { background: #fff !important; -webkit-print-color-adjust: exact; color-adjust: exact; } .ticket-design-wrapper { box-shadow: none; } .ticket-design { margin: 20px auto; box-shadow: none; border: 1px solid #ccc; } .ticket-actions { display: none; } </style>');
            printWindow.document.write('</head><body>');
            const printable = document.createElement('div');
            printable.className = "container";
            printable.innerHTML = `<div class="row justify-content-center"><div class="col-10">${ticketContent.outerHTML}</div></div>`;
            printWindow.document.write(printable.innerHTML);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            
            setTimeout(() => { // Wait for content to load
                printWindow.print();
                printWindow.close();
            }, 500);
        }
    });
}