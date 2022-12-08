// let urlParams = new URLSearchParams (document.location.search);
// let dataId = urlParams.get("id");
// console.log(dataId);

// fetch(urlParams + dataId)
//     .then((response) => response.json)

//     .then((article) => {
        
//     })

/* Récupération de l'id du produit à l'aide de l'url */

const recupUrl = window.location.href;
const url = new URL(recupUrl);
const idUrl = url.searchParams.get("id");
console.log(idUrl);

/** Récupération du produit via son id (fetch) **/
fetch(`http://localhost:3000/api/products/` + idUrl)
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
    
    const imageProduct = document.createElement("img"); // Création d'une balise img 
    document.querySelector(".item__img").appendChild(imageProduct);
    imageProduct.src = articleUnique.imageUrl;
    imageProduct.alt = articleUnique.altTxt;

    const title = document.getElementById('title');
    title.insertAdjacentHTML('afterbegin', articleUnique.name);

    const price = document.getElementById('price');
    price.insertAdjacentHTML('afterbegin', articleUnique.price);

    const description = document.getElementById('description');
    description.insertAdjacentHTML('afterbegin', articleUnique.description);
      
}



