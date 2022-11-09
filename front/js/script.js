/* Récupération des données de l'Api */

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
    console.log(error);
  })

/** Création de la classe "Meubles" (Facultatif) **/

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

/*** Création d'un tableau vide (Facultatif) ***/

let tableauArticles = [];

/**** Fonction permettant d'ajouter les articles dans le tableau vide à l'aide d'une boucle for... of (Facultatif) ****/

function creationObjets(articles) {

  for(let article of articles) {
    console.log(article);

    tableauArticles.push(new Meubles(article.colors, article._id, article.name, article.price, article.imageUrl, article.description, article.altTxt));
  }

  console.log(tableauArticles);
  newElt();
}

/***** Fonction d'affichage des éléments dans le HTML *****/

function newElt() {
  
  const items = document.getElementById('items'); //Permet d'accéder à l'élément HTML dont l'id est "items"

  const urlIndex = encodeURI(window.location.href); //Encodage de l'url
  const urlProduct = urlIndex.replace('html', 'html/product.html'); //dynamique
  const urlWithoutSlash = urlProduct.substring(0, urlProduct.length -1);//Pour enlever le '/'

  console.log('urlProduct =' + urlWithoutSlash);

  const newUrl = new URL(urlWithoutSlash); //pour pouvoir utiliser les méthodes (objet url)

  console.log(newUrl);

  for(let article of tableauArticles) {

    newUrl.searchParams.set('id', article.id);

  //Analyse et ajoute les éléments comme du HTML tout en évitant la sérialisation (traduire un objet ou autre dans un format approprié)  
    items.insertAdjacentHTML('afterbegin', ` 
    <a href="${newUrl.href}">
    <article>
    <img src="${article.imageUrl}" alt="${article.altTexte}">
    <h3 class="productName">${article.nom}</h3>
    <p class="productDescription">${article.description}</p>
    </article>
    </a>
    `);

  }
}








