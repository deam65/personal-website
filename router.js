class Router {
    constructor(routes) {
        this.routes = routes;
        this.rootElement = document.getElementById('app');
        this.contentElement = document.getElementById('content');
        this.init();
    }

    init() {
        window.addEventListener('popstate', () => this.handleRoute());
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-link]')) {
                e.preventDefault();
                const href = e.target.getAttribute('href');
                this.navigateTo(href);
            }
        });
        this.handleRoute();
    }

    async handleRoute() {
        const path = window.location.pathname;
        console.log('Current path:', path);
        
        const cleanPath = path.endsWith('/') ? path.slice(0, -1) : path;
        const route = this.routes[cleanPath] || this.routes['/'];
        
        try {
            const response = await fetch(route.template);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            
            // Create a temporary container to parse the HTML
            const temp = document.createElement('div');
            temp.innerHTML = html;
            
            // Get the main content (section)
            const mainContent = temp.querySelector('section');
            if (mainContent) {
                // Update only the content area
                this.contentElement.innerHTML = '';
                this.contentElement.appendChild(mainContent);
            } else {
                throw new Error('No section found in template');
            }
            
            // Update active link in navigation
            this.updateActiveLink(cleanPath);
            
        } catch (error) {
            console.error('Error loading route:', error);
            this.navigateTo('/');
        }
    }

    updateActiveLink(path) {
        // Remove active class from all links
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current link
        const activeLink = document.querySelector(`.nav-links a[href="${path}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    navigateTo(path) {
        window.history.pushState({}, '', path);
        this.handleRoute();
    }
}

const routes = {
    '/': {
        template: 'src/pages/home.html',
        script: 'script.js'
    },
    '/projects': {
        template: 'src/pages/projects.html',
        script: 'script.js'
    },
    '/skills': {
        template: 'src/pages/skills.html',
        script: 'script.js'
    },
    '/contact': {
        template: 'src/pages/contact.html',
        script: 'script.js'
    }
};

const router = new Router(routes); 