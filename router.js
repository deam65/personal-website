class Router {
    constructor(routes) {
        this.routes = routes;
        this.rootElement = document.getElementById('app');
        this.init();
    }

    init() {
        window.addEventListener('popstate', () => this.handleRoute());
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-link]')) {
                e.preventDefault();
                this.navigateTo(e.target.getAttribute('href'));
            }
        });
        this.handleRoute();
    }

    async handleRoute() {
        const path = window.location.pathname;
        const route = this.routes[path] || this.routes['/'];
        
        try {
            const response = await fetch(route.template);
            const html = await response.text();
            this.rootElement.innerHTML = html;
            if (route.script) {
                const script = document.createElement('script');
                script.src = route.script;
                this.rootElement.appendChild(script);
            }
        } catch (error) {
            console.error('Error loading route:', error);
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