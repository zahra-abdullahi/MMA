// Add fade-in animation to sections on scroll
document.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (sectionTop < windowHeight - 100) {
        section.classList.add('fade-in');
      }
    });
  });
  
  // Handle contact form submission
  document.getElementById('contact-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for your message!');
    e.target.reset();
  });

  document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Show a success message
            const alert = document.createElement('div');
            alert.className = 'alert alert-success';
            alert.textContent = 'Message sent successfully!';
            form.parentNode.insertBefore(alert, form);
            form.reset(); // Clear the form
        } else {
            // Show an error message
            const alert = document.createElement('div');
            alert.className = 'alert alert-error';
            alert.textContent = 'Error sending message. Please try again.';
            form.parentNode.insertBefore(alert, form);
        }
    })
    .catch(error => {
        // Show an error message
        const alert = document.createElement('div');
        alert.className = 'alert alert-error';
        alert.textContent = 'Error sending message. Please try again.';
        form.parentNode.insertBefore(alert, form);
    });
});
document.addEventListener("DOMContentLoaded", function () {
  let currentAmount = 500;  // Example current amount raised
  let goalAmount = 5000;  // Fundraising goal
  let progressBar = document.querySelector(".donation-progress");

  let percentage = (currentAmount / goalAmount) * 100;
  progressBar.style.width = percentage + "%";
});
