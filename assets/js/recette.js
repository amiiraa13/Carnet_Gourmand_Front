const containerRecette = document.querySelector("#recettes > div");
const recetteDb = async () => {
  const response = await fetch(
    "http://localhost:3000/recettes/" + getRecetteId()
  );
  return response.json();
};

const ingrDb = async () => {
  const response = await fetch("http://localhost:3000/ingredients/");
  return response.json();
};

const updateRecipe = async (id, updatedRecipe) => {
  const response = await fetch(`http://localhost:3000/recettes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedRecipe),
  });
  if (response.ok) {
    alert("Recette modifiée avec succès !");
    window.location.reload(); // Recharge la page pour afficher les modifications
  } else {
    alert("Erreur lors de la modification de la recette.");
  }
};

recetteDb().then((recette) => {
  let titre = document.createElement("h1");
  titre.innerText = recette.titre;
  titre.classList.add("recette");

  let temps = document.createElement("p");
  temps.innerText = recette.temps;

  let difficulte = document.createElement("p");
  difficulte.innerText = recette.difficulte;

  let categorie = document.createElement("p");
  categorie.innerText = recette.categorie;

  let instructions = document.createElement("p");
  instructions.innerText = recette.instructions;

  let ingredients = document.createElement("p");
  ingredients.innerText = recette.ingredients
    .map((ingredient) => {
      return ingredient.nom;
    })
    .join(" , ");

  let editButton = document.createElement("button");
  editButton.innerText = "Modifier";
  editButton.addEventListener("click", () => {
    showEditForm(recette);
  });

  containerRecette.appendChild(titre);
  containerRecette.appendChild(ingredients);
  containerRecette.appendChild(temps);
  containerRecette.appendChild(difficulte);
  containerRecette.appendChild(categorie);
  containerRecette.appendChild(instructions);
  containerRecette.appendChild(editButton);
});



function getRecetteId() {
  let url = window.location.href; //recupere l'url en chaine de caractere
  let objUrl = new URL(url); // converti l'url en objet
  const id = objUrl.searchParams.get("id"); // recupere le parametre de requete "id"
  return id;
}

const showEditForm = (recette) => {
 
  

  const formContainer = document.createElement("div");
  formContainer.classList.add("edit-form");

  ingrDb().then((recettes) => {
    const affIngr = document.createElement("div");
    affIngr.classList.add("ing")
    recettes.forEach((element) => {
      let ingredients = document.createElement("p");
      ingredients.classList.add("ingredients");
      ingredients.innerText = element.nom;
      affIngr.appendChild(ingredients);
      formContainer.appendChild(affIngr)
      
   if (recette.ingredients.some(ing =>ing._id == element._id) ) {
    ingredients.setAttribute("data", element._id);
    ingredients.classList.add("selected");
     }
      ingredients.addEventListener("click", function () {
        ingredients.setAttribute("data", element._id);
        ingredients.classList.toggle("selected");
      });
    });
  });

  const titreInput = document.createElement("input");
  titreInput.type = "text";
  titreInput.value = recette.titre;
  titreInput.placeholder = "Titre";

  const instructionInput = document.createElement("textarea");
  instructionInput.value = recette.instructions;
  instructionInput.placeholder = "Instructions";

  const tempsInput = document.createElement("input");
  tempsInput.type = "text";
  tempsInput.value = recette.temps;
  tempsInput.placeholder = "Temps de préparation";

  const diffInput = document.createElement("input");
  diffInput.type = "text";
  diffInput.value = recette.difficulte;
  diffInput.placeholder = "Difficulté";

  

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.value = recette.categorie;
  categoryInput.placeholder = "Catégorie";
  const saveButton = document.createElement("button");
  saveButton.innerText = "Enregistrer";
  saveButton.addEventListener("click", () => {
    const ingredients = document.querySelectorAll(".selected");
  const saveData = [];
  ingredients.forEach((ingr) => {
    saveData.push(ingr.getAttribute("data"));

   
  });
    const updatedRecette = {
      titre: titreInput.value,
      ingredients: saveData,
      instructions: instructionInput.value,
      temps: tempsInput.value,
      difficulte: diffInput.value,
      categorie: categoryInput.value,
    };
    updateRecipe(recette._id, updatedRecette);
  });
  formContainer.appendChild(titreInput);
  formContainer.appendChild(instructionInput);
  formContainer.appendChild(tempsInput);
  formContainer.appendChild(diffInput);
  formContainer.appendChild(categoryInput);
 
  formContainer.appendChild(saveButton);

  containerRecette.innerHTML = ""; // Clear existing recipes
  containerRecette.appendChild(formContainer);
};
// recettes.ingredients.some(ing =>ing._id == recette._id)