// On récupère l'url de la page actuelle
let url = new URL(location.href); 

// On récupère l'id contenu dans l'url de la page actuelle
let idProduct = url.searchParams.get("orderId");

// On récupère l'élément html qui contient l'id du produit
const recupOrderId = document.getElementById("orderId");

// On affiche l'id du produit dans l'élément html
recupOrderId.innerHTML = `${idProduct}`;

// On vide le localStorage
localStorage.clear();

    
  