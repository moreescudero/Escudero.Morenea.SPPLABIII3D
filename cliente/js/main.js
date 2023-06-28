import { Armas } from './armas.js';
import { Editoriales } from './editoriales.js';
import { Superheroe } from './superheroe.js';
import { CrearTabla } from './tabla.js';
import { ModificarTabla } from './tabla.js';
const URL= "http://localhost:3000/Heroes";

const fr = document.getElementById('fr');
const tabla = document.getElementById('tTabla');
const principal = document.getElementById('principal');
principal.addEventListener('click', (e) =>
{
    e.preventDefault();
    window.location.href = "../html/principal.html";
});

let id = 0;
let bandera = false;

let array = [];
localStorage.setItem('heroes',JSON.stringify(array));


window.addEventListener('DOMContentLoaded', () => 
{
    GetHeroes(URL);
    Armas.forEach((x) => 
    {
        const opcion = document.createElement('option');
        opcion.value = x;
        opcion.text= x;
        fr.armas.appendChild(opcion);
    });

    const selector = document.getElementById('sfiltrarEditorial');
    selector.addEventListener('change', filtrar);
    Editoriales.forEach((x) => 
    {
        const opcion = document.createElement('option');
        opcion.value = x;
        opcion.text= x;
        selector.appendChild(opcion);
    });
    
    fr.guardar.addEventListener('click', manejarEventos);
    fr.cancelar.addEventListener('click', Limpiar);
});

window.addEventListener('click', (x) =>
{
    if(x.target.matches('td'))
    {
        fr.guardar.value = "Modificar";
        const indice = x.target.parentElement.dataset.id;
        const seleccionado = array.find((x) => x.id == indice);
        console.log(seleccionado);
        id = indice;
        actualizar(seleccionado);
        bandera = true;
    }
});

function filtrar()
{
    let elementos = [];
    const selector = document.getElementById('sfiltrarEditorial');

    elementos = array.filter((x) => 
    {
        if(selector.value == "Todas" || x.editorial == selector.value)
        {
            return true;
        }
    });
    MapeadoPromedio(elementos);
    ModificarTabla(tabla,elementos);
}

function actualizar(seleccionado)
{
    fr.nombre.value = seleccionado.nombre;
    fr.alias.value = seleccionado.alias;
    fr.fuerza.value = seleccionado.fuerza;

    for(const key in Armas)
    {
        if(Armas[key]== seleccionado.armas)
        {
          fr.armas.selectedIndex= key;
        }
    }
    const dc = document.getElementById('dc');
    const marvel = document.getElementById('marvel');

    if(seleccionado.transaccion == "dc")
    {
        dc.checked = true;
    }
    else
    {
        marvel.checked = true;
    }
}

function manejarEventos(accion)
{
    accion.preventDefault(); 
    if(!bandera)
    {
        guardar();
    }
    else
    {
        modificar();
    }
}

function guardar()
{
    const id = generarId();
    const nombre = document.getElementById('nombre').value;
    const alias = document.getElementById('alias').value;
    const editorial = document.getElementsByName('editorial');
    const fuerza = document.getElementById('fuerza').value;
    const arma = document.getElementById('armas').options[document.getElementById('armas').selectedIndex].text;

    let elemento;

    editorial.forEach((x) => 
    {
        if(x.checked)
        {
            elemento = x.value;
        }
    });

    const heroe = new Superheroe(id, nombre, alias, elemento, fuerza, arma);
    console.log(heroe);

    const xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange",()=>{
      if(xhr.readyState == 4){
        if(xhr.status >= 200 && xhr.status< 300){
           array= JSON.parse(xhr.responseText);
           ModificarTabla(seccionTabla, array); 
        }else{
          console.error("Error: " + xhr.status + "-" + xhr.statusText);
        }
  
        loader.classList.add("oculto");
      }
  
    });
    xhr.open("POST", URL)
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  
    xhr.send(JSON.stringify(heroe));
  
    Limpiar();
}

function modificar()
{
    const heroe = array.find((x) => 
    {
        if(x.id == id)
        {
            x.nombre = document.getElementById('nombre').value;
            x.alias = document.getElementById('alias').value;
            const editorial = document.getElementsByName('editorial');
            x.fuerza = document.getElementById('fuerza').value;
            x.armas = document.getElementById('armas').options[document.getElementById('armas').selectedIndex].text;

            let elemento;

            editorial.forEach((x) => 
            {
                if(x.checked)
                {
                    elemento = x.value;
                }
            });

            x.editorial = elemento;
            return x;
        }
    });
    
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange",()=>{
      if(xhr.readyState == 4){
      }
    });
    xhr.open("PUT", URL + "/" + heroe.id)
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  
    xhr.send(JSON.stringify(heroe));
  
    ModificarTabla(tabla,array);
    Limpiar();
}

function Limpiar()
{
    localStorage.setItem('heroes',JSON.stringify(array));
    fr.nombre.value = "";
    fr.fuerza.value = 50;
    fr.alias.value = "";
    fr.armas.selectedIndex = 0;
    bandera = false;
    id = 0;
    fr.guardar.value = "Guardar";
}

function generarId()
{
    let id;
    for(var i = 0; i < array.length; i++)
    {
        if(i == (array.length - 1))
        {
            id = array[i].id;
        }
    }
    return id + 1;
}

function MapeadoPromedio(elemento){
    let fuerza = [];
    
    fuerza = elemento.map(e=> parseInt(e.fuerza));
    
    var fuerzaTotal = fuerza.reduce(function(total, fuerza) {
      return parseInt(total + fuerza);
    }, 0)
    console.log(fuerza);
    const txt= document.getElementById("tpromedioFuerza");

    const promedio = fuerzaTotal / elemento.length;
    txt.value= promedio;
  }

async function GetHeroes (url) {
    //loader.classList.remove("oculto");
    try {
        let rta= await fetch(url);
        if(!rta.ok) throw Error("Error: " + rta.status + "-" + rta.statusText);
        array= await rta.json();
        console.log(array);
        tabla.appendChild(CrearTabla(array));
        MapeadoPromedio(array);
    } catch (err) {
        console.error(err.message);
    }finally {
       // loader.classList.add("oculto");
    }
  }

const checkboxes = document.querySelectorAll('#contenedor input[type="checkbox"]');
checkboxes.forEach(e=> {e.addEventListener('change', filtrarAtributos) });

function filtrarAtributos() {
  const checkboxes = document.querySelectorAll('#contenedor input[type="checkbox"]');
  let atributosSeleccionados = Array.from(checkboxes)
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.name);
    if (!atributosSeleccionados.includes('id')) {
      let array=[];
      atributosSeleccionados.forEach(e =>{ array.push(e);});
      atributosSeleccionados = array;
    }

  const resultado = array.map(obj => {
    const nuevoObjeto = {};
    atributosSeleccionados.forEach(atributo => {
      nuevoObjeto[atributo] = obj[atributo];
    });
    return nuevoObjeto;
  });
  ModificarTabla(tabla, resultado);
}



