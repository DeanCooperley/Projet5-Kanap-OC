// 1. Variables globales

// Récupération des données du LS
let cart = JSON.parse(localStorage.getItem("cart"));
// console.log(cart)

// Création d'un tableau vide pour stocker les données des produits
let productTable = [];

// 2. Fonction de récupération des autres données du produit stockées dans l'API via l'id 

function recupData(idUrl) {
    // Récupération des données de l'API via l'id
    response = fetch('http://localhost:3000/api/products/' + idUrl)
    .then(data => {
        return data.json();
    })
    .catch(error => {
        error = `Une erreur s'est produite.`;
        alert(error);
    })
    // console.log(response)
    return response;
}

// 3. Fonction d'affichage des produits dans le panier

async function cartView() {
    // On vérifie que le panier existe et qu'il contient des produits
    if (cart === null || cart.length === 0) {
        // Si le panier est vide, on affiche ce message dans le DOM
        document.querySelector('h1').textContent = 'Votre panier est vide.';
        // Sinon on récupère les données du LS
    } else for (let i = 0; i < cart.length; i++) {
        let item = cart[i];
        // console.table(cart);

        // Récupération des données supplémentaires via l'API
        data = await recupData(item.id);
        // console.log(data);

        // Création des nouveaux éléments dans le DOM
        document.getElementById('cart__items').innerHTML += 
        `<article class="cart__item" data-id="${item.id}" data-color="${item.color}">
            <div class="cart__item__img">
                <img src="${data.imageUrl}" alt="${data.altTxt}">
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${data.name}</h2>
                    <p>${item.color}</p>
                    <p>${data.price}€</p>
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
        </article>`;

        // on push les infos dans productTable
        productTable.push(item.id);
        //console.log(productTable);

        // Mise à jour du LS
        dataLogging();
        // Fonction d'ajout des produits
        addItems();
        // Fonction de suppression des produits
        deleteProducts();
    }
}
cartView(); 

// 4. Fonction de mise à jour du LS 

function dataLogging() {
    localStorage.setItem('cart', JSON.stringify(cart))
}

// 5. Fonction de calcul du prix total et de la quantité totale

async function qtyPriceTotal() {
    let totalPrice = 0;
    let totalQty = 0;
    // On vérifie que le panier existe et qu'il contient des produits
    if (cart && cart.length) {
        for (let j = 0; j < cart.length; j++) {
            let dataLocalStorage = cart[j]; // On récupère les infos du LS
            const product = await recupData(dataLocalStorage.id); // On récupère les infos de l'API
            totalPrice += parseInt(dataLocalStorage.qty) * parseInt(product.price); // On calcule le prix total
            totalQty += parseInt(dataLocalStorage.qty); // On calcule la quantité totale
        }
    } 
    // On affiche la quantité et le prix total dans le DOM
    const addQty = document.getElementById('totalQuantity');
    addQty.innerHTML = totalQty;

    const addPrice = document.getElementById('totalPrice');
    addPrice.innerHTML = totalPrice;
}
qtyPriceTotal();

// 6. Fonction d'ajout de produits

function addItems() {
    let itemQty = document.querySelectorAll('.itemQuantity');
    // On boucle sur les inputs de quantité
    for (let i = 0; i < itemQty.length; i++) {
        // On écoute le changement de valeur
        itemQty[i].addEventListener('change', (event) => {
            event.preventDefault();
            // On récupère la nouvelle quantité
            let newItemQty = itemQty[i].value;
            let newTotalQty = document.getElementById('totalQuantity');
            // On crée un nouvel objet avec les nouvelles données
            const newObject = {
                id: cart[i].id,
                img: cart[i].img,
                name: cart[i].name,
                color: cart[i].color,
                qty: parseInt(newItemQty),
            };

        if (newItemQty < 1 || newItemQty > 100) {
            alert('Vous devez choisir une quantité comprise entre 1 et 100');
            return;
        }
        // On remplace l'ancien objet par le nouveau
        cart[i] = newObject;
        // On met à jour le LS
        dataLogging();
        // On met à jour le prix total et la quantité totale
        newTotalQty.innerHTML = qtyPriceTotal();
        });
    }
}

