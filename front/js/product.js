// let urlParams = new URLSearchParams (document.location.search);
// let dataId = urlParams.get("id");
// console.log(dataId);

/* Récupération de l'id du produit à l'aide de l'url */
const recupUrl = window.location.href;
const url = new URL(recupUrl);
const idUrl = url.searchParams.get("id");
console.log(idUrl);

/** Récupération du produit via son id (fetch) **/
fetch("http://localhost:3000/api/products/" + idUrl)
  .then(function(response) {
    if(response.ok) {
      return response.json();
    }
  })
  .then(function(articleUnique) {
    console.log(articleUnique);
    affichage(articleUnique);
  })
  .catch(function(error) {
    console.log(error);
  })

/*** Fonction d'affichage des informations du produit ***/
function affichage(articleUnique){
    
  //Création de l'élément img et intégration de l'image du canapé
    const imageProduct = document.createElement("img");  
    document.querySelector(".item__img").appendChild(imageProduct);
    imageProduct.src = articleUnique.imageUrl;
    imageProduct.alt = articleUnique.altTxt;
    
  //Intégration du titre du produit
    const title = document.getElementById('title');
    title.insertAdjacentHTML('afterbegin', articleUnique.name);
    
  //Intégration du prix
    const price = document.getElementById('price');
    price.insertAdjacentHTML('afterbegin', articleUnique.price);
    
  //Intégration de la description de l'article
    const description = document.getElementById('description');
    description.insertAdjacentHTML('afterbegin', articleUnique.description);
    
  //Création de l'élément option et intégration des valeurs du tableau colors
  const colors = document.getElementById("colors");
  for (let i=0; i < articleUnique.colors.length; i++) {
    let color = document.createElement("option");
    color.setAttribute("value", articleUnique.colors[i]);
    color.innerHTML = articleUnique.colors[i];
    colors.appendChild(color);
  }
}



