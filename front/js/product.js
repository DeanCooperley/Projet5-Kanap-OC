const queryString = window.location.href;
console.log (queryString);

const urlParams = new URLSearchParams (queryString);//utiliser les méthodes 'get'

console.log('Chemin du fichier : ' + document.documentURI);