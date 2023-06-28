export const CrearTabla = (array) => 
{
    if(Array.isArray(array))
    {
        const tabla = document.createElement('tabla');
        tabla.appendChild(header(array[0]));
        tabla.appendChild(body(array));
        tabla.classList.add('table');
        tabla.classList.add('table-hover');
        tabla.classList.add('table-responsive');
        tabla.classList.add('table-striped');
        tabla.classList.add('table-bordered');
        return tabla;
    }
}

const header = (elemento) => 
{
    const celdaHeader = document.createElement('thead');
    const headerRow = document.createElement('tr');

    for(const i in elemento)
    {
        if(i != 'id')
        {
            const th = document.createElement('th');
            th.textContent = i;
            th.classList.add('col-lg-5');
            headerRow.appendChild(th);
        }
    }
    celdaHeader.appendChild(headerRow);
    celdaHeader.classList.add('text-center');
    celdaHeader.classList.add('text-capitalize');

    return celdaHeader;
};

const body = (array) => 
{
    const row = document.createElement('tbody');
    array.forEach(element => 
    {
        const tr = document.createElement('tr');
        for(const i in element)
        {
            if(i === 'id')
            {
                tr.dataset.id = element[i];
            }
            else
            {
                const td = document.createElement('td');
                td.textContent = element[i];
                td.classList.add('col-lg-5');
    
                tr.appendChild(td);
            }
        }

        row.appendChild(tr);
    });
    row.classList.add('text-center');

    return row;
};

export const ModificarTabla = (seccion, array) => 
{
    while(seccion.hasChildNodes())
    {
        seccion.removeChild(seccion.firstChild);
    }
    seccion.appendChild(CrearTabla(array));
}
