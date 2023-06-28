
const heroes = JSON.parse(localStorage.getItem('heroes')) || [];

window.addEventListener('DOMContentLoaded', Generar);

function Generar() {
    const formulario= document.getElementById('fr');

    heroes.forEach((heroe) => {
        const ficha= document.createElement('fieldset');

        const nombre= document.createElement('label');
        const alias= document.createElement('label');
        const editorial= document.createElement('label');
        const fuerza= document.createElement('label');
        const arma= document.createElement('label');


        nombre.textContent = "nombre: " + heroe.nombre;
        alias.textContent = "Alias: " + heroe.alias;
        editorial.textContent ="Editorial: " + heroe.editorial;
        fuerza.textContent= "Fuerza:  " + heroe.fuerza;
        arma.textContent = "Arma: " + heroe.armas;



        ficha.appendChild(nombre);
        ficha.appendChild(alias);
        ficha.appendChild(fuerza);
        ficha.appendChild(arma);
        ficha.appendChild(editorial);

        formulario.appendChild(ficha);

    })
}