import { Personaje } from "./personaje.js";

export function Superheroe (id, nombre, alias, editorial, fuerza, arma)
{
    Personaje.call(this, id, nombre, alias)
    this.editorial = editorial;
    this.fuerza = fuerza;
    this.arma = arma;
}