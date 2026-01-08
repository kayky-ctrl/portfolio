document.addEventListener("DOMContentLoaded", () => {
    initNavbarScroll();
    initGitHubProjects("kayky-ctrl");
    initActiveLinks();
    updateYear();
});

// --- 1. Efeito da Navbar ao rolar ---
function initNavbarScroll() {
    const navbar = document.querySelector(".navbar");
    
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("navbar-scrolled");
        } else {
            navbar.classList.remove("navbar-scrolled");
        }
    });
}

// --- 2. Busca de Projetos no GitHub ---
async function initGitHubProjects(username) {
    const grid = document.getElementById("github-projects-grid");
    const loadingMessage = document.getElementById("projects-loading-message");
    const apiUrl = `https://api.github.com/users/${username}/repos?sort=updated&direction=desc&per_page=4`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Erro na API");
        
        const repos = await response.json();
        const nonForkRepos = repos.filter(repo => !repo.fork);

        if (loadingMessage) loadingMessage.remove();

        // Limpa o grid antes de inserir (evita duplicatas)
        grid.innerHTML = ""; 

        nonForkRepos.forEach(repo => {
            const cardHtml = createProjectCard(repo);
            grid.innerHTML += cardHtml;
        });

    } catch (error) {
        console.error("Erro ao carregar GitHub:", error);
        if (grid) grid.innerHTML = `<p class="text-danger text-center">Erro ao carregar projetos.</p>`;
    }
}

// Auxiliar: Cria o HTML do Card (Deixa o código principal mais limpo)
function createProjectCard(repo) {
    const imageUrl = `https://opengraph.githubassets.com/1/${repo.full_name}`;
    const description = repo.description || "Sem descrição disponível.";
    
    return `
        <article class="col">
            <div class="card h-100 shadow-sm">
                <div class="img-project" style="background-image: url('${imageUrl}')"></div>
                <div class="card-body">
                    <h4 class="card-title">${repo.name}</h4>
                    <p class="card-text text-muted">${description}</p>
                    <a href="${repo.html_url}" target="_blank" class="btn-project hvr-grow-shadow mt-3">Ver no GitHub</a>
                </div>
            </div>
        </article>
    `;
}

// --- 3. Gerenciamento de Links Ativos ---
function initActiveLinks() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(el => el.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function updateYear() {
    var textFooter = document.getElementById('footerText');

    var agora = new Date();
    var year = agora.getFullYear();

    textFooter.innerHTML = `
        &copy; ${year} Kayky. Todos os direitos reservados.
    `

}