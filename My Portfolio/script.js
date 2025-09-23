document.addEventListener('DOMContentLoaded', () => {

    // --- SMOOTH SCROLLING FOR NAV LINKS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
            // Close mobile nav on click
            const mobileNav = document.querySelector('.mobile-nav');
            if (mobileNav.classList.contains('open')) {
                mobileNav.classList.remove('open');
            }
        });
    });

    // --- THEME TOGGLE (LIGHT/DARK MODE) ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check for saved theme in localStorage
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        // Save theme preference
        if (body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
        } else {
            localStorage.removeItem('theme');
        }
    });

    // --- SCROLL ANIMATIONS (INTERSECTION OBSERVER) ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // --- MOBILE NAVIGATION ---
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const mobileNav = document.querySelector('.mobile-nav');
    
    menuToggle.addEventListener('click', () => {
        mobileNav.classList.add('open');
    });
    
    menuClose.addEventListener('click', () => {
        mobileNav.classList.remove('open');
    });

   // --- JOURNEY TIMELINE MODAL (with grades header) ---
    const timelineCards = document.querySelectorAll('.timeline-card');
    const journeyModal = document.getElementById('journey-modal');
    
    if (journeyModal) { 
        const modalTitle = document.getElementById('modal-title');
        const modalDetails = document.getElementById('modal-details');
        const modalLink = document.getElementById('modal-link');
        const modalIbmCourses = document.getElementById('modal-ibm-courses');
        const closeModal = document.querySelector('.close-button');

        modalLink.addEventListener('click', function(event) {
            event.preventDefault(); 
            const url = this.dataset.url; 
            if (url) {
                window.open(url, '_blank'); 
            }
        });

        timelineCards.forEach(card => {
            card.addEventListener('click', () => {
                const title = card.dataset.title;
                const details = card.dataset.details;
                const link = card.dataset.link;
                const ibmCoursesData = card.dataset.ibmCourses;

                modalTitle.textContent = title;
                modalDetails.textContent = details;
                
                if (link) {
                    modalLink.dataset.url = link; 
                    modalLink.style.display = 'inline-block';
                } else {
                    delete modalLink.dataset.url; 
                    modalLink.style.display = 'none';
                }

                modalIbmCourses.innerHTML = ''; 
                if (ibmCoursesData) {
                    const courses = JSON.parse(ibmCoursesData);
                    // UPDATED PART: Added a header div before the list
                    let coursesHtml = `
                        <h4>Courses Completed:</h4>
                        <div class="courses-header">
                            <span>Course Name</span>
                            <span>Grade</span>
                        </div>
                        <ul>`;
                    courses.forEach(course => {
                        coursesHtml += `
                            <li>
                                <a href="${course.link}" target="_blank">${course.name}</a>
                                ${course.grade ? `<span class="course-grade">${course.grade}</span>` : ''}
                            </li>`;
                    });
                    coursesHtml += '</ul>';
                    modalIbmCourses.innerHTML = coursesHtml;
                }
                
                journeyModal.style.display = 'block';
            });
        });

        const closeJourneyModal = () => {
            journeyModal.style.display = 'none';
        };

        closeModal.addEventListener('click', closeJourneyModal);
        
        window.addEventListener('click', (event) => {
            if (event.target == journeyModal) {
                closeJourneyModal();
            }
        });
    }
    // --- PROJECT FILTERING ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.projects-grid .project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Set active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.dataset.filter;

            projectCards.forEach(card => {
                const categories = card.dataset.category;
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // --- PROJECT MODAL ---
    const projModal = document.getElementById('project-modal');
    if (projModal) {
        const modalTitle = document.getElementById('project-modal-title');
        const modalDesc = document.getElementById('project-modal-description');
        const modalTech = document.getElementById('project-modal-tech');
        const modalLinks = document.getElementById('project-modal-links');
        const closeBtn = projModal.querySelector('.close-button');

        projectCards.forEach(card => {
            card.addEventListener('click', () => {
                modalTitle.textContent = card.dataset.title;
                modalDesc.textContent = card.dataset.description;

                // Populate tech stack
                modalTech.innerHTML = '';
                const techArray = card.dataset.tech.split(',');
                techArray.forEach(tech => {
                    const techSpan = document.createElement('span');
                    techSpan.textContent = tech.trim();
                    modalTech.appendChild(techSpan);
                });

                // Populate links
                modalLinks.innerHTML = '';
                if (card.dataset.liveLink) {
                    const link = document.createElement('a');
                    link.href = card.dataset.liveLink;
                    link.textContent = 'Live Demo 🚀';
                    link.target = '_blank';
                    link.className = 'btn-secondary';
                    modalLinks.appendChild(link);
                }
                if (card.dataset.repoLink) {
                    const link = document.createElement('a');
                    link.href = card.dataset.repoLink;
                    link.innerHTML = '<i class="fab fa-github"></i> GitHub Repo';
                    link.target = '_blank';
                    link.className = 'btn-secondary';
                    modalLinks.appendChild(link);
                }
                if (card.dataset.dashboardLink) {
                    const link = document.createElement('a');
                    link.href = card.dataset.dashboardLink;
                    link.textContent = 'View Dashboard 📊';
                    link.target = '_blank';
                    link.className = 'btn-secondary';
                    modalLinks.appendChild(link);
                }

                projModal.style.display = 'block';
            });
        });

        // Close modal
        const closeProjectModal = () => {
            projModal.style.display = 'none';
        }
        closeBtn.addEventListener('click', closeProjectModal);
        
        // Also add to the main window click listener if it exists
        // (This makes the close logic work for both modals)
        window.addEventListener('click', (event) => {
            if (event.target == projModal) {
                closeProjectModal();
            }
        });
    }
    
    // --- FLOATING PARTICLES EFFECT ---
    const particleContainer = document.getElementById('particle-container');
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
        let particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = `${Math.random() * 3}px`;
        particle.style.height = particle.style.width;
        particle.style.borderRadius = '50%';
        particle.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animation = `float ${Math.random() * 10 + 5}s ease-in-out infinite`;
        particleContainer.appendChild(particle);
    }
    
    // Add keyframes for floating animation
    const styleSheet = document.styleSheets[0];
    const keyframes = `
    @keyframes float {
        0% { transform: translate(0, 0); }
        50% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px); }
        100% { transform: translate(0, 0); }
    }`;
    styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
    
    // --- SCROLL PROGRESS INDICATOR ---
    const scrollIndicator = document.querySelector('.scroll-indicator');

    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        scrollIndicator.style.width = `${scrollPercentage}%`;
    });
    
});