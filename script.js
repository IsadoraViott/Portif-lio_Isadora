const githubUsername = "IsadoraViott";

// Repositórios que você quer destacar primeiro na seção dinâmica
const destaqueRepos = ["Oncocare_V3", "EveryDay", "rede-social", "chat"];

function criarCardRepo(repo) {
  const card = document.createElement("div");
  card.classList.add("repo-card");

  const title = document.createElement("h3");
  title.textContent = repo.name;

  const description = document.createElement("p");
  description.textContent = repo.description
    ? repo.description
    : "Projeto sem descrição cadastrada no repositório.";

  const info = document.createElement("p");
  info.classList.add("repo-info");
  info.textContent = repo.language
    ? `Linguagem principal: ${repo.language}`
    : "Linguagem principal: não informada.";

  const link = document.createElement("a");
  link.href = repo.html_url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Ver código no GitHub";

  card.appendChild(title);
  card.appendChild(description);
  card.appendChild(info);
  card.appendChild(link);

  return card;
}

function ordenarRepos(repos) {
  // Coloca primeiro os nomes da lista destaqueRepos
  return repos.sort((a, b) => {
    const aDestaque = destaqueRepos.includes(a.name);
    const bDestaque = destaqueRepos.includes(b.name);

    if (aDestaque && !bDestaque) return -1;
    if (!aDestaque && bDestaque) return 1;
    return 0;
  });
}

function carregarRepos() {
  const container = document.getElementById("repos-container");
  if (!container) return;

  container.textContent = "Carregando projetos...";

  fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao buscar repositórios.");
      }
      return response.json();
    })
    .then((repos) => {
      // filtra forks
      const reposFiltrados = repos.filter((repo) => !repo.fork);

      const reposOrdenados = ordenarRepos(reposFiltrados);

      container.textContent = "";

      if (reposOrdenados.length === 0) {
        container.textContent = "Nenhum repositório público encontrado.";
        return;
      }

      reposOrdenados.forEach((repo) => {
        const card = criarCardRepo(repo);
        container.appendChild(card);
      });
    })
    .catch((error) => {
      console.error(error);
      container.textContent =
        "Não foi possível carregar os projetos do GitHub no momento.";
    });
}

document.addEventListener("DOMContentLoaded", carregarRepos);
