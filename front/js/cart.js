const dataInLocalStorage = JSON.parse(localStorage.getItem("cart"));

/* Fonction pour accéder aux données de l'API */
async function accessData() {
	if (dataInLocalStorage !== null) {
		// On récupère les données de l'API
		return await Promise.all(dataInLocalStorage.map(async (item) => {
			const product = await fetch("http://localhost:3000/api/products/" + item.id).then(res => res.json());
			// On renvoie les données dans un tableau
			return {
				id: item.id,
				name: product.name,
				price: product.price,
				color: item.color,
				quantity: item.qty,
				alt: product.altTxt,
				img: product.imageUrl
			}
	}))
		.catch(function (err) {
			console.log(err);
		});
	}
	return [];
};  

/** Fonction affichage du panier **/
async function cartView() {
	const responseFetch = await accessData();
	// Si le panier n'est pas vide, on affiche les produits
  	if (dataInLocalStorage !== null && dataInLocalStorage.length !== 0) {
		// On récupère l'ID du panier
		const idCartItems = document.querySelector("#cart__items");
		// .map() pour transformer chaque élément du tableau en string
		const productsElements = responseFetch.map((product) => `
			<article class="cart__item" data-id="${product.id}" data-color="${product.color}">
				<div class="cart__item__img">
					<img src= "${product.img}" alt="${product.altTxt}">
				</div>
				<div class="cart__item__content">
					<div class="cart__item__content__description">
						<h2>${product.name}</h2>
						<p>${product.color}</p>
						<p>${product.price} €</p>
					</div>
					<div class="cart__item__content__settings
						<div class="cart__item__content__settings__quantity">
						<p>Qté : </p>
						<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
					</div>
					<div class="cart__item__content__settings__delete">
						<p class="deleteItem">Supprimer</p>
					</div>
				</div>
			</div>
		</article>
	`).join(''); // On transforme le tableau en string
	// On affiche les produits dans le panier
	idCartItems.innerHTML = productsElements;
	} else {
		return emptyCart();
	}
};

/*** Fonctions des modifications et suppression des produits du panier ***/
// Fonction de la modification de la quantité d'un produit
async function modifyQty() {
	await accessData(); //on attend que le fetch soit terminé
	// On récupère les inputs de la quantité
	const qtyCart = document.querySelectorAll(".itemQuantity");
	// On écoute le changement de valeur
	for (let input of qtyCart) {
		input.addEventListener("change", function () {
    		// Ecoute du changement de qty
    		if (this.value > 0 && this.value <= 100) {
        		// On récupère l'ID de la donnée modifiée
        		let idModif = this.closest(".cart__item").dataset.id;
        		// On récupère la couleur de la donnée modifiée
        		let colorModif = this.closest(".cart__item").dataset.color;
        		// On filtre le Ls avec l'iD du produit modifié
        		let findId = dataInLocalStorage.filter((e) => e.id === idModif);
        		// Puis on cherche le produit même id par sa couleur 
        		let findColor = findId.find((e) => e.color === colorModif);
				// Si la couleur et l'id sont trouvés, on modifie la quantité en fonction
				findColor.qty = this.value;
				// On Push le panier dans le local Storage
				localStorage.setItem("cart", JSON.stringify(dataInLocalStorage));
				calculTotalQty();
				calculTotalPrice();
    	} else {
        	alert("Vous devez indiquer une quantité comprise entre 1 et 100");
    	}
		});
	}
};

// Suppression d'un produit du panier
async function removeItem() {
	await accessData();
	// On récupère le bouton de suppression
	const deleteItems = document.querySelectorAll(".deleteItem");
	//On écoute le clic sur le bouton
	for (let i = 0; i < deleteItems.length; i++) {
	  deleteItems[i].addEventListener("click", function (event) {
		// On récupère l'ID du produit à supprimer
		let dataInLocalStorage = JSON.parse(localStorage.getItem("cart"));
		// On récupère l'ID du produit à supprimer
		const idDelete = event.target.closest("article").getAttribute("data-id");
		// On récupère la couleur du produit à supprimer
		const colorDelete = event.target.closest("article").getAttribute("data-color");
		// On filtre le local storage avec l'iD du produit à supprimer
		dataInLocalStorage = dataInLocalStorage.filter((item) => item.id !== idDelete || item.color !== colorDelete);
		// On Push le panier dans le local Storage
		localStorage.setItem("cart", JSON.stringify(dataInLocalStorage));
		// On supprime le produit du DOM
		event.target.closest("article").remove();
		
		alert("Vous venez de supprimer un article");
		// On met à jour le nombre de produits dans le panier
		if (JSON.parse(localStorage.getItem("cart")).length === 0) {
		  localStorage.clear();       
		  return emptyCart();
		}
	  });
	}
  }
