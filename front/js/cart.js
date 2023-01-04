document.addEventListener('DOMContentLoaded', function() {
  displayCart();
});

async function displayCart() {
  // initialisation de la somme totale à 0
  let total = 0;
  // initialisation du nombre d'articles à 0
  let numItems = 0;

  // récupération du panier (array) depuis le localStorage
  let cart = JSON.parse(localStorage.getItem('cart'));

  // vérification que le panier existe et n'est pas vide
  if (cart && cart.length > 0) {
    // parcours de l'array du panier
    for (let i = 0; i < cart.length; i++) {
      // récupération de l'item courant
      let item = cart[i];

      // récupération des informations sur le produit à l'aide d'une requête HTTP à l'API
      const response = await fetch(`http://localhost:3000/api/products/${item.id}`);
      const product = await response.json();

      // ajout du prix de l'item courant à la somme totale
      total += product.price * item.qty;
      // ajout de la quantité de l'item courant au nombre d'articles
      numItems += item.qty;

      // création d'un élément HTML pour l'item courant
      let itemElement = document.createElement('article');
      itemElement.classList.add('cart__item');
      itemElement.innerHTML = `
        <div class="cart__item__img">
          <img src="${product.imageUrl}" alt="${product.name}">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>${product.name}</h2>
            <p>${item.color}</p>
            <p>${product.price * item.qty} €</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté : </p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.qty}">
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem" data-id="${product.id}">Supprimer</p>
            </div>
          </div>
        </div>
      `;

      // insertion de l'élément HTML dans la page
      document.querySelector('#cart__items').appendChild(itemElement);
    }

    // mise à jour de l'élément HTML pour afficher le total
    document.getElementById('totalQuantity').innerHTML = numItems;
    document.getElementById('totalPrice').innerHTML = total;
  }
}

// ajout d'un EventListener de type 'change' sur tous les éléments HTML de classe 'itemQuantity'
document.querySelectorAll('.itemQuantity').forEach(function(input) {
  input.addEventListener('change', function() {
    // récupération de la quantité
    let qty = input.value;

    // récupération de l'article parent
    let item = input.parentElement.parentElement.parentElement.parentElement;

    // récupération du prix de l'article
    let price = item.querySelector('.cart__item__content__description > p:last-child').textContent;

    // mise à jour du prix total de l'article
    item.querySelector('.cart__item__content__description > p:last-child').textContent = qty * price + " €";

    // récupération des éléments HTML correspondant au nombre d'articles et au prix total
    let totalQuantityElement = document.getElementById('totalQuantity');
    let totalPriceElement = document.getElementById('totalPrice');

    // récupération des valeurs actuelles de ces éléments
    let totalQuantity = parseInt(totalQuantityElement.textContent);
    let totalPrice = parseInt(totalPriceElement.textContent);

    // mise à jour de ces valeurs
    totalQuantity += qty - oldQty;
    totalPrice += qty * price - oldQty * oldPrice;

    // mise à jour des éléments HTML
    totalQuantityElement.innerHTML = totalQuantity;
    totalPriceElement.innerHTML = totalPrice + " €";
  });
});

