const formulario = document.querySelector("#formulario");
const inputNombre = document.querySelector("#input-nombre");
const inputEmail = document.querySelector("#input-email");
const inputDireccion = document.querySelector("#input-direccion");
const inputTelefono = document.querySelector("#input-tel");
const botonEnviar = document.querySelector("#input-enviar");
const formEditar = document.querySelector("#form-editar")
const inputEditarNombre = document.querySelector("#editar-nombre")
const inputEditarEmail = document.querySelector("#editar-email")
const inputEditarTelefono = document.querySelector("#editar-telefono")
const inputEditarDireccion = document.querySelector("#editar-direccion")
const botonUsuarioEditado = document.querySelector("#boton-usuario-editado")
let idUsuarioActual = 0
///GET ////
const pedirInfoActualizada = () => {
  fetch("https://601da02bbe5f340017a19d60.mockapi.io/users")
    .then((res) => res.json())
    .then((data) => {
      // console.log(data)
      crearTablaHTML(data)
    })
}

pedirInfoActualizada();

//funciones para boton borrar
const crearBotonesBorrar = () => {
  const botonesBorrar = document.querySelectorAll(".boton-borrar")

  for (let i = 0; i < botonesBorrar.length; i++) {
    botonesBorrar[i].onclick = () => {
      const idDelUsuarioABorrar = botonesBorrar[i].dataset.id
      borrarUsuario(idDelUsuarioABorrar)
    }
  }
}

const borrarUsuario = (id) => {
  console.log("Borrando usuario", id)
  fetch(`https://601da02bbe5f340017a19d60.mockapi.io/users/${id}`, {
    method: "DELETE"
  })
    .then((res) => res.json())
    .then((data) => {
      pedirInfoActualizada();
    })
}

// funciones auxiliares de boton editar
formEditar.style.display = 'none';

const editarUsuario = (id) => {
  console.log("Usuario editado", id)
  fetch(`https://601da02bbe5f340017a19d60.mockapi.io/users/${id}`, {
    method: "PUT",
    body: JSON.stringify({
          "fullname": inputEditarNombre.value,
          "email": inputEditarEmail.value,
          "phone": inputEditarTelefono.value,
          "address": inputEditarDireccion.value
        }), 
        headers: {
          "Content-Type": "application/json"
        }
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      pedirInfoActualizada();
    })
}

const obtenerUsuarioPorId = (id) => {
  fetch(`https://601da02bbe5f340017a19d60.mockapi.io/users/${id}`, {

  }).then((res) => res.json())
    .then((data) => {
      console.log(data)
      inputEditarNombre.value = data.fullname
      inputEditarEmail.value = data.email
      inputEditarTelefono.value = data.phone
      inputEditarDireccion.value = data.address
      formEditar.style.display = 'block';
    })

}

const crearBotonesEditar = () => {
  const botonesEditar = document.querySelectorAll(".boton-editar")
  for (let i = 0; i < botonesEditar.length; i++) {
    botonesEditar[i].onclick = () => {
      idUsuarioActual = botonesEditar[i].dataset.id
      console.log("id del usuario a editar", idUsuarioActual)
      obtenerUsuarioPorId(idUsuarioActual)
      
    }
  }
}


botonUsuarioEditado.onclick = (e)=>{
  e.preventDefault()
  editarUsuario(idUsuarioActual)
  console.log("nombre", inputEditarNombre.value)
}


const agregarUsuarioNuevo = () => {
  fetch("https://601da02bbe5f340017a19d60.mockapi.io/users", {
    method: "POST",
    body:
      JSON.stringify({
        address: inputDireccion.value,
        email: inputEmail.value,
        fullname: inputNombre.value,
        phone: inputTelefono.value,
      }),
    headers: {
      "Content-Type": "application/json"
    }
  }).then((res) => res.json())
    .then((data) => {
      pedirInfoActualizada();

    })


}


formulario.onsubmit = (e) => {
  e.preventDefault();
  agregarUsuarioNuevo();

};



const crearTablaHTML = (data) => {
  const tabla = document.querySelector("#tabla")
  const html = data.reduce((acc, curr) => {
    return acc + `  
    <tr>
      <td>${curr.fullname}</td>
      <td>${curr.email}</td>
      <td>${curr.address}</td>
      <td>${curr.phone}</td>
      <td>
      <button class="boton-borrar" data-id="${curr.id}">Borrar usuario</button>
      <button class="boton-editar" data-id="${curr.id}">Editar usuario</button>
      </td>
    </tr>
    `
  }, `
    <tr>
      <th>Nombre</th>
      <th>Email</th>
      <th>Direccion</th>
      <th>Telefono</th>
      <th>Acciones</th>
    </tr>
    `)

  tabla.innerHTML = html
  crearBotonesBorrar()
  crearBotonesEditar()
}
