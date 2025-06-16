// Header scroll effect
        window.addEventListener('scroll', () => {
            const header = document.getElementById('header');
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });

        // Counter animation
        function animateCounter(element, target) {
            let count = 0;
            const increment = target / 100;
            const timer = setInterval(() => {
                count += increment;
                if (count >= target) {
                    count = target;
                    clearInterval(timer);
                }
                element.textContent = Math.floor(count);
            }, 20);
        }

        // Stats counter
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const number = entry.target.querySelector('.stat-number');
                    const target = parseInt(number.dataset.target);
                    animateCounter(number, target);
                    statsObserver.unobserve(entry.target);
                }
            });
        });

        document.querySelectorAll('.stat-item').forEach(stat => {
            statsObserver.observe(stat);
        });

        // Particles effect
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            const particleCount = 20;

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                
                // Random size
                const size = Math.random() * 4 + 2;
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                
                // Random position
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                
                // Random animation delay
                particle.style.animationDelay = Math.random() * 6 + 's';
                
                particlesContainer.appendChild(particle);
            }
        }

        // Navigation functions
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        function goToStore() {
            window.location.href = 'index.html';
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            createParticles();
        });

        // Mobile menu toggle (for future implementation)
        function toggleMobileMenu() {
            // Future mobile menu functionality
        }