$(document).ready(function(){
    $('.carta').click(function(){
        var nombrePersonaje = $(this).find('h3').text().trim();
        obtenerPersonaje(nombrePersonaje);
    });
});

async function obtenerPersonaje(nombre) {
    try {
        const response = await fetch(`https://swapi.dev/api/people/?search=${nombre}&format=json`);
        if (!response.ok) {
            throw new Error('Fallo al realizar la consulta a la API ' + response.statusText);
        }
        const { results } = await response.json();
        const personaje = results[0];
        if (!personaje) {
            throw new Error('No se encontró información del personaje.');
        }
        mostrarInfoPersonaje(personaje);
    } catch (error) {
        console.error('Error al obtener datos del personaje:', error);
    }
}

function mostrarInfoPersonaje(personaje) {
    console.log('Datos del personaje recibidos:', personaje);
    var sectionPersonaje = $('.personaje');
    sectionPersonaje.empty();
    var h2Personaje = $('<h2>').text(personaje.name);
    sectionPersonaje.append(h2Personaje);

    var tablaInformacion = crearTablaInformacion(personaje);
    sectionPersonaje.append(tablaInformacion);

    obtenerPeliculas(personaje.films).then(function(tablaPeliculas){
        sectionPersonaje.append(tablaPeliculas);
    });
}

function crearTablaInformacion(personaje) {
    var table = $('<table>');
    var tableBody = $('<tbody>');

    var propiedadesMostradas = ['Nombre', 'Altura', 'Peso', 'Color de cabello', 'Color de piel', 'Color de ojos', 'Año de nacimiento', 'Género'];

    propiedadesMostradas.forEach(function(prop) {
        var row = $('<tr>');
        var cell1 = $('<td>').text(prop);
        var cell2 = $('<td>').text(obtenerValorPropiedad(personaje, prop.toLowerCase()));
        row.append(cell1, cell2);
        tableBody.append(row);
    });

    table.append(tableBody);
    return table;
}

function obtenerValorPropiedad(personaje, propiedad) {
    switch (propiedad) {
        case 'nombre':
            return personaje.name;
        case 'altura':
            return personaje.height + ' cm';
        case 'peso':
            return personaje.mass + ' kg';
        case 'color de cabello':
            return personaje.hair_color;
        case 'color de piel':
            return personaje.skin_color;
        case 'color de ojos':
            return personaje.eye_color;
        case 'año de nacimiento':
            return personaje.birth_year;
        case 'género':
            return personaje.gender;
        default:
            return '';
    }
}

async function obtenerPeliculas(films) {
    try {
        var sectionPeliculas = $('<section>');
        var h3Peliculas = $('<h3>').text('Peliculas');
        sectionPeliculas.append(h3Peliculas);

        var tablePeliculas = $('<table>').addClass('peliculas-table');
        var tableBody = $('<tbody>');

        for (const filmUrl of films) {
            const pelicula = await obtenerPelicula(filmUrl);
            var row = $('<tr>');
            var titleCell = $('<td>').text(pelicula.title);
            var directorCell = $('<td>').text(pelicula.director);
            var releaseCell = $('<td>').text(pelicula.release_date);
            row.append(titleCell, directorCell, releaseCell);
            tableBody.append(row);
        }

        tablePeliculas.append(tableBody);
        sectionPeliculas.append(tablePeliculas);

        return sectionPeliculas;
    } catch (error) {
        console.error('Error al obtener datos de la película:', error);
    }
}

async function obtenerPelicula(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Fallo al realizar la consulta a la API ' + response.statusText);
    }
    return response.json();
}