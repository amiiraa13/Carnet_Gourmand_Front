const searchButton = document.querySelector(".search-button");
const searchInput = document.querySelector(".search-input");
const containerRecette = document.querySelector("#recettes > div");
const recetteDb = async () => {
  const response = await fetch("http://127.0.0.1:3000/recettes/");
  return response.json();
};

const ingrDb = async () => {
  const response = await fetch("http://localhost:3000/ingredients/");
  return response.json();
};

const addRecipe = async (newRecipe) => {
  const response = await fetch("http://127.0.0.1:3000/recettes/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newRecipe),
  });
  if (response.ok) {
    let Newcontainer = document.createElement("div");
    let newLink = document.createElement("a");
    newLink.href = "./recettes.html?id=" + newRecipe._id;
    newLink.classList.add("recette");

    let titre = document.createElement("h3");
    titre.innerText = newRecipe.titre;

    Newcontainer.appendChild(newLink);
    newLink.appendChild(titre);
    containerRecette.appendChild(Newcontainer);
  } else {
    alert("Erreur lors de l'ajout de la recette.");
  }
};

recetteDb().then((recettes) => {
  recettes.forEach((recette) => {
    let container = document.createElement("div");
    let link = document.createElement("a");
    link.href = "./recettes.html?id=" + recette._id;
    link.classList.add("recette");

    let titre = document.createElement("h3");
    titre.innerText = recette.titre;

    container.appendChild(link);
    link.appendChild(titre);
    containerRecette.appendChild(container);

    let image = document.createElement("img");
    image.src = "../assets/img/poubelle.png";
    image.alt = "poubelle";
    image.style.height = "50px";
    image.addEventListener("click", (e) => {
      e.stopPropagation(); // Pour éviter de déclencher l'événement de clic du lien
      supp(recette._id);
    });

    container.appendChild(image);
  });
});

ingrDb().then((recettes) => {
  const affIngr = document.querySelector(".affIngr");
  recettes.forEach((recette) => {
    let ingredients = document.createElement("p");
    ingredients.classList.add("ingredients");
    ingredients.innerText = recette.nom;
    affIngr.appendChild(ingredients);
    ingredients.addEventListener("click", function () {
      ingredients.setAttribute("data", recette._id);
      ingredients.classList.toggle("selected");
    });
  });
});

const filterRecipes = (recipes, searchTerm, searchOption) => {
  return recipes.filter((recipe) => {
    const value = recipe[searchOption].toLowerCase();
    return value.includes(searchTerm.toLowerCase());
  });
};

searchButton.addEventListener("click", async () => {
  const searchOption = document.querySelector(
    "input[name='searchOption']:checked"
  ).value;
  const searchTerm = searchInput.value;

  const response = await fetch(
    "http://127.0.0.1:3000/recettes?" + searchOption + "=" + searchTerm,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => {
      return res.json();
    })

    .then((recipes) => {
      const searchButton = document.querySelector(".search-button");
      const searchInput = document.querySelector(".search-input");
      const searchTerm = searchInput.value;
      const searchOption = document.querySelector(
        "input[name='searchOption']:checked"
      ).value;

      containerRecette.innerHTML = "";

      const filteredRecipes = filterRecipes(recipes, searchTerm, searchOption);

      filteredRecipes.forEach((recipe) => {
        let container = document.createElement("div");
        let link = document.createElement("a");
        link.href = "./recettes.html?id=" + recipe._id;
        link.classList.add("recipe");

        let title = document.createElement("h3");
        title.innerText = recipe.titre;

        let category = document.createElement("p");
        category.innerText = recipe.categorie;
        let image = document.createElement("img");
        image.src = "../assets/img/poubelle.png";
        image.alt = "poubelle";
        image.style.height = "50px";
        image.addEventListener("click", (e) => {
          e.stopPropagation(); // Pour éviter de déclencher l'événement de clic du lien
          supp(recipe._id);
        });
        link.appendChild(title);
        link.appendChild(category);
        container.appendChild(link);
        container.appendChild(image);
        containerRecette.appendChild(container);
      });
    });
});

async function supp(recetteId) {
  const response = await fetch("http://127.0.0.1:3000/recettes/" + recetteId, {
    method: "DELETE",
  });
  if (response.ok) {
    window.location.reload(); // Recharge la page pour afficher les modifications
  } else {
    alert("Erreur lors de la suppression de la recette.");
  }
}

function openModal(element) {
  if (window.innerWidth <= 1000) {
    window.location.href = element.getAttribute("data-url");
  } else {
    document.querySelector(".overlay").style.display = "block";
    document.querySelector(".modal").classList.add("modal-open");
  }
  console.log(window.innerWidth);
}

function closeModal() {
  document.querySelector(".overlay").style.display = "none";
  document.querySelector(".modal").classList.remove("modal-open");
}

// Ajouter la fonctionnalité pour afficher le formulaire d'ajout de recette
const showAddForm = () => {
  const ingredients = document.querySelectorAll(".selected");
  const saveData = [];
  ingredients.forEach((ingr) => {
    saveData.push(ingr.getAttribute("data"));
  });
  const titreInput = document.querySelector("#titre");
  const instructionInput = document.querySelector("#instructions");
  const tempsInput = document.querySelector("#temps");
  const diffInput = document.querySelector("#difficulte");
  const categoryInput = document.querySelector("#categorie");
  const saveButton = document.querySelector("#ajouter");

  const newRecipe = {
    titre: titreInput.value,
    instructions: instructionInput.value,
    temps: tempsInput.value,
    difficulte: diffInput.value,
    categorie: categoryInput.value,
    ingredients: saveData,
  };

  addRecipe(newRecipe);
};

// Ajout d'un bouton pour ouvrir le formulaire d'ajout de recette
const addButton = document.querySelector("#boutAjout");

addButton.addEventListener("click", showAddForm);

// Assurez-vous que containerRecette est un enfant direct du body
document.querySelector("#recettes").appendChild(containerRecette);
