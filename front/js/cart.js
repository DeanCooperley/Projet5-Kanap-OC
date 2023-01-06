document.addEventListener('DOMContentLoaded', function() {
  // Récupère l'objet "cart" dans le "localStorage"
  let cart = localStorage.getItem('cart');

  // Convertit l'objet en tableau
  let cartArray = JSON.parse(cart);

  // Initialise la variable "cartArray" si la valeur de "cart" est null ou vide
  if (!cart || cart.length === 0) {
    cartArray = [];
  }

  let cartContainer = document.querySelector('#cart__items');
  let totalQuantity = document.querySelector('#totalQuantity');
  let totalPrice = document.querySelector('#totalPrice');

  // Tableau pour stocker les éléments uniques
  let uniqueItems = [];
  let totalQty = 0;
  let price = 0;

  // Parcours chaque élément du tableau
  for (let i = 0; i < cartArray.length; i++) {
    let item = cartArray[i];

    // Mise à jour du total des quantités affiché sur la page
    totalQuantity.textContent = totalQty;

    // Récupère les données du produit via une requête HTTP asynchrone (fetch)
    fetch(`http://localhost:3000/api/products/${item.id}`)
      .then(response => response.json())
      .then(data => {
        // Ajout de la quantité de l'article à la variable "totalQty"
        totalQty += item.qty;
        // Ajout du prix de l'article à la variable "price"
        price += item.qty * data.price;

        // Mise à jour du total des quantités et des prix affiché sur la page
        totalQuantity.textContent = totalQty;
        totalPrice.textContent = price;

        // Vérifie si l'élément existe déjà dans le tableau "uniqueItems"
        let exists = uniqueItems.find(uniqueItem => uniqueItem.id === item.id && uniqueItem.color === item.color);

        if (!exists) {
          // Si l'élément n'existe pas, on l'ajoute au tableau "uniqueItems"
          uniqueItems.push(item);

          // On crée un nouvel élément dans le panier
          let cartItem = document.createElement('article');
          cartItem.classList.add('cart__item');
          cartItem.setAttribute('data-id', item.id);
          cartItem.setAttribute('data-color', item.color);

          // On ajoute le contenu de l'élément au panier
          cartItem.innerHTML = `
            <div class="cart__item__img">
              <img src="${data.imageUrl}" alt="${data.altTxt}">
            </div>
            <div class="cart__item__content">
              <div class="cart__item__content__description">
                <h2>${data.name}</h2>
                <p>${item.color}</p>
                <p class="itemPrice">${item.qty * data.price} €</p>
              </div>
              <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                  <p>Qté : </p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.qty}">
                </div>
                <div class="cart__item__content__settings__delete">
                  <p class="deleteItem">Supprimer</p>
                </div>
              </div>
            </div>
          `;

          // On ajoute l'élément au panier
          cartContainer.appendChild(cartItem);

          let itemQuantities = document.querySelectorAll('.itemQuantity');

          for (let i = 0; i < itemQuantities.length; i++) {
            itemQuantities[i].addEventListener('change', function() {
              // Récupère l'ID et la couleur de l'article à modifier
              let cartItem = this.closest('.cart__item');
              let itemId = cartItem.getAttribute('data-id');
              let itemColor = cartItem.getAttribute('data-color');

              // Récupère l'objet de l'article à modifier dans le tableau "cartArray"
              let item = cartArray.find(item => item.id === itemId && item.color === itemColor);

              // Modifie la quantité de l'article
              item.qty = this.value;

              // Met à jour le "localStorage"
              localStorage.setItem('cart', JSON.stringify(cartArray));

              // Met à jour le total des quantités et des prix affiché sur la page
              totalQty = 0;
              price = 0;
              for (let i = 0; i < cartArray.length; i++) {
              let item = cartArray[i];
              totalQty += item.qty;
              price += item.qty * data.price;
            }
            totalQuantity.textContent = totalQty;
            totalPrice.textContent = price;
            });
          }


          // Écouteur d'événement sur le bouton "Supprimer"
          let deleteButton = cartItem.querySelector('.deleteItem');
          deleteButton.addEventListener('click', function() {
          // Récupère l'élément parent (l'article cart__item)
          let cartItem = this.closest('.cart__item');

          // Récupère l'ID et la couleur de l'article à supprimer
          let itemId = cartItem.getAttribute('data-id');
          let itemColor = cartItem.getAttribute('data-color');

          // Supprime l'objet de l'article du tableau "cartArray"
          cartArray = cartArray.filter(item => !(item.id === itemId && item.color === itemColor));

          // Met à jour le "localStorage"
          localStorage.setItem('cart', JSON.stringify(cartArray));

          // Supprime l'article du panier
          cartContainer.removeChild(cartItem);

          // Met à jour le total des quantités et des prix affiché sur la page
          totalQty = 0;
          price = 0;
          for (let i = 0; i < cartArray.length; i++) {
            let item = cartArray[i];
            totalQty += item.qty;
            price += item.qty * data.price;
          }
          totalQuantity.textContent = totalQty;
          totalPrice.textContent = price;
        });
      }
    });
  }
});
          
