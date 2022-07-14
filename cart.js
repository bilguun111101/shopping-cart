let i = 0;
document.querySelector('.open-cart').onclick = () => {
    document.querySelector('.cart-main').classList.toggle('active-cart');
}
document.querySelector('.open-add').onclick = () => {
    document.querySelector('.add-main').classList.toggle('active-add');
}
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    getDoc,
    setDoc,
    doc,
    updateDoc,
    increment,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";
import {
    getDatabase,
    onValue,
    ref,
    push,
    child,
    update,
    remove,
    set,
    get,
    onChildChanged,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCznDCwpfYiEOQ000FE_p2saj8MmDxJW1g",
  authDomain: "mess-43c57.firebaseapp.com",
  databaseURL: "https://mess-43c57-default-rtdb.firebaseio.com",
  projectId: "mess-43c57",
  storageBucket: "mess-43c57.appspot.com",
  messagingSenderId: "525279772448",
  appId: "1:525279772448:web:e15ef6a8d020155f66e145",
  measurementId: "G-HX7KX4RTBS"
};


const app = initializeApp(firebaseConfig);
const relDb = getDatabase(app);

// some variables
let product = [];
let arrCart = [];
const boxProduct = document.getElementsByClassName('box');

await get(ref(relDb, 'chat')).then(snap => {
    snap.forEach(ref => {
        product.push(ref.val());
    })
})
viewPoster(product);
while (i < boxProduct.length) {
    boxProduct[i].addEventListener('click', (e) => {
        let src = e.target.src
        let boom = product.filter(ref => {
            return(
                ref.image === src
            )
        })
        let Exist = draw(arrCart, src);
        if(Exist === -1) {
            arrCart.forEach(doc => {
                if(doc.image === boom[0].image) {
                    doc.inCart++;
                }
            })
        } else {
            boom.forEach(doc => {
                arrCart.push(doc)
            })
        }
        cartPoster(arrCart)
        totalCartPrice(arrCart)
    })
    i++;
}

// some functions
function draw(arrCart, src) {
    let boomll;
    arrCart.forEach(doc => {
        if(doc.image === src) {
            boomll = -1;
        }
    })
    return boomll;
}

async function totalCartPrice(draw) {
    let total = 0;
    draw.forEach(doc => {
        let totalMulti = doc.inCart * doc.cost;
        total += totalMulti;
    })
    document.querySelector('.cart-total').textContent = "Total $" + total;
}

// draw poster 
async function cartPoster(draw) {
    let cartOut = '';
    draw.forEach(ref => {
        cartOut += `<div class="cart-product">
                        <span>
                            <img src="${ref.image}" alt="">
                        </span>
                        <span>
                            <button class="close-cart" onclick="myFunction(${ref.image})">X</button>
                            <h3>${ref.name}</h3>
                            <input type="number" name="" id="input-number" value="${ref.inCart}">
                            <h4>$${ref.cost}</h4>
                        </span>
                    </div>`
    })
    document.querySelector('.incart-nav').innerHTML = cartOut;
}

async function viewPoster(draw) {
    let outPoster = '';
    draw.forEach(ref => {
        outPoster += `<div class="box">
                            <div class="product-img">
                                <img src="${ref.image}" alt="">
                                <span>
                                    <h1>$${ref.cost}</h1>
                                    <h1>${ref.name}</h1>
                                </span>
                            </div>
                        </div>`
    })
    document.querySelector('.grid-main').innerHTML = outPoster;
}

// add data function
async function inputProduct() {
    let image = document.querySelector('#add-img').value;
    let name = document.querySelector('#add-name').value;
    let cost = document.querySelector('#add-cost').value;

    push(ref(relDb, 'chat'),{
        image,
        name,
        cost,
        inCart: 1
    })
    document.querySelector('#add-img').value = '';
    document.querySelector('#add-name').value = '';
    document.querySelector('#add-cost').value = '';
}

document.querySelector('.send-product').addEventListener('click', inputProduct);