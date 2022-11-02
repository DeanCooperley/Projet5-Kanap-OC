// Récupération des données de l'Api

fetch(`http://localhost:3000/api/products`)
  .then(function(response) {
    if(response.ok) {
      return response.json();
    }
  })
  .then(function(articles) {
    console.log(articles);
    creationObjets(articles);
  })
  .catch(function(error) {
    
  })

// Création de la classe "Meubles"
class Meubles {
  constructor(couleur, id, nom, prix, imageUrl, description, altTexte){
    this.couleur = couleur;
    this.id = id;
    this.nom = nom;
    this.prix = prix;
    this.imageUrl = imageUrl;
    this.description = description;
    this.altTexte = altTexte;
  }
}

// Création d'un tableau vide
let tableauArticles = [];

// Fonction permettant d'ajouter les articles dans le tableau vide
function creationObjets(articles) {

  for(let article of articles) {
    console.log(article);

    tableauArticles.push(new Meubles(article.colors, article._id, article.name, article.price, article.imageUrl, article.description, article.altTxt));
  }

  console.log(tableauArticles);
  newElt();
}

// Fonction d'affichage des éléments dans le HTML
function newElt() {
  
  const items = document.getElementById('items');

  for(let article of tableauArticles) {

    items.insertAdjacentHTML('afterbegin', `
    <a href="./product.html?id=${article._id}">
    <article>
    <img src="${article.imageUrl}" alt="${article.altTexte}">
    <h3 class="productName">${article.nom}</h3>
    <p class="productDescription">${article.description}</p>
    </article>
    </a>
    `);
  }
}
