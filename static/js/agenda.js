const formulario =
    document.getElementById("formularioAgenda");

const listaAgenda =
    document.getElementById("listaAgenda");

const mensaje =
    document.getElementById("mensaje");


// Cargar registros cuando se abre la página

document.addEventListener("DOMContentLoaded", () => {

    cargarRegistros();

});


// AGREGAR PERSONA

formulario.addEventListener("submit", async (event) => {

    event.preventDefault();


    const nombre =
        document.getElementById("nombre").value.trim();

    const apellido =
        document.getElementById("apellido").value.trim();

    const fechaNacimiento =
        document.getElementById("fechaNacimiento").value;

    const diaSemana =
        document.getElementById("diaSemana").value;


    // Validación

    if (
        !nombre ||
        !apellido ||
        !fechaNacimiento ||
        !diaSemana
    ) {

        mostrarMensaje(
            "Debe completar todos los campos.",
            "error"
        );

        return;
    }


    // Enviar información a Python

    const respuesta = await fetch("/agregar", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            nombre: nombre,

            apellido: apellido,

            fecha_nacimiento: fechaNacimiento,

            dia_semana: diaSemana

        })

    });


    const resultado =
        await respuesta.json();


    if (resultado.success) {

        mostrarMensaje(
            "Persona agregada correctamente.",
            "exito"
        );


        formulario.reset();


        cargarRegistros();

    } else {

        mostrarMensaje(
            resultado.mensaje,
            "error"
        );

    }

});


// CARGAR REGISTROS

async function cargarRegistros() {

    const respuesta =
        await fetch("/registros");

    const personas =
        await respuesta.json();


    listaAgenda.innerHTML = "";


    if (personas.length === 0) {

        listaAgenda.innerHTML = `

            <tr>

                <td colspan="6" class="sin-registros">

                    No hay personas registradas.

                </td>

            </tr>

        `;

        return;
    }


    personas.forEach((persona, index) => {

        const fila =
            document.createElement("tr");


        fila.innerHTML = `

            <td>
                ${index + 1}
            </td>

            <td>
                ${persona.nombre}
            </td>

            <td>
                ${persona.apellido}
            </td>

            <td>
                ${persona.fecha_nacimiento}
            </td>

            <td>
                ${persona.dia_semana}
            </td>

            <td>
                 <button
                      class="btn-editar"
                      onclick="editarPersona(${persona.id})"
                  >
                    Editar
                 </button>


                <button
                    class="btn-eliminar"
                    onclick="eliminarPersona(${persona.id})"
                >

                    Eliminar

                </button>

            </td>

        `;


        listaAgenda.appendChild(fila);

    });

}

// EDITAR PERSONA

async function editarPersona(id) {

    const respuesta =
        await fetch("/registros");

    const personas =
        await respuesta.json();

    const persona =
        personas.find(p => p.id === id);


    if (!persona) {

        mostrarMensaje(
            "Registro no encontrado.",
            "error"
        );

        return;
    }


    const nuevoNombre =
        prompt(
            "Ingrese el nuevo nombre:",
            persona.nombre
        );

    if (nuevoNombre === null) {
        return;
    }


    const nuevoApellido =
        prompt(
            "Ingrese el nuevo apellido:",
            persona.apellido
        );

    if (nuevoApellido === null) {
        return;
    }


    const nuevaFecha =
        prompt(
            "Ingrese la nueva fecha de nacimiento:",
            persona.fecha_nacimiento
        );

    if (nuevaFecha === null) {
        return;
    }


    const nuevoDia =
        prompt(
            "Ingrese el nuevo día de la semana:",
            persona.dia_semana
        );

    if (nuevoDia === null) {
        return;
    }


    const respuestaEditar =
        await fetch(`/editar/${id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                nombre: nuevoNombre,

                apellido: nuevoApellido,

                fecha_nacimiento: nuevaFecha,

                dia_semana: nuevoDia

            })

        });


    const resultado =
        await respuestaEditar.json();


    if (resultado.success) {

        mostrarMensaje(
            "Registro actualizado correctamente.",
            "exito"
        );

        cargarRegistros();

    } else {

        mostrarMensaje(
            resultado.mensaje,
            "error"
        );

    }

}

// ELIMINAR

async function eliminarPersona(id) {

    const confirmar =
        confirm(
            "¿Está seguro de eliminar este registro?"
        );


    if (!confirmar) {
        return;
    }


    await fetch(`/eliminar/${id}`, {

        method: "DELETE"

    });


    cargarRegistros();


    mostrarMensaje(
        "Registro eliminado.",
        "exito"
    );

}


// MENSAJES

function mostrarMensaje(texto, tipo) {

    mensaje.textContent = texto;


    if (tipo === "error") {

        mensaje.style.color = "#dc2626";

    } else {

        mensaje.style.color = "#16a34a";

    }


    setTimeout(() => {

        mensaje.textContent = "";

    }, 3000);

}