/* Récupération de l'id du produit à l'aide de l'url */
const recupUrl = window.location.href;
const url = new URL(recupUrl);
const idUrl = url.searchParams.get("id");
console.log(idUrl);

/** Récupération du produit via son id avec fetch **/
fetch("http://localhost:3000/api/products/" + idUrl)
  .then(function (response) {
    if (response.ok) {
      return response.json();
    }
  })
  .then(function (articleUnique) {
    if (articleUnique) { // Si l'article contient des données
      console.log(articleUnique);
      display(articleUnique);
    } else { // Si l'article ne contient pas de données
      console.error("Cet article n'est pas disponible.");
    }
  })
  .catch(function (error) {
    console.log(error);
  })

/*** Fonction d'affichage des informations du produit ***/
function display(articleUnique) {

  //Création de l'élément img et intégration de l'image du canapé
  const imageProduct = document.createElement("img");
  document.querySelector(".item__img").appendChild(imageProduct);
  imageProduct.src = articleUnique.imageUrl;
  imageProduct.alt = articleUnique.altTxt;

  //Intégration du titre du produit
  const title = document.getElementById('title');
  title.textContent = articleUnique.name;

  //Intégration du prix
  const price = document.getElementById('price');
  price.textContent = articleUnique.price;

  //Intégration de la description
  const description = document.getElementById('description');
  description.textContent = articleUnique.description;

  //Création de l'élément option et intégration des valeurs du tableau colors
  const colors = document.getElementById("colors");
  for (let i = 0; i < articleUnique.colors.length; i++) {
    let color = document.createElement("option");
    color.setAttribute("value", articleUnique.colors[i]);
    color.textContent = articleUnique.colors[i];
    colors.appendChild(color);
  }
}

//**** Sélection du bouton d'ajout au panier, création du local storage, du panier et enregistrement des articles ****/
const btnCart = document.querySelector("#addToCart");
btnCart.addEventListener("click", storeData);

function storeData() {
  const targetColor = document.querySelector("#colors");
  const targetQty = document.querySelector("#quantity");

  //Si ce n'est pas un entier ou si sa valeur est inférieure à 1 ou supérieure à 100, 
  //un message d'erreur s'affiche et stop la fonction
  if (!/^\d+$/.test(targetQty.value) || targetQty.value < 1 || targetQty.value > 100) {
    alert("La quantité doit être un nombre entier compris entre 1 et 100.");
    return;
  }

  // Vérifie que la quantité et la couleur sont sélectionnées et que la valeur de la couleur n'est pas vide avant de créer l'objet "item"
  if (targetColor && targetQty && targetQty.value > 0 && targetColor.value !== "") {
    let item = {
      id: idUrl,
      color: targetColor.value,
      qty: targetQty.value
    }

    addToCart(item);
} else {
  alert("Vous devez indiquer une couleur.");
}
}

//Sauvegarder le panier dans le local storage
function saveInLocalStorage(cart) { 
  localStorage.setItem("cart", JSON.stringify(cart));
}

//Récupérer les articles du local storage
function getCart() {
  let cart = localStorage.getItem("cart");
  if (cart == null) {
    return [];
  } else {
    return JSON.parse(cart);
  }
}

// Ajoute un article au panier
function addToCart(item) {
  let cart = getCart();
  let itemExists = false;

  // Convertit la valeur de item.qty en entier
  item.qty = parseInt(item.qty);

  // Vérifie si l'article existe déjà dans le panier
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === item.id && cart[i].color === item.color) {
      // Incrémente la quantité de l'article existant
      cart[i].qty += item.qty;
      itemExists = true;
      break;
    }
  }

  // Ajoute l'article au panier s'il n'existe pas déjà
  if (!itemExists) {
    cart.push(item);
  }

  // Enregistre le panier dans le local storage
  saveInLocalStorage(cart);
}

//Modifier la quantité des articles dans le panier
function changeQty(item, newQty) {
  let cart = getCart();
  const existingItem = cart.find((i) => i.id === item.id && i.color === item.color);
  if (existingItem != undefined) {
    existingItem.qty = newQty;
  } else {
    item.qty = newQty;
    cart.push(item);
  }
  saveInLocalStorage(cart);
}

//Enlever un article
function removeFromCart(item) {
  let cart = getCart();
  cart = cart.filter(i => i.id !== item.id || i.color !== item.color);
  saveInLocalStorage(cart);
}