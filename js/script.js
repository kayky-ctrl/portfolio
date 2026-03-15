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
    
    // Lista exata dos repositórios que você quer mostrar
    const priorityRepos = [
        "ReconhecimentoFacialRaspberry",
        "GestaodePedidos.Api",
        "ProjetoFenix",
        "SHOPGEST",
        "CoderChallengeBonus"
    ];

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
        const allRepos = await response.json();

        // Filtra apenas os da lista acima
        const filteredRepos = allRepos.filter(repo => priorityRepos.includes(repo.name));

        // Ordena conforme a sua lista de prioridade
        filteredRepos.sort((a, b) => priorityRepos.indexOf(a.name) - priorityRepos.indexOf(b.name));

        grid.innerHTML = ""; 

        filteredRepos.forEach(repo => {
            grid.innerHTML += createProjectCard(repo);
        });

    } catch (error) {
        grid.innerHTML = `<p class="text-center">Erro ao carregar projetos selecionados.</p>`;
    }
}
// Auxiliar: Cria o HTML do Card (Deixa o código principal mais limpo)
function createProjectCard(repo) {
    // Usando a imagem social do repositório (OpenGraph) para ficar visualmente bonito
    const imageUrl = `https://opengraph.githubassets.com/1/${repo.full_name}`;
    const description = repo.description || "Projeto focado em tecnologia e inovação.";
    
    return `
        <article class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100 shadow-sm border-glass bg-glass">
                <div class="img-project" style="background-image: url('${imageUrl}'); height: 200px; background-size: cover; background-position: center;"></div>
                <div class="card-body d-flex flex-column">
                    <h4 class="card-title">${repo.name}</h4>
                    <p class="card-text flex-grow-1">${description}</p>
                    <a href="${repo.html_url}" target="_blank" class="btn-project hvr-grow-shadow mt-3 text-center">Acessar Repositório</a>
                </div>
            </div>
        </article>
    `;
}

// --- 3. Gerenciamento de Links Ativos ---
function initActiveLinks() {
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      navLinks.forEach((el) => el.classList.remove("active"));
      this.classList.add("active");
    });
  });
}

function updateYear() {
  var textFooter = document.getElementById("footerText");

  var agora = new Date();
  var year = agora.getFullYear();

  textFooter.innerHTML = `
        &copy; ${year} Kayky. Todos os direitos reservados.
    `;
}

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Impede a página de recarregar

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    fetch('http://localhost:3000/enviar-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Mensagem enviada com sucesso!');
        contactForm.reset();
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Houve um erro ao enviar a mensagem.');
    });
});
