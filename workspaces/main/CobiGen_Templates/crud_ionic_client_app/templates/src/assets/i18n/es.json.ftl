{
  "buttons": {
    "login": "Conectarse",
    "logout": "Desconectarse",
    "menu": "Menu",
    "back": "Atras",
    "Add": "Añadir",
    "Modify": "Modificar",
    "Inspect": "Inspeccionar",
    "Delete": "Borrar",
    "Filter": "Busqueda",
    "Language": "Idioma"
  },
  "header": {
    "title": "OASP4JS",
    "error": "LOGIN ERROR",
    "EN": "English",
    "ES": "Spanish"
  },
  "alert": {
    "title": "Error",
    "subtitle": "Usuario o contraseña erroneo",
    "dismiss": "cerrar"
  },
  "${variables.component}": {
    "title": "${variables.component} Título",
    "description": "Esta es la plantilla básica de ionic",
    "${variables.etoName}": {
      <#list pojo.fields as field>
        "${field.name}":"${field.name}_ES",
      </#list>
      "commonbuttons": {
        "send": "Enviar",
        "dismiss": "Cerrar"
      },
      "operations": {
        "filter": {
          "title": "Formulario de busqueda",
          "message": "Utiliza este formulario para buscar algo",
          "clear": "Limpiar busqueda"
        },
        "add": {
          "title": "Formulario para añadir",
          "message": "Aqui puedes añadir el nuevo item"
        },
        "modify": {
          "title": "Formulario para modificar items",
          "message": "Aqui puedes modificar el item seleccionado"
        },
        "delete": {
          "title": "Alerta confirmación de borrado",
          "message": "Quieres borrar el item seleccionado?",
          "dismiss": "No, cancela",
          "confirm": "Si"
        }
      }
    }
  },
  "login": {
    "user": "Usuario",
    "username": "Username",
    "password": "Contraseña",
    "errorMsg": "Usuario o contraseña erroneos"
  },
  "example": "ejemplo",
  "Home": "Principal"
}