// 7. Fonction de suppression des produits 

// On crée un tableau vide pour stocker les produits à supprimer
function deleteProducts() {
    let deleteBtn = Array.from(document.querySelectorAll('.deleteItem'));
    
    let deleteTable = [];
    // On boucle sur le bouton de suppression
    deleteBtn.forEach((deleteBtn, index) => {
        deleteBtn.addEventListener("click", () => {
            // Supprime visuellement l'élément parent de deleteBtn
            deleteBtn.parentElement.style.display = "none";
            // On supprime le produit du tableau
            deleteTable = cart;
            // On supprime le produit du LS
            deleteTable.splice(index, 1);
            cart = dataLogging();
            // On recharge la page
            window.location.href = "cart.html";
        });
    });
}

/******** Formulaire ********/

// 1. Définition des champs de formulaire et des règles de validation (Regex)

const inputFields = [
    {id: "firstName", regex: /^[_a-zA-ZÀ-ÿ\s-]{2,80}$/, errorId: "firstNameErrorMsg"},
    {id: "lastName", regex: /^[_a-zA-ZÀ-ÿ\s-]{2,80}$/, errorId: "lastNameErrorMsg"},
    {id: "address", regex: /^[0-9a-zA-ZÀ-ÿ\s,-]{2,150}$/, errorId: "addressErrorMsg"},
    {id: "city", regex: /^[_a-zA-ZÀ-ÿ\s-]{2,80}$/, errorId: "cityErrorMsg"},
    {id: "email", regex: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+.[a-zA-Z]{2,4}$/, errorId: "emailErrorMsg"}
];

// 2. Fonction de validation du formulaire

function validationForm() {
    let valid = true;
    for (const field of inputFields) {
        // Récupération des éléments du DOM
        const input = document.getElementById(field.id);
        // On récupère l'élément qui contient le message d'erreur
        const error = document.querySelector(`#${field.errorId}`);
        // Si le champ n'est pas valide, on affiche un message d'erreur
        if (!field.regex.test(input.value) || input.value === null) {
            error.innerHTML = "Merci de renseigner un champ valide";
            valid = false;
        // Sinon, on efface le message d'erreur
        } else {
            error.innerHTML = "";
        }
    }
    // Si le formulaire est valide, on envoie les données au serveur
    return valid;
}

// 3. Récupération du bouton "commander" et des champs de formulaire

const orderBtn = document.querySelector("#order");
const inputFirstName = document.querySelector("#firstName");
const inputLastName = document.querySelector("#lastName");
const inputAddress = document.querySelector("#address");
const inputCity = document.querySelector("#city");
const inputEmail = document.querySelector("#email");

orderBtn.addEventListener("click", function(e) {
    e.preventDefault();
    // Si le formulaire est valide, on envoie les données au serveur
    if (validationForm()) {
        let dataInLocalStorage = JSON.parse(localStorage.getItem("cart"));
        // console.log(dataInLocalStorage);
        // Si le panier est vide, on affiche un message d'erreur
        if (dataInLocalStorage === null || Object.keys(dataInLocalStorage).length === 0) {
            alert("Le panier est vide.")
            return;
        }
        // On crée un tableau avec les id des produits
        let idProducts = [];
        for (let productId in dataInLocalStorage) {
            idProducts.push(dataInLocalStorage[productId].id);
        }
        // On crée un objet avec les données du formulaire
        const order = {
            contact: {
                firstName: inputFirstName.value,
                lastName: inputLastName.value,
                address: inputAddress.value,
                city: inputCity.value,
                email: inputEmail.value
            },
            products: idProducts
        };
        // On envoie les données au serveur
        const dataFetch = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(order)
        };
        // On récupère l'id de la commande et on redirige vers la page de confirmation
        fetch("http://localhost:3000/api/products/order", dataFetch)
        .then((response) => response.json())
            .then((data) => {
                document.location.href = `confirmation.html?orderId=${data.orderId}`;
        })
        .catch((err) => {
            console.log("Erreur d'envoi des données", err);
        });
    }
    validationForm();
});