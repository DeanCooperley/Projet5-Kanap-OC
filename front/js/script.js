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

// Création de la classe "meubles"
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

}

// Fonction permettant d'injecter les articles dans le code HTML


