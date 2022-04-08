//Variables
const url = 'http://localhost:3000/api/personas/';
const contenedor = document.querySelector('tbody');
let resultados = "";

var modalPersona = new bootstrap.Modal(document.getElementById('modalPersona'));
const formPersona = document.querySelector('form');
const btnCrear = document.getElementById('btnCrear');

const _nombre = document.getElementById('nombre');
const _direccion = document.getElementById('direccion');
const _telefono = document.getElementById('telefono');
let opcion = '';

btnCrear.addEventListener('click', () => {
  _nombre.value = "";
  _direccion.value = "";
  _telefono.value = "";
  modalPersona.show();
  opcion = "crear";
})


//Funcion para mostrar los resultados
const mostrar = (personas) => {
  personas.forEach(elementoPersona => {
    
    resultados += `<tr>
                      <td>${elementoPersona.Id}</td>
                      <td>${elementoPersona.Nombre}</td>
                      <td>${elementoPersona.Direccion}</td>
                      <td>${elementoPersona.Telefono}</td>  
                      <td class="text-center"><a class="btnEditar btn btn-primary">Editar</a><a class="btnBorrar btn btn-danger">Borrar</a></td> 
                   </tr>
                 `
  });
  contenedor.innerHTML = resultados
}
//procedimiento mostrar
fetch(url)
  .then( response => response.json())
  .then( data => mostrar(data))
  .catch( error => console.log(error))


  //Procedimiento borrar
  const on = (element, event, selector, handler) => {
    element.addEventListener(event, e =>{
      if(e.target.closest(selector)){
        handler(e);
      }
    })
  }

  on(document,'click', '.btnBorrar', e =>{
    const fila = e.target.parentNode.parentNode;
    const id = fila.firstElementChild.innerHTML;
    
    alertify.confirm("This is a confirm dialog.",
    function(){
      fetch(url+id, {
        method: 'DELETE'
      })
      .then( res => res.json())
      .then( () => location.reload())
      //alertify.success('Ok');
    },
    function(){
      alertify.error('Cancelado');
    });
    
  })

//Procedimiento editar
let idForm = 0;

on(document,'click', '.btnEditar', e =>{
    const fila = e.target.parentNode.parentNode;
    const nombreForm = fila.children[1].innerHTML;
    const direccionForm = fila.children[2].innerHTML;
    const telefonoForm = fila.children[3].innerHTML;

    idForm = fila.children[0].innerHTML;

    nombre.value = nombreForm;
    direccion.value = direccionForm;
    telefono.value = telefonoForm;

    opcion = "editar";
    modalPersona.show();

    //console.log(`id: ${idForm} nommbre: ${nombreForm} direccion: ${direccionForm} telefono: ${telefonoForm}`);
})

//Procedimiento crear/editar
formPersona.addEventListener('submit', (e) =>{
  e.preventDefault();
  if(opcion == "crear"){
     fetch(url, {
       method: 'POST',
       headers:{
         'content-Type':'application/json'
       },
       body: JSON.stringify({
         Nombre: nombre.value,
         Direccion: direccion.value,
         Telefono: telefono.value,
       })
      })
       .then( response => response.json())
       .then( data => {
         const nuevaPersona = [];
         nuevaPersona.push(data);
         mostrar(nuevaPersona);
       })
     
  }
  if(opcion == "editar"){
     fetch(url+idForm, {
      method: 'PUT',
      headers:{
        'content-Type':'application/json'
      },
      body: JSON.stringify({
        Nombre: nombre.value,
        Direccion: direccion.value,
        Telefono: telefono.value,
      })
     })
     .then( response => response.json() )
     .then( response => location.reload() )
  }
  
  modalPersona.hide()
  
  setTimeout(() =>{
    location.reload()
  }, 500)

})

