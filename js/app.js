// VARIABLES y SELECTORES
const formulario = document.querySelector("#agregar-gasto");
const gastoListado = document.querySelector("#gastos ul");

// EVENTOS
eventListeners();
function eventListeners() {
  document.addEventListener("DOMContentLoaded", preguntarPresupuesto);
  formulario.addEventListener("submit", agregarGasto);
}

// CLASES

class Presupuesto {
  constructor(presupuesto) {
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
  }

  nuevoGasto(gasto) {
    this.gastos = [...this.gastos, gasto];
    this.calcularRestante();
  }

  calcularRestante(){
    const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0)
    this.restante = this.presupuesto - gastado;

  }

  eliminarGasto(id){
    this.gastos = this.gastos.filter(gasto => gasto.id !== id);
    this.calcularRestante();
  }
}

class UI {
  mostrarHTML(cantidad) {
    // EXTRAYENDO VALOR CON EL METOD DESTRUCTURING
    const { presupuesto, restante } = cantidad;

    //AGREGAMOS LOS VALORES AL CADA ELEMENTO HTML
    document.querySelector("#total").textContent = presupuesto;
    document.querySelector("#restante").textContent = restante;
  }

  imprimirAlerta(mensaje, tipo) {
    const mesaje = document.querySelector("#mesaje");
   

    // CREAR UN DIV
    const divMensaje = document.createElement("div");
    divMensaje.classList.add("text-center", "alert");

    if (tipo === "error") {
      divMensaje.classList.add("alert-danger");
    } else {
      divMensaje.classList.add("alert-success");
    }

    // MENSAJE DE ERROR
    divMensaje.textContent = mensaje;

    // INSERTAMOS EN EL HMTL
    mesaje.appendChild(divMensaje);

    //QUITAR DEL HTML LA ALERTA
    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }

  mostrarGastos(gastos) {

    this.limpiarHTML()

    //ITERAR SOBRE LOS GASTOS
    gastos.forEach( gasto => {
      const { cantidad, nombre, id } = gasto;

      //CREAMOS UN LI
      const nuevoGasto = document.createElement("li");
      nuevoGasto.className ='list-group-item d-flex justify-content-between align-items-center';
      nuevoGasto.dataset.id = id;

      // AGREGAR EL HTML DEL GASTO
      nuevoGasto.innerHTML = `
      ${nombre} <span class="badge badge-primary badge-pill"> $ ${cantidad} </span>`;

      //BOTTOM PARA ELIMNAR GASTO
      const btnBorrar = document.createElement("button");
      btnBorrar.classList.add("btn", "btn-danger", "borrar-gasto");
      btnBorrar.textContent = "X";
      btnBorrar.onclick = () => {
        eliminarGasto(id);
      }
      nuevoGasto.appendChild(btnBorrar);
      //INSERTAMOS EN HTML

      gastoListado.appendChild(nuevoGasto);
    });
  }

  limpiarHTML() {
    while(gastoListado.firstChild){
      gastoListado.removeChild(gastoListado.firstChild)
    }
  }

  actulizarRestante(restante){
    document.querySelector('#restante').textContent = restante;
  }

  comprobarPresupuesto(presupuestoObj){
    const {presupuesto, restante} = presupuestoObj

    const restanteDiv = document.querySelector('.restante');
    //COMPROBAR 25%
    if((presupuesto / 4) > restante ){
      restanteDiv.classList.remove('alert-success', 'alert-warning')
      restanteDiv.classList.add('alert-danger');
    }else if((presupuesto / 2) > restante){
      restanteDiv.classList.remove('alert-success');
      restanteDiv.classList.add('alert-warning')
    }else{
      restanteDiv.classList.remove('alert-danger','alert-warning')
      restanteDiv.classList.add('alert-success');

    }


    //SI EL TOTAL ES 0 O MENOR
    if(restante <= 0){
      ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
      formulario.querySelector('button[type="submit"]').disabled = true;
    }
  }

}

// INSTANCIAS

const ui = new UI();
let presupuesto;

// FUNCIONES

function preguntarPresupuesto() {
  const presupuestoUsuario = prompt("Agrega tu presupuesto mensual");

  if (
    presupuestoUsuario <= 0 ||
    presupuestoUsuario === "" ||
    presupuestoUsuario === null ||
    isNaN(presupuestoUsuario)
  ) {
    window.location.reload();
  }
  // PRESUPUESTO VALIDO

  presupuesto = new Presupuesto(presupuestoUsuario);
  console.log(presupuesto);
  ui.mostrarHTML(presupuesto);
}

// AÑADE GASTOS
function agregarGasto(e) {
  e.preventDefault();

  // LEER LOS DATOS DE AMBOS FORMULARIOS
  const nombre = document.querySelector("#gasto").value;
  const cantidad = Number(document.querySelector("#cantidad").value);

  //VALIDAR
  if (nombre === "" || cantidad === "") {
    ui.imprimirAlerta("Ambos campos son obligatorios", "error");
    return;
  } else if (cantidad <= 0 || isNaN(cantidad)) {
    ui.imprimirAlerta("Cantidad no valida", "error");
    return;
  }

  const gasto = { nombre, cantidad, id: Date.now() };

  // AÑADE UN NUEVO GASTO
  presupuesto.nuevoGasto(gasto);

  // MENSAJE DE TODO CORRECTO
  ui.imprimirAlerta("correcto");

  // IMPRIMIR LOS GASTOS
  const { gastos, restante } = presupuesto;
  ui.mostrarGastos(gastos);

  ui.actulizarRestante(restante)

  ui.comprobarPresupuesto(presupuesto)
  // REINICIA EL FORMULARO
  formulario.reset();
}

function eliminarGasto(id){
  // ELIMINA LOS GASTOS DEL OBJETO
  presupuesto.eliminarGasto(id);

  //ELIMINA LOS GASTOS DEL HTML
  const {gastos, restante} = presupuesto
  ui.mostrarGastos(gastos);
  ui.actulizarRestante(restante)
  ui.comprobarPresupuesto(presupuesto)
}

