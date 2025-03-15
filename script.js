// Preloader
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            // Add event listener for the transition end to remove the preloader completely
            preloader.addEventListener('transitionend', () => {
                preloader.remove();

                // Make sure all sections are visible even if not in viewport yet
                document.querySelectorAll('.fade-in').forEach(el => {
                    el.classList.add('appear');
                });
            });
        }, 500);
    }
});

// Add preloader to DOM
document.addEventListener('DOMContentLoaded', () => {
    // Don't create a new preloader if one already exists in the HTML
    if (!document.querySelector('.preloader')) {
        const preloader = document.createElement('div');
        preloader.className = 'preloader';
        preloader.innerHTML = '<div class="loader"></div>';
        document.body.appendChild(preloader);
    }

    // Mobile Navigation
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('active');
            burger.classList.toggle('toggle');
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                burger.classList.remove('toggle');
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Scroll animations
    const faders = document.querySelectorAll('.fade-in');
    const sliders = document.querySelectorAll('.slide-in');
    const timelineItems = document.querySelectorAll('.timeline-item');

    // Add fade-in class to elements that should animate on scroll
    document.querySelectorAll('.section-title, .about-content, .project-card, .award-item, .education-item, .contact-container').forEach(el => {
        if (!el.classList.contains('fade-in')) {
            el.classList.add('fade-in');
        }
    });

    // Intersection Observer for scroll animations
    const appearOptions = {
        threshold: 0.1,  // Reduced threshold to make it easier to trigger
        rootMargin: "0px 0px -50px 0px"  // Adjusted rootMargin
    };

    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('appear');
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);

    // Observe all fade-in elements
    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    sliders.forEach(slider => {
        appearOnScroll.observe(slider);
    });

    // Observe timeline items for staggered animation
    timelineItems.forEach((item, index) => {
        // Add a slight delay based on the index
        setTimeout(() => {
            appearOnScroll.observe(item);
        }, index * 100);
    });

    // Animate skill bars when they come into view
    const skillBars = document.querySelectorAll('.skill-item');

    skillBars.forEach(skill => {
        const skillLevel = skill.querySelector('.skill-level');
        const skillName = skill.querySelector('.skill-name');
        const width = skillLevel.style.width;

        // Set the percentage as a data attribute for CSS to use
        const percentage = width;
        skillName.setAttribute('data-percent', percentage);

        // Store the width value for animation
        skillLevel.style.setProperty('--width', width);
        skillLevel.style.width = '0'; // Start with width 0
    });

    // Improved intersection observer for skills with better threshold and rootMargin
    const animateSkills = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillsContainer = entry.target;

                // Add animation class with a slight delay for a staggered effect
                setTimeout(() => {
                    skillsContainer.classList.add('skill-animate');

                    // Add individual delays to each skill bar for a staggered animation
                    const skillItems = skillsContainer.querySelectorAll('.skill-item');
                    skillItems.forEach((item, index) => {
                        const skillLevel = item.querySelector('.skill-level');
                        // Create a staggered delay effect
                        const delay = index * 0.3; // Increase delay between bars
                        skillLevel.style.animationDelay = `${delay}s`;
                    });
                }, 200);

                // Unobserve after animation is triggered
                animateSkills.unobserve(skillsContainer);
            }
        });
    }, {
        threshold: 0.2,  // Trigger earlier
        rootMargin: "0px 0px -100px 0px"  // Trigger before fully in viewport
    });

    document.querySelectorAll('.skills-container').forEach(container => {
        animateSkills.observe(container);
    });

    // Form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Basic form validation
            if (!name || !email || !subject || !message) {
                showFormMessage('Please fill in all fields', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFormMessage('Please enter a valid email address', 'error');
                return;
            }

            // Simulate form submission (replace with actual form submission)
            showFormMessage('Sending message...', 'info');

            // Simulate API call
            setTimeout(() => {
                // Reset form
                contactForm.reset();
                showFormMessage('Message sent successfully!', 'success');
            }, 2000);
        });
    }

    // Function to show form messages
    function showFormMessage(message, type) {
        // Remove any existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;

        // Add to DOM
        const formGroup = document.querySelector('.form-group');
        contactForm.insertBefore(messageElement, formGroup);

        // Remove success/error message after 5 seconds
        if (type === 'success' || type === 'error') {
            setTimeout(() => {
                messageElement.remove();
            }, 5000);
        }
    }

    // Typing effect for hero section
    const heroTitle = document.querySelector('.hero-text h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';

        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };

        // Start typing effect after a delay
        setTimeout(typeWriter, 1500);
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add current year to footer
    const yearSpan = document.querySelector('.current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Add CSS class to body when page is fully loaded
    document.body.classList.add('loaded');

    // Timeline items click functionality
    timelineItems.forEach(item => {
        item.addEventListener('click', function() {
            // Toggle active class on the clicked item
            this.classList.toggle('active');

            // Close other expanded items
            timelineItems.forEach(otherItem => {
                if (otherItem !== this && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
        });
    });

    // Prevent the "View project details" link from triggering the timeline item click
    document.querySelectorAll('.read-more').forEach(link => {
        link.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });

    // Project Blog Modal Functionality
    const modal = document.querySelector('.project-blog-modal');
    const modalBody = document.querySelector('.modal-body');
    const closeBtn = document.querySelector('.modal-close');
    const blogButtons = document.querySelectorAll('.blog-toggle-btn');

    // Load blog content from external file
    let blogContents = {};

    // Function to fetch blog content
    async function fetchBlogContent() {
        try {
            console.log('Fetching blog content...');
            const response = await fetch('project-blogs.html');

            if (!response.ok) {
                throw new Error(`Failed to fetch blog content: ${response.status} ${response.statusText}`);
            }

            const html = await response.text();
            console.log('Blog content fetched successfully');

            // Create a temporary element to parse the HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;

            // Extract each blog content
            const microserviceBlog = tempDiv.querySelector('#microservice-blog');
            const databaseBlog = tempDiv.querySelector('#database-blog');
            const cicdBlog = tempDiv.querySelector('#cicd-blog');

            // Store blog contents
            blogContents = {
                microservice: microserviceBlog ? microserviceBlog.outerHTML : createFallbackContent('Microservice Architecture'),
                database: databaseBlog ? databaseBlog.outerHTML : createFallbackContent('Database Optimization'),
                cicd: cicdBlog ? cicdBlog.outerHTML : createFallbackContent('CI/CD Pipeline')
            };

            console.log('Blog content processed successfully');
        } catch (error) {
            console.error('Error fetching blog content:', error);

            // Fallback content if fetch fails
            blogContents = {
                microservice: createDetailedContent('microservice'),
                database: createDetailedContent('database'),
                cicd: createDetailedContent('cicd')
            };
        }
    }

    // Function to create fallback content
    function createFallbackContent(title) {
        return `<div class="blog-content"><h4>${title}</h4><p>Blog content unavailable. Please try again later.</p></div>`;
    }

    // Function to create detailed content if fetch fails
    function createDetailedContent(type) {
        let content = '<div class="blog-content">';

        if (type === 'microservice') {
            content += `
                <h4>Building a Scalable Microservice Architecture</h4>
                <div class="blog-body">
                    <p>When our fintech client approached us with the challenge of handling 10x growth in transaction volume, I knew we needed to rethink our architecture from the ground up.</p>

                    <h5>The Challenge</h5>
                    <p>The existing monolithic application was struggling with:</p>
                    <ul>
                        <li>Scaling bottlenecks in the payment processing module</li>
                        <li>Tightly coupled components making changes risky</li>
                        <li>Long deployment cycles (2-3 days) for even minor changes</li>
                        <li>Increasing infrastructure costs with inefficient resource utilization</li>
                    </ul>

                    <h5>The Solution</h5>
                    <p>We decomposed the application into domain-specific microservices:</p>
                    <ul>
                        <li><strong>Authentication Service:</strong> Handling user authentication and authorization</li>
                        <li><strong>Transaction Service:</strong> Processing financial transactions with idempotency guarantees</li>
                        <li><strong>Notification Service:</strong> Managing user notifications with priority queuing</li>
                        <li><strong>Reporting Service:</strong> Generating financial reports using event sourcing</li>
                        <li><strong>API Gateway:</strong> Providing a unified entry point for clients</li>
                    </ul>

                    <h5>Technical Implementation</h5>
                    <p>Built using NestJS, TypeScript, RabbitMQ, and Kubernetes with:</p>
                    <ul>
                        <li>Event-driven architecture for inter-service communication</li>
                        <li>Containerized services with horizontal pod autoscaling</li>
                        <li>Comprehensive monitoring and distributed tracing</li>
                    </ul>

                    <h5>The Results</h5>
                    <ul>
                        <li>Successfully processed 1.5 million transactions per day</li>
                        <li>Reduced deployment time from 2-3 days to under 15 minutes</li>
                        <li>40% reduction in infrastructure costs despite handling more traffic</li>
                        <li>99.99% uptime even during peak loads</li>
                    </ul>
                </div>
            `;
        } else if (type === 'database') {
            content += `
                <h4>Optimizing Database Performance at Scale</h4>
                <div class="blog-body">
                    <p>When response times for our core application began to exceed acceptable thresholds, I was tasked with identifying and resolving database bottlenecks without disrupting our 24/7 operation.</p>

                    <h5>The Challenge</h5>
                    <p>Our PostgreSQL database (500GB+) was facing:</p>
                    <ul>
                        <li>Complex queries joining multiple large tables with poor execution plans</li>
                        <li>Inefficient indexing strategy causing excessive disk I/O</li>
                        <li>High read/write contention during peak hours</li>
                        <li>Legacy code with ORM-generated queries that were difficult to optimize</li>
                    </ul>

                    <h5>The Solution</h5>
                    <ol>
                        <li><strong>Query Optimization:</strong> Rewrote critical queries using CTEs and optimized JOIN conditions</li>
                        <li><strong>Indexing Strategy:</strong> Implemented covering indexes, partial indexes, and removed unused ones</li>
                        <li><strong>Data Partitioning:</strong> Used declarative partitioning for time-series data</li>
                        <li><strong>Caching Layer:</strong> Introduced Redis for frequently accessed data</li>
                        <li><strong>Read Replicas:</strong> Set up replicas to offload reporting queries</li>
                    </ol>

                    <h5>Technical Implementation</h5>
                    <p>Key optimizations included:</p>
                    <ul>
                        <li>PostgreSQL configuration tuning (shared_buffers, work_mem, etc.)</li>
                        <li>Comprehensive monitoring with pg_stat_statements and Prometheus</li>
                        <li>Query rewriting to use CTEs and optimize execution plans</li>
                    </ul>

                    <h5>The Results</h5>
                    <ul>
                        <li>70% reduction in average query response time</li>
                        <li>95% reduction in slow queries</li>
                        <li>50% reduction in database CPU utilization</li>
                        <li>Ability to handle 3x the previous peak load</li>
                    </ul>
                </div>
            `;
        } else if (type === 'cicd') {
            content += `
                <h4>Automating Excellence: Our CI/CD Journey</h4>
                <div class="blog-body">
                    <p>When I joined the team, deployments were a stressful, manual process that took an entire weekend. Releases were infrequent, bugs were common, and developers were hesitant to make changes.</p>

                    <h5>The Challenge</h5>
                    <p>Our deployment process had several pain points:</p>
                    <ul>
                        <li>Manual, error-prone deployment steps documented in a 27-page runbook</li>
                        <li>Inconsistent environments between development, staging, and production</li>
                        <li>Limited automated testing with less than 30% code coverage</li>
                        <li>No rollback strategy for failed deployments</li>
                    </ul>

                    <h5>The Solution</h5>
                    <ol>
                        <li><strong>Continuous Integration:</strong> Automated build and test processes with GitHub Actions</li>
                        <li><strong>Test Automation:</strong> Implemented unit, integration, and end-to-end tests</li>
                        <li><strong>Infrastructure as Code:</strong> Defined all infrastructure using Terraform</li>
                        <li><strong>Containerization:</strong> Dockerized the application for environment consistency</li>
                        <li><strong>Deployment Automation:</strong> Created a multi-stage pipeline with GitOps workflow</li>
                    </ol>

                    <h5>Technical Implementation</h5>
                    <p>The implementation included:</p>
                    <ul>
                        <li>GitHub Actions workflows for PR validation, builds, and deployments</li>
                        <li>Kubernetes deployments with Helm charts and horizontal pod autoscaling</li>
                        <li>Comprehensive monitoring with Prometheus, Grafana, and Jaeger</li>
                    </ul>

                    <h5>The Results</h5>
                    <ul>
                        <li>Reduced deployment time from 2 days to under 30 minutes (80% reduction)</li>
                        <li>Increased release frequency from monthly to daily</li>
                        <li>Decreased production bugs by 65%</li>
                        <li>Improved developer satisfaction from 3.2/10 to 8.7/10</li>
                    </ul>
                </div>
            `;
        }

        content += '</div>';
        return content;
    }

    // Fetch blog content when page loads
    fetchBlogContent();

    // Open modal with appropriate blog content
    blogButtons.forEach(button => {
        button.addEventListener('click', function() {
            const projectCard = this.closest('.project-card');
            const projectType = projectCard.dataset.project;

            if (blogContents[projectType]) {
                console.log(`Opening modal for ${projectType} project`);

                // Clear previous content
                modalBody.innerHTML = '';

                // Check if content is HTML string or DOM element
                if (typeof blogContents[projectType] === 'string') {
                    modalBody.innerHTML = blogContents[projectType];
                } else {
                    modalBody.appendChild(blogContents[projectType].cloneNode(true));
                }

                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open

                console.log('Modal opened successfully');
            } else {
                console.error('Blog content not found for:', projectType);

                // Fallback if content is missing
                modalBody.innerHTML = createDetailedContent(projectType);
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close modal when clicking the close button
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Re-enable scrolling
        });
    }

    // Close modal when clicking outside the content
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = ''; // Re-enable scrolling
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Re-enable scrolling
        }
    });
});