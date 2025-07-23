import { config } from 'app/config';

export function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            const subject = `Mensaje de ${name} (${email}) desde el sitio web`;
            
            const recipientEmail = config.contactEmail;
            
            const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
            
            window.location.href = mailtoLink;

            contactForm.reset();
        });
    }
}

