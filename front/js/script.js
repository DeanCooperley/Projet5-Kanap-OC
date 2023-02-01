/* Récupération des données de l'Api */
fetch(`http://localhost:3000/api/products`)
  .then(function(response) {
    if(response.ok) {
      return response.json();
    }
  })
  .then(function(articles) {
    // console.log(articles);
    creationObjets(articles);
  })
  .catch(function(error) {
    console.log(error);
  })

// Création de la classe "Meubles" afin de s'exercer à créer une classe (Facultatif)
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

/** Création d'un tableau vide **/
let arrayItems = [];

/*** Fonction permettant d'ajouter les articles dans le tableau vide à l'aide d'une boucle for... of ***/
function creationObjets(articles) {

  for(let article of articles) {
    // console.log(article);

    arrayItems.push(new Meubles(article.colors, article._id, article.name, article.price, article.imageUrl, article.description, article.altTxt));
  }

  console.log(arrayItems);
  newElt();
}

/**** Fonction : création des éléments du DOM et affichage des éléments sur la page d'accueil ****/
function newElt() {
  
  const items = document.getElementById('items'); //Permet d'accéder à l'élément HTML dont l'id est "items"

  const urlIndex = encodeURI(window.location.href); //Encodage de l'url
  let urlProduct = ''; //Déclaration de la variable urlProduct

  // TODO : Vérifier à la mise en ligne si c'est toujours valable
  // Vérifie si l'url contient "index.html" et remplace par "product.html" si c'est le cas
  if(urlIndex.includes('index.html')) {
    urlProduct = urlIndex.replace('html/index.html', 'html/product.html/');
  }
  else {
    // Vérifie si l'url contient "html" et remplace par "product.html" si c'est le cas
    urlProduct = urlIndex.replace('html', 'html/product.html');
  }
  
  // On supprime le dernier caractère de l'url car celle-ci est incorrecte par défaut (caractère "/" en trop)
  const urlWithoutSlash = urlProduct.substring(0, urlProduct.length -1);
  // console.log('urlProduct =' + urlWithoutSlash);
  // Permet de créer un nouvel objet URL à partir de l'url sans le dernier caractère
  const newUrl = new URL(urlWithoutSlash); 
  console.log(newUrl);

  for (let article of arrayItems) {

    newUrl.searchParams.set('id', article.id);

    //Ajoute les éléments dans le DOM avant le premier enfant de l'élément "items"  
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