removeItem();

/**** Fonctions ajout de la quantité et du prix total ****/

// Fonction calcul de la quantité totale
function calculTotalQty() {
    const zoneTotalQuantity = document.querySelector("#totalQuantity");
    if (dataInLocalStorage === null || dataInLocalStorage.length === 0) {
        emptyCart();
    } else {
        const totalQty = dataInLocalStorage.reduce((acc, {qty}) => acc + parseInt(qty), 0);
        zoneTotalQuantity.textContent = totalQty;
    }
}

// Fonction calcul du prix total
async function calculTotalPrice() {
    const responseFetch = await accessData();
    const idTotalPrice = document.querySelector("#totalPrice");

    const totalPrice = responseFetch.reduce((acc, {quantity, price}) => acc + (parseInt(quantity) * parseInt(price)), 0);
    idTotalPrice.textContent = totalPrice;

    localStorage.setItem("cart", JSON.stringify(dataInLocalStorage));
};

modifyQty();
removeItem();

//On Push le panier dans le local Storage
localStorage.setItem("cart", JSON.stringify(dataInLocalStorage));

/***** Appel des fonctions *****/
callFunctions();

async function callFunctions() {
cartView();         
removeItem();		  
modifyQty();	  

calculTotalQty();	  
calculTotalPrice();
};

/****** Fonction affichage du message panier vide ******/
function emptyCart() {
	const cartTitle = document.querySelector(
		"#limitedWidthBlock div.cartAndFormContainer > h1"
	);
	
	const emptyCartMessage = "Le panier est vide.";
	cartTitle.textContent = emptyCartMessage;
	
	document.querySelector(".cart__order").style.display = "none"; 
	document.querySelector(".cart__price").style.display = "none";
};

/******* Formulaire *******/

// Définition des champs de formulaire et des règles de validation
const inputFields = [
    {id: "firstName", regex: /^[_a-zA-ZÀ-ÿ\s-]{2,80}$/, errorId: "firstNameErrorMsg"},
    {id: "lastName", regex: /^[_a-zA-ZÀ-ÿ\s-]{2,80}$/, errorId: "lastNameErrorMsg"},
    {id: "address", regex: /^[0-9a-zA-ZÀ-ÿ\s,-]{2,150}$/, errorId: "addressErrorMsg"},
    {id: "city", regex: /^[_a-zA-ZÀ-ÿ\s-]{2,80}$/, errorId: "cityErrorMsg"},
    {id: "email", regex: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/, errorId: "emailErrorMsg"}
];

// Fonction de validation du formulaire
function validationForm() {
    let valid = true;
    for (const field of inputFields) {
        const input = document.getElementById(field.id);
        const error = document.querySelector(`#${field.errorId}`);
        if (!field.regex.test(input.value) || input.value === null) {
            error.innerHTML = "Merci de renseigner un champ valide";
            valid = false;
        } else {
            error.innerHTML = "";
        }
    }
    return valid;
}

// Récupération des inputs du formulaire et du bouton commander
const inputFirstName = document.querySelector("#firstName");
const inputLastName = document.querySelector("#lastName");
const inputAddress = document.querySelector("#address");
const inputCity = document.querySelector("#city");
const inputEmail = document.querySelector("#email");
const orderButton = document.querySelector("#order");

// Fonction au clic sur le bouton commander
orderButton.addEventListener("click", function(e) {
    e.preventDefault();
    if (validationForm()) {
        // Récupération des produits dans le localStorage
        let dataInLocalStorage = JSON.parse(localStorage.getItem("products"));

        // Création d'un tableau avec seulement les id des produits
        let idProducts = [];
        for (let canapId in dataInLocalStorage) { // On utilise une boucle for in pour parcourir un objet
            idProducts.push(canapId.id);
        }
        
        // Création de l'objet order pour l'envoi au serveur
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

        // variable dataFetch permettant d'envoyer les données au serveur
        const dataFetch = {
            method: "POST",
            headers: {
                "Content-type": "application/json", // Indique le type de données envoyées
            },
            body: JSON.stringify(order)
        };
        
        // Envoi de la commande via fetch et récupération de l'orderId
        fetch("http://localhost:3000/api/products/order", dataFetch)
        .then((response) => response.json())
            .then((data) => {
                // console.log(data);
                document.location.href = `confirmation.html?orderId=${data.orderId}`;
        }) 
        .catch((err) => {
            console.log("Erreur de récupération des données du produit", err);
            alert ("Un problème a été rencontré lors de l'envoi du formulaire.");
        });
    }
    validationForm();
});

