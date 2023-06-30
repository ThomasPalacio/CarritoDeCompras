const cards = document.getElementById('cards');
const items = document.getElementById('items');
const footer = document.getElementById('footer');
/* templates */
const templateCard = document.getElementById('template-card').content;
const templateFooter = document.getElementById('template-footer').content;
const templateCarrito = document.getElementById('template-carrito').content

const fragment = document.createDocumentFragment();

let carrito= {};


document.addEventListener('DOMContentLoaded', () =>{
    fetchData();
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})

/* CLICK DEL BOTON  */
cards.addEventListener('click', e =>{
    addCarrito(e)
})

items.addEventListener('click', e =>{
    btnAccion(e)
})


/* Traida del api.json */
const fetchData = async () => {
    try {
        const res= await fetch('api.json')
        const data = await res.json()
        pintarCards(data);

    } catch (error) {
        console.log(error);
    }

}

/* Creacion de los cards */
const pintarCards = (data)=>{
    data.forEach(product => {
    templateCard.querySelector('h5').textContent = product.title
    templateCard.querySelector('p').textContent = product.precio
    templateCard.querySelector('img').setAttribute('src', product.thumbnailUrl)
    templateCard.querySelector('.btn-primary').dataset.id = product.id

    const clone = templateCard.cloneNode(true)
    fragment.appendChild(clone)
});
cards.appendChild(fragment)
}

/* FUNCION PARA EXTRAER LA INFORMACION DEL CARD AL CARRITO */
const addCarrito = (e) =>{

    if (e.target.classList.contains('btn-primary')) {
        setCarrito(e.target.parentElement)
        
        e.stopPropagation()
    } 
    else {
        
    }
}

/* FUNCION PARA EXTRAER LA INFORMACION DEL CARD AL CARRITO */
const setCarrito = object =>{
    const product= {
        id: object.querySelector('.btn-primary').dataset.id,
        title:object.querySelector('h5').textContent,
        precio:object.querySelector('p').textContent,
        cantidad:1,
    }
    if (carrito.hasOwnProperty(product.id)) {
        product.cantidad = carrito[product.id].cantidad + 1
    }

    carrito[product.id] = {...product}
    pintarCarrito()
}


const pintarCarrito = ()=>{
    items.innerHTML='';
    Object.values(carrito).forEach(product =>{
        templateCarrito.querySelector('th').textContent= product.id;

        templateCarrito.querySelectorAll('td')[0].textContent= product.title;

        templateCarrito.querySelectorAll('td')[1].textContent= product.cantidad;

        templateCarrito.querySelector('.btn-info').dataset.id = product.id;

        templateCarrito.querySelector('.btn-danger').dataset.id = product.id;

        templateCarrito.querySelector('span').textContent= product.cantidad * product.precio

        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone)
    })

    items.appendChild(fragment)

    pintarFooter()


    localStorage.setItem('carrito',JSON.stringify(carrito))
}

const pintarFooter = () => {
  footer.innerHTML='';
  if (Object.keys(carrito).length===0) {
    footer.innerHTML = `
    <th scope="row" colspan="5">Carrito vacío - Comenzá a comprar!</th>
    `
    return
  }

  const nCantidad = Object.values(carrito).reduce((acum, {cantidad}) =>
    acum + cantidad,0
  )

  const nPrecios = Object.values(carrito).reduce((acum, {cantidad,precio}) => acum + cantidad * precio,0)

  console.log(nCantidad);
  console.log(nPrecios);

  templateFooter.querySelectorAll('td')[0].textContent = nCantidad;
  templateFooter.querySelector('span').textContent = nPrecios;

  const clone = templateFooter.cloneNode(true)
  fragment.appendChild(clone)

  footer.appendChild(fragment)

  const btnVaciar = document.getElementById('vaciar-carrito')
  btnVaciar.addEventListener('click', () =>{
    carrito = {}
    pintarCarrito()
  })
}

const btnAccion = e =>{
    /* Accion de aumentar cantidad de la card */
    if (e.target.classList.contains('btn-info')) {
        carrito[e.target.dataset.id]

        const producto = carrito[e.target.dataset.id]
        producto.cantidad++

        carrito[e.target.dataset.id] = {...producto}
        pintarCarrito()
    }

    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
    }

    e.stopPropagation()
}