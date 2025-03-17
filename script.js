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
  




document.addEventListener("DOMContentLoaded", showSlides);


    document.getElementById("contact-form").addEventListener("submit", async function (event) {
        event.preventDefault();
        
        let form = event.target;
        let formData = new FormData(form);
        let statusDiv = document.getElementById("form-status");
        
        try {
            let response = await fetch(form.action, {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                statusDiv.innerHTML = "<p class='success'>Thank you! Your message has been sent.</p>";
                form.reset();
            } else {
                statusDiv.innerHTML = "<p class='error'>Oops! Something went wrong. Please try again.</p>";
            }
        } catch (error) {
            statusDiv.innerHTML = "<p class='error'>There was a problem submitting your form.</p>";
        }
    });