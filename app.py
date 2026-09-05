from flask import Flask, render_template, request, jsonify
import re

app = Flask(__name__)

# Lista donde se guardarán las personas
agenda = []

# PÁGINA PRINCIPAL
@app.route("/")
def inicio():
    return render_template("index.html")

# AGREGAR PERSONA
@app.route("/agregar", methods=["POST"])
def agregar():

    datos = request.get_json()

    nombre = datos.get("nombre", "").strip()
    apellido = datos.get("apellido", "").strip()
    fecha_nacimiento = datos.get("fecha_nacimiento", "").strip()
    dia_semana = datos.get("dia_semana", "").strip()

    # VALIDAR CAMPOS VACÍOS
    if not nombre or not apellido or not fecha_nacimiento or not dia_semana:
        return jsonify({
            "success": False,
            "mensaje": "Todos los campos son obligatorios."
        }), 400

    # VALIDAR NOMBRE
    if not re.fullmatch(
        r"[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]+",
        nombre
    ):
        return jsonify({
            "success": False,
            "mensaje": "El nombre solo puede contener letras."
        }), 400

    # VALIDAR APELLIDO
    if not re.fullmatch(
        r"[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]+",
        apellido
    ):
        return jsonify({
            "success": False,
            "mensaje": "El apellido solo puede contener letras."
        }), 400

    # CREAR PERSONA
    persona = {
        "id": len(agenda) + 1,
        "nombre": nombre,
        "apellido": apellido,
        "fecha_nacimiento": fecha_nacimiento,
        "dia_semana": dia_semana
    }

    agenda.append(persona)

    return jsonify({
        "success": True,
        "mensaje": "Persona agregada correctamente.",
        "persona": persona
    })


# OBTENER REGISTROS
@app.route("/registros", methods=["GET"])
def registros():
    return jsonify(agenda)


# ELIMINAR PERSONA
@app.route("/eliminar/<int:id>", methods=["DELETE"])
def eliminar(id):

    global agenda

    agenda = [
        persona
        for persona in agenda
        if persona["id"] != id
    ]

    return jsonify({
        "success": True,
        "mensaje": "Registro eliminado."
    })

# EDITAR PERSONA
@app.route("/editar/<int:id>", methods=["PUT"])
def editar(id):

    datos = request.get_json()

    nombre = datos.get("nombre", "").strip()
    apellido = datos.get("apellido", "").strip()
    fecha_nacimiento = datos.get("fecha_nacimiento", "").strip()
    dia_semana = datos.get("dia_semana", "").strip()

    # Validar campos vacíos
    if not nombre or not apellido or not fecha_nacimiento or not dia_semana:
        return jsonify({
            "success": False,
            "mensaje": "Todos los campos son obligatorios."
        }), 400

    # Buscar la persona
    for persona in agenda:

        if persona["id"] == id:

            persona["nombre"] = nombre
            persona["apellido"] = apellido
            persona["fecha_nacimiento"] = fecha_nacimiento
            persona["dia_semana"] = dia_semana

            return jsonify({
                "success": True,
                "mensaje": "Registro actualizado correctamente.",
                "persona": persona
            })

    return jsonify({
        "success": False,
        "mensaje": "Registro no encontrado."
    }), 404

if __name__ == "__main__":
    app.run(debug=True)
    