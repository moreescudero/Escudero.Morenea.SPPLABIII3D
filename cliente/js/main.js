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
        fr.borrar.addEventListener('click', () =>
        {
            borrar(seleccionado);
        });
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
    MapMaximaFuerza(elementos);
    MapMinimaFuerza(elementos);
    ModificarTabla(tabla,elementos);
}

function borrar(borrarHeroe){
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange",()=>{
      if(xhr.readyState == 4){
        if(xhr.status >= 200 && xhr.status< 300){
           listaHeroes= JSON.parse(xhr.responseText);
        }else{
          console.error("Error: " + xhr.status + "-" + xhr.statusText);
        }
        spinner.classList.add("oculto");
      }
    });
    xhr.open("DELETE", URL + "/" + borrarHeroe.id);
    xhr.send();
    
    fr.borrar.disabled = true;
    fr.guardar.value="Guardar";
    fr.borrar.disabled=true;
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

    if(seleccionado.editorial == "dc") {
        dc.checked = true;
    }
    else {
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
    const editorial = document.getElementsByName('rEditorial');
    const fuerza = document.getElementById('fuerza').value;
    const armas = document.getElementById('armas').options[document.getElementById('armas').selectedIndex].text;

    let elemento;

    editorial.forEach((x) => 
    {
        if(x.checked)
        {
            elemento = x.value;
        }
    });

    if(nombre != "" && alias != "" && elemento != "" && fuerza != undefined && armas != "")
    {
        const heroe = new Superheroe(id, nombre, alias, elemento, fuerza, armas);
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
    }
    else
    {
        alert("Error: Falta un dato ;(");
    }
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
            const editorial = document.getElementsByName('rEditorial');
            x.fuerza = document.getElementById('fuerza').value;
            x.armas = document.getElementById('armas').options[document.getElementById('armas').selectedIndex].text;

            let elemento;

            editorial.forEach((e) => 
            {
                if(e.checked)
                {
                    elemento = e.value;
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

function Limpiar(){
    fr.nombre.value = "";
    fr.fuerza.value = 50;
    fr.alias.value = "";
    fr.armas.selectedIndex = 0;
    bandera = false;
    id = 0;
    fr.guardar.value = "Guardar";
}

function generarId(){
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
    const txt= document.getElementById("tpromedioFuerza");

    const promedio = fuerzaTotal / elemento.length;
    txt.value= promedio;
}


function MapMaximaFuerza(elemento){
    let fuerza = [];
    
    fuerza = elemento.map(e=> parseInt(e.fuerza));
    
    var fuerzaMax = fuerza.reduce(function(fuerzaAnterior, fuerza) {
        if(fuerzaAnterior > fuerza){
            return fuerzaAnterior;
        }
        else{
            return fuerza;
        }
    }, 0)
    const txt= document.getElementById("tmaximaFuerza");
    txt.value= fuerzaMax;
}

function MapMinimaFuerza(elemento){
    let fuerza = [];
    
    fuerza = elemento.map(e=> parseInt(e.fuerza));
    var bandera = false;

    var fuerzaMinima = fuerza.reduce(function(fuerzaAnterior, fuerza) {
        if(fuerzaAnterior > fuerza || !bandera) {
            bandera = true; 
            return fuerza;
        }
        else {
            return fuerzaAnterior;
        }
    }, 0)
    const txt= document.getElementById("tminimaFuerza");
    txt.value= fuerzaMinima;
}

function checkear () {
    let aObtener = JSON.parse(localStorage.getItem('checkboxes'));

    if(aObtener != null) {
        for(let i = 0 ; i < aObtener.length ; i++) {
            checkboxes[i].checked = aObtener[i];
        }
    }
    else
    {
        for(let i = 0 ; i < aObtener.length ; i++) {
            checkboxes[i].checked = true;
        }
    }
    filtrarAtributos();
}

async function GetHeroes (url) {
    spinner.classList.remove("oculto");
    try {
        let rta= await fetch(url);
        if(!rta.ok) throw Error("Error: " + rta.status + "-" + rta.statusText);
        array= await rta.json();
        tabla.appendChild(CrearTabla(array)); 
        MapeadoPromedio(array);
        MapMaximaFuerza(array);
        MapMinimaFuerza(array);
        checkear();

        localStorage.setItem('heroes', JSON.stringify(array));
    } catch (err) {
        console.error(err.message);
    }finally { 
        spinner.classList.add("oculto");
    }
}

const checkboxes = document.querySelectorAll('#contenedor input[type="checkbox"]');
checkboxes.forEach(e=> {e.addEventListener('change', filtrarAtributos) });

function filtrarAtributos() {
    const checkboxes = document.querySelectorAll('#contenedor input[type="checkbox"]');
    let checks = [];
    let atributosSeleccionados = Array.from(checkboxes)
      .filter(checkbox => {
        checks.push(checkbox.checked);
        return checkbox.checked
      })
      .map(checkbox => checkbox.name);
    if (!atributosSeleccionados.includes('id')) {
    let array=[];
    array.push('id');
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
    localStorage.setItem("checkboxes", JSON.stringify(checks));
}