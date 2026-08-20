import { auth, db } from "./firebase.js";

import {
onAuthStateChanged,
signOut,
createUserWithEmailAndPassword,
signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


import {
ref,
get,
set,
push,
onValue,
remove,
update,
off
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";


console.log("SOCIAL CARGADO");


const panelSocial=document.querySelector(".socialPanel");
const abrirPerfil=document.querySelector(".abrirPerfil");
const abrirSocial=document.querySelector(".abrirSocial");
const cerrarSocial=document.querySelector(".cerrarSocial");

const cerrarSesion=document.getElementById("cerrarSesion");

const fotoPerfil=document.getElementById("fotoPerfil");
const nombrePerfil=document.getElementById("nombrePerfil");

const nuevoNombre=document.getElementById("nuevoNombre");
const guardarNombre=document.getElementById("guardarNombre");

const buscarAmigo=document.getElementById("buscarAmigo");
const buscarUsuario=document.getElementById("buscarUsuario");
const resultadoBusqueda=document.getElementById("resultadoBusqueda");

const listaAmigos=document.getElementById("listaAmigos");
const listaChatAmigos=document.getElementById("listaChatAmigos");
const listaSolicitudes=document.getElementById("listaSolicitudes");

const mensajesPrivados=document.getElementById("mensajesPrivados");
const mensajePrivado=document.getElementById("mensajePrivado");
const enviarMensaje=document.getElementById("enviarMensaje");

const nombreChat=document.getElementById("nombreChat");

const listaComunidad=document.getElementById("listaComunidad");
const mensajeComunidad=document.getElementById("mensajeComunidad");
const publicarComunidad=document.getElementById("publicarComunidad");


const zonaPerfil=document.getElementById("zonaPerfil");
const zonaAmigos=document.getElementById("zonaAmigos");
const zonaChat=document.getElementById("zonaChat");
const zonaComunidad=document.getElementById("zonaComunidad");


const tabPerfil=document.querySelector(".tabPerfil");
const tabAmigos=document.querySelector(".tabAmigos");
const tabChat=document.querySelector(".tabChat");
const tabComunidad=document.querySelector(".tabComunidad");


let usuarioActual=null;
let amigoSeleccionado=null;
let chatActual=null;
let detenerChat=null;

let datosUsuarioActual={};



function mostrarZona(zona){

if(!zona)return;


[zonaPerfil,zonaAmigos,zonaChat,zonaComunidad]
.forEach(z=>{

if(z){
z.style.display="none";
}

});


if(zona===zonaChat || zona===zonaComunidad){

zona.style.display="flex";

}else{

zona.style.display="block";

}


}



tabPerfil?.addEventListener(
"click",
()=>{

mostrarZona(zonaPerfil);

}
);



tabAmigos?.addEventListener(
"click",
()=>{

mostrarZona(zonaAmigos);

cargarSolicitudes();
cargarAmigos();

}
);



tabChat?.addEventListener(
"click",
()=>{

mostrarZona(zonaChat);

cargarAmigosChat();

}
);



tabComunidad?.addEventListener(
"click",
()=>{

mostrarZona(zonaComunidad);

cargarComunidad();

}
);



function abrirPanel(){

panelSocial?.classList.remove("oculto");

}



abrirPerfil?.addEventListener(
"click",
abrirPanel
);



abrirSocial?.addEventListener(
"click",
abrirPanel
);



cerrarSocial?.addEventListener(
"click",
()=>{

panelSocial?.classList.add("oculto");

}
);



onAuthStateChanged(
auth,
async(user)=>{


const login=document.querySelector(".loginPantalla");
const bienvenida=document.querySelector(".bienvenida");
const inicio=document.querySelector(".inicioInfo");



if(!user){

usuarioActual=null;

login?.classList.remove("oculto");

bienvenida?.classList.add("oculto");

inicio?.classList.add("oculto");

return;

}



usuarioActual=user.uid;


login?.classList.add("oculto");

bienvenida?.classList.remove("oculto");

inicio?.classList.remove("oculto");



try{


const datos=
await get(
ref(db,"usuarios/"+usuarioActual)
);



if(datos.exists()){


datosUsuarioActual=datos.val();


if(nombrePerfil)
nombrePerfil.textContent=
datosUsuarioActual.nombre || "Usuario";


if(fotoPerfil)
fotoPerfil.src=
datosUsuarioActual.foto || "default.png";


}



await update(
ref(db,"usuarios/"+usuarioActual),
{

online:true,

ultimaConexion:Date.now()

}
);



}catch(error){

console.log(error);

}


});

function cargarSolicitudes(){

if(!usuarioActual || !listaSolicitudes)return;


onValue(
ref(db,"solicitudes/"+usuarioActual),
(snapshot)=>{


listaSolicitudes.innerHTML="";


if(!snapshot.exists()){

listaSolicitudes.innerHTML=
"No tienes solicitudes.";

return;

}



snapshot.forEach(solicitud=>{


let datos=solicitud.val();

let uid=solicitud.key;


let div=document.createElement("div");

div.className="solicitudUsuario";


div.innerHTML=`

<img src="${datos.foto || "default.png"}">

<span>${datos.nombre}</span>

<button class="aceptarSolicitud">
Aceptar
</button>

<button class="rechazarSolicitud">
Rechazar
</button>

`;



div.querySelector(".aceptarSolicitud")
.onclick=async()=>{


await set(
ref(db,"amigos/"+usuarioActual+"/"+uid),
{

uid:uid,

nombre:datos.nombre,

foto:datos.foto || "default.png"

}
);



await set(
ref(db,"amigos/"+uid+"/"+usuarioActual),
{

uid:usuarioActual,

nombre:nombrePerfil.textContent,

foto:fotoPerfil.src

}
);



await remove(
ref(db,"solicitudes/"+usuarioActual+"/"+uid)
);



cargarAmigos();


};



div.querySelector(".rechazarSolicitud")
.onclick=async()=>{


await remove(
ref(db,"solicitudes/"+usuarioActual+"/"+uid)
);


};



listaSolicitudes.appendChild(div);


});


}

);


}




function cargarAmigos(){


if(!usuarioActual || !listaAmigos)return;



onValue(
ref(db,"amigos/"+usuarioActual),
(snapshot)=>{


listaAmigos.innerHTML="";



if(!snapshot.exists()){


listaAmigos.innerHTML=
"No tienes amigos todavía";


return;


}




snapshot.forEach(amigo=>{


let datos=amigo.val();

let uid=amigo.key;



let div=document.createElement("div");


div.className="amigoLista";



div.innerHTML=`

<img src="${datos.foto || "default.png"}">

<span>${datos.nombre}</span>

<button class="eliminarAmigo">
Eliminar
</button>

`;



div.querySelector(".eliminarAmigo")
.onclick=async()=>{


await remove(
ref(db,"amigos/"+usuarioActual+"/"+uid)
);


};



listaAmigos.appendChild(div);



});



}

);



}




function cargarAmigosChat(){


if(!usuarioActual || !listaChatAmigos)return;



onValue(
ref(db,"amigos/"+usuarioActual),
(snapshot)=>{


listaChatAmigos.innerHTML="";



if(!snapshot.exists()){

listaChatAmigos.innerHTML=
"No tienes amigos";

return;

}



snapshot.forEach(amigo=>{


let datos=amigo.val();

let uid=amigo.key;



let div=document.createElement("div");


div.className="amigoChat";



div.innerHTML=`

<img src="${datos.foto || "default.png"}">

<span>
${datos.nombre}
</span>

`;



div.onclick=()=>{


amigoSeleccionado=uid;


chatActual=
[
usuarioActual,
uid
]
.sort()
.join("_");



if(nombreChat){

nombreChat.textContent=
"Chat con "+datos.nombre;

}



iniciarChat();



};



listaChatAmigos.appendChild(div);



});



}

);



}




cerrarSesion?.addEventListener(
"click",
async()=>{


if(usuarioActual){


await update(
ref(db,"usuarios/"+usuarioActual),
{

online:false,

ultimaConexion:Date.now()

}
);


}



await signOut(auth);


location.reload();


}
);

document.querySelector(".btnMostrarLogin")
?.addEventListener(
"click",
()=>{

document.querySelector(".loginFormulario")
?.classList.remove("oculto");


document.querySelector(".registroFormulario")
?.classList.add("oculto");

}
);



document.querySelector(".btnMostrarRegistro")
?.addEventListener(
"click",
()=>{


document.querySelector(".registroFormulario")
?.classList.remove("oculto");


document.querySelector(".loginFormulario")
?.classList.add("oculto");


}
);



document.querySelector(".registrar")
?.addEventListener(
"click",
async()=>{


let nombre=
document.querySelector(".nombreRegistro").value.trim();


let correo=
document.querySelector(".correoRegistro").value.trim();


let pass=
document.querySelector(".passRegistro").value;



try{


let cuenta=
await createUserWithEmailAndPassword(
auth,
correo,
pass
);



await set(
ref(db,"usuarios/"+cuenta.user.uid),
{

nombre:nombre,

foto:"default.png",

online:true,

ultimaConexion:Date.now()

}
);



alert("Cuenta creada correctamente");



}catch(error){


alert(error.message);


}



}
);





document.querySelector(".entrar")
?.addEventListener(
"click",
async()=>{


let correo=
document.querySelector(".correoLogin").value;


let pass=
document.querySelector(".passLogin").value;



try{


await signInWithEmailAndPassword(
auth,
correo,
pass
);



}catch(error){


alert("Correo o contraseña incorrectos");


}



}
);





buscarUsuario?.addEventListener(
"click",
async()=>{


let texto=
buscarAmigo.value
.toLowerCase()
.trim();



if(!texto)return;



resultadoBusqueda.innerHTML=
"Buscando...";



let usuarios=
await get(
ref(db,"usuarios")
);



resultadoBusqueda.innerHTML="";



usuarios.forEach(usuario=>{


let datos=usuario.val();

let uid=usuario.key;



if(
uid!==usuarioActual &&
datos.nombre &&
datos.nombre.toLowerCase().includes(texto)
){



let div=document.createElement("div");


div.className="resultadoUsuario";



div.innerHTML=`

<img src="${datos.foto || "default.png"}">

<span>${datos.nombre}</span>

<button class="enviarSolicitud">
Enviar solicitud
</button>

`;



div.querySelector(".enviarSolicitud")
.onclick=async()=>{


let existe=
await get(
ref(db,"solicitudes/"+uid+"/"+usuarioActual)
);



if(existe.exists()){

alert("Ya enviaste una solicitud");

return;

}



await set(
ref(db,"solicitudes/"+uid+"/"+usuarioActual),
{

uid:usuarioActual,

nombre:nombrePerfil.textContent,

foto:fotoPerfil.src,

fecha:Date.now()

}
);



alert("Solicitud enviada");



};



resultadoBusqueda.appendChild(div);



}



});



}
);





function iniciarChat(){


if(!chatActual || !mensajesPrivados)return;



if(detenerChat){

detenerChat();

}



mensajesPrivados.innerHTML="";



const chatRef=
ref(
db,
"mensajes_privados/"+chatActual
);



onValue(
chatRef,
(snapshot)=>{


mensajesPrivados.innerHTML="";



snapshot.forEach(mensaje=>{


let datos=
mensaje.val();



let div=document.createElement("div");



div.className=
datos.uid===usuarioActual
?
"mensaje mio"
:
"mensaje suyo";



div.innerHTML=`

<p>
${datos.texto}
</p>

`;



mensajesPrivados.appendChild(div);



});



mensajesPrivados.scrollTop=
mensajesPrivados.scrollHeight;



}

);



detenerChat=()=>{

off(chatRef);

};



}




enviarMensaje?.addEventListener(
"click",
async()=>{


let texto=
mensajePrivado.value.trim();



if(!texto)return;



if(!chatActual){

alert("Selecciona un amigo primero");

return;

}



let nuevoMensaje=
push(
ref(db,"mensajes_privados/"+chatActual)
);



await set(
nuevoMensaje,
{

uid:usuarioActual,

nombre:nombrePerfil.textContent,

foto:fotoPerfil.src,

texto:texto,

fecha:Date.now()

}
);



mensajePrivado.value="";



}
);

publicarComunidad?.addEventListener(
"click",
async()=>{


let texto=
mensajeComunidad.value.trim();



if(!texto)return;



let nuevo=
push(
ref(db,"comunidad")
);



await set(
nuevo,
{

uid:usuarioActual,

nombre:nombrePerfil.textContent,

foto:fotoPerfil.src,

mensaje:texto,

fecha:Date.now()

}
);



mensajeComunidad.value="";



}
);





function cargarComunidad(){


if(!listaComunidad)return;



onValue(
ref(db,"comunidad"),
(snapshot)=>{


listaComunidad.innerHTML="";



if(!snapshot.exists()){


listaComunidad.innerHTML=
"No hay publicaciones.";


return;


}



let publicaciones=[];



snapshot.forEach(pub=>{


publicaciones.push({

id:pub.key,

...pub.val()

});


});



publicaciones.sort(
(a,b)=>b.fecha-a.fecha
);



publicaciones.forEach(pub=>{


let div=document.createElement("div");


div.className="publicacion";



div.innerHTML=`

<div class="publicacionUsuario">

<img src="${pub.foto || "default.png"}">

<h3>
${pub.nombre || "Usuario"}
</h3>

</div>


<p class="publicacionTexto">

${pub.mensaje}

</p>


<div class="reacciones">

<button class="likePublicacion">

❤️ ${pub.likes ? Object.keys(pub.likes).length : 0}

</button>


${
pub.uid===usuarioActual
?
`
<button class="eliminarPublicacion">
🗑️
</button>
`
:
""
}

</div>

`;



let botonLike=
div.querySelector(".likePublicacion");



botonLike.onclick=async()=>{


let like=
ref(
db,
"comunidad/"+pub.id+"/likes/"+usuarioActual
);



let existe=
await get(like);



if(existe.exists()){


await remove(like);


}else{


await set(
like,
true
);


}



};





let botonEliminar=
div.querySelector(".eliminarPublicacion");



if(botonEliminar){


botonEliminar.onclick=async()=>{


if(confirm("¿Eliminar publicación?")){


await remove(
ref(db,"comunidad/"+pub.id)
);


}



};



}



listaComunidad.appendChild(div);



});



}

);



}







mensajePrivado?.addEventListener(
"keydown",
(e)=>{


if(e.key==="Enter"){


e.preventDefault();


enviarMensaje.click();


}



}
);






guardarNombre?.addEventListener(
"click",
async()=>{


let nombre=
nuevoNombre.value.trim();



if(!nombre)return;



await update(
ref(db,"usuarios/"+usuarioActual),
{

nombre:nombre

}
);



nombrePerfil.textContent=
nombre;



datosUsuarioActual.nombre=
nombre;



nuevoNombre.value="";



}
);







const cambiarFoto=
document.getElementById("cambiarFoto");



cambiarFoto?.addEventListener(
"change",
async(e)=>{


let archivo=
e.target.files[0];



if(!archivo)return;



let datos=
new FormData();



datos.append(
"file",
archivo
);



datos.append(
"upload_preset",
"fishtrack"
);



try{


let respuesta=
await fetch(
"https://api.cloudinary.com/v1_1/x0dxmtp5/image/upload",
{

method:"POST",

body:datos

}
);



let imagen=
await respuesta.json();



await update(
ref(db,"usuarios/"+usuarioActual),
{

foto:imagen.secure_url

}
);



fotoPerfil.src=
imagen.secure_url;



}catch(error){


alert("Error subiendo imagen");


}



}
);







window.addEventListener(
"beforeunload",
()=>{


if(usuarioActual){


update(
ref(db,"usuarios/"+usuarioActual),
{

online:false,

ultimaConexion:Date.now()

}
);


}



}
);







setInterval(
()=>{


if(usuarioActual){


update(
ref(db,"usuarios/"+usuarioActual),
{

online:true,

ultimaConexion:Date.now()

}
);


}



},
60000
);


(function(){

function esperarUsuario(){

if(!usuarioActual){

setTimeout(esperarUsuario,300);

return;

}

iniciarSistemaAmigos();

}

function iniciarSistemaAmigos(){

const botonBuscarOriginal=
document.getElementById("buscarUsuario");

const botonBuscar=
botonBuscarOriginal?.cloneNode(true);

if(botonBuscarOriginal && botonBuscar){

botonBuscarOriginal.replaceWith(botonBuscar);

}

const buscar=
document.getElementById("buscarAmigo");

const resultados=
document.getElementById("resultadoBusqueda");

const solicitudes=
document.getElementById("listaSolicitudes");

const pestañaAmigos=
document.querySelector(".tabAmigos");

if(botonBuscar){

botonBuscar.addEventListener("click",async()=>{

const texto=
buscar?.value
.trim()
.toLowerCase();

if(!texto){

resultados.innerHTML=
"Escribe un nombre para buscar.";

return;

}

resultados.innerHTML=
"Buscando...";

try{

const usuarios=
await get(
ref(db,"usuarios")
);

resultados.innerHTML="";

let encontrados=0;

usuarios.forEach(usuario=>{

const datos=
usuario.val();

const uid=
usuario.key;

if(
uid!==usuarioActual &&
datos.nombre &&
datos.nombre
.toLowerCase()
.includes(texto)
){

encontrados++;

const div=
document.createElement("div");

div.className=
"resultadoUsuario";

div.innerHTML=`

<img src="${datos.foto || "default.png"}">

<span>${datos.nombre}</span>

<button class="enviarSolicitud">
Agregar
</button>

`;

const boton=
div.querySelector(".enviarSolicitud");

boton.addEventListener(
"click",
async()=>{

try{

const solicitud=
await get(
ref(
db,
"solicitudes/"+uid+"/"+usuarioActual
)
);

if(solicitud.exists()){

boton.textContent=
"Enviada";

boton.disabled=true;

return;

}

await set(
ref(
db,
"solicitudes/"+uid+"/"+usuarioActual
),
{
uid:usuarioActual,

nombre:
nombrePerfil?.textContent ||
datosUsuarioActual.nombre ||
"Usuario",

foto:
fotoPerfil?.src ||
"default.png",

fecha:Date.now()

}
);

boton.textContent=
"Enviada";

boton.disabled=true;

alert(
"Solicitud enviada correctamente"
);

}catch(error){

console.error(
"ERROR AL ENVIAR SOLICITUD:",
error
);

alert(
"No se pudo enviar la solicitud"
);

}

});

resultados.appendChild(div);

}

});

if(encontrados===0){

resultados.innerHTML=
"No se encontró ningún usuario.";

}

}catch(error){

console.error(
"ERROR AL BUSCAR:",
error
);

resultados.innerHTML=
"Error al buscar usuarios.";

}

});

}

function cargarSolicitudesNueva(){

if(!usuarioActual || !solicitudes)return;

onValue(
ref(
db,
"solicitudes/"+usuarioActual
),
snapshot=>{

solicitudes.innerHTML="";

if(!snapshot.exists()){

solicitudes.innerHTML=
"No tienes solicitudes.";

return;

}

snapshot.forEach(solicitud=>{

const datos=
solicitud.val();

const uid=
solicitud.key;

const div=
document.createElement("div");

div.className=
"solicitudUsuario";

div.innerHTML=`

<img src="${datos.foto || "default.png"}">

<span>${datos.nombre || "Usuario"}</span>

<button class="aceptarSolicitud">
Aceptar
</button>

<button class="rechazarSolicitud">
Rechazar
</button>

`;

const aceptar=
div.querySelector(
".aceptarSolicitud"
);

const rechazar=
div.querySelector(
".rechazarSolicitud"
);

aceptar.addEventListener(
"click",
async()=>{

try{

await set(
ref(
db,
"amigos/"+usuarioActual+"/"+uid
),
{
uid:uid,
nombre:
datos.nombre || "Usuario",
foto:
datos.foto || "default.png"
}
);

await set(
ref(
db,
"amigos/"+uid+"/"+usuarioActual
),
{
uid:usuarioActual,
nombre:
nombrePerfil?.textContent ||
"Usuario",
foto:
fotoPerfil?.src ||
"default.png"
}
);

await remove(
ref(
db,
"solicitudes/"+usuarioActual+"/"+uid
)
);

}catch(error){

console.error(
"ERROR AL ACEPTAR:",
error
);

alert(
"No se pudo aceptar la solicitud"
);

}

});

rechazar.addEventListener(
"click",
async()=>{

try{

await remove(
ref(
db,
"solicitudes/"+usuarioActual+"/"+uid
)
);

}catch(error){

console.error(
"ERROR AL RECHAZAR:",
error
);

}

});

solicitudes.appendChild(div);

});

}
);

}

if(pestañaAmigos){

const nuevaPestaña=
pestañaAmigos.cloneNode(true);

pestañaAmigos.replaceWith(
nuevaPestaña
);

nuevaPestaña.addEventListener(
"click",
()=>{

mostrarZona(zonaAmigos);

cargarSolicitudesNueva();

cargarAmigos();

}
);

}

cargarSolicitudesNueva();

}

esperarUsuario();

})();


(function(){

function esperarUsuario(){

if(!usuarioActual){
setTimeout(esperarUsuario,300);
return;
}

iniciarAmigos();

}

function iniciarAmigos(){

const buscarOriginal=document.getElementById("buscarUsuario");
const buscarBoton=buscarOriginal?.cloneNode(true);

if(buscarOriginal && buscarBoton){
buscarOriginal.replaceWith(buscarBoton);
}

const input=document.getElementById("buscarAmigo");
const resultados=document.getElementById("resultadoBusqueda");
const solicitudes=document.getElementById("listaSolicitudes");
const amigos=document.getElementById("listaAmigos");
const pestaña=document.querySelector(".tabAmigos");

if(buscarBoton){

buscarBoton.addEventListener("click",async()=>{

const texto=input?.value.trim().toLowerCase();

if(!texto){

resultados.innerHTML=
"Escribe un nombre para buscar.";

return;

}

resultados.innerHTML="Buscando...";

try{

const usuarios=
await get(ref(db,"usuarios"));

resultados.innerHTML="";

let encontrados=0;

usuarios.forEach(usuario=>{

const datos=usuario.val();
const uid=usuario.key;

if(
uid!==usuarioActual &&
datos.nombre &&
datos.nombre.toLowerCase().includes(texto)
){

encontrados++;

const div=document.createElement("div");

div.className="resultadoUsuario";

div.innerHTML=`
<img src="${datos.foto || "default.png"}">
<span>${datos.nombre}</span>
<button class="enviarSolicitud">
Enviar solicitud
</button>
`;

const boton=
div.querySelector(".enviarSolicitud");

boton.addEventListener("click",async()=>{

try{

const solicitudExistente=
await get(
ref(
db,
"solicitudes/"+uid+"/"+usuarioActual
)
);

if(solicitudExistente.exists()){

boton.textContent="Enviada";
boton.disabled=true;

return;

}

const amigoExistente=
await get(
ref(
db,
"amigos/"+usuarioActual+"/"+uid
)
);

if(amigoExistente.exists()){

boton.textContent="Ya son amigos";
boton.disabled=true;

return;

}

await set(
ref(
db,
"solicitudes/"+uid+"/"+usuarioActual
),
{
uid:usuarioActual,
nombre:
nombrePerfil?.textContent ||
datosUsuarioActual.nombre ||
"Usuario",
foto:
fotoPerfil?.src ||
"default.png",
fecha:Date.now()
}
);

boton.textContent="Solicitud enviada";
boton.disabled=true;

alert("Solicitud enviada correctamente");

}catch(error){

console.error(
"ERROR AL ENVIAR SOLICITUD:",
error
);

alert(
"No se pudo enviar la solicitud"
);

}

});

resultados.appendChild(div);

}

});

if(encontrados===0){

resultados.innerHTML=
"No se encontró ningún usuario.";

}

}catch(error){

console.error(
"ERROR AL BUSCAR USUARIOS:",
error
);

resultados.innerHTML=
"Error al buscar usuarios.";

}

});

}

function cargarSolicitudes(){

if(!usuarioActual || !solicitudes)return;

onValue(
ref(db,"solicitudes/"+usuarioActual),
(snapshot)=>{

solicitudes.innerHTML="";

if(!snapshot.exists()){

solicitudes.innerHTML=
"No tienes solicitudes.";

return;

}

snapshot.forEach(solicitud=>{

const datos=solicitud.val();
const uid=solicitud.key;

const div=document.createElement("div");

div.className="solicitudUsuario";

div.innerHTML=`
<img src="${datos.foto || "default.png"}">
<span>${datos.nombre || "Usuario"}</span>

<div class="botonesSolicitud">

<button class="aceptarSolicitud">
Aceptar
</button>

<button class="rechazarSolicitud">
Rechazar
</button>

</div>
`;

const aceptar=
div.querySelector(".aceptarSolicitud");

const rechazar=
div.querySelector(".rechazarSolicitud");

aceptar.addEventListener(
"click",
async()=>{

try{

await set(
ref(
db,
"amigos/"+usuarioActual+"/"+uid
),
{
uid:uid,
nombre:datos.nombre || "Usuario",
foto:datos.foto || "default.png"
}
);

await set(
ref(
db,
"amigos/"+uid+"/"+usuarioActual
),
{
uid:usuarioActual,
nombre:
nombrePerfil?.textContent ||
datosUsuarioActual.nombre ||
"Usuario",
foto:
fotoPerfil?.src ||
"default.png"
}
);

await remove(
ref(
db,
"solicitudes/"+usuarioActual+"/"+uid
)
);

alert("Solicitud aceptada");

}catch(error){

console.error(
"ERROR AL ACEPTAR:",
error
);

alert(
"No se pudo aceptar la solicitud"
);

}

}
);

rechazar.addEventListener(
"click",
async()=>{

try{

await remove(
ref(
db,
"solicitudes/"+usuarioActual+"/"+uid
)
);

}catch(error){

console.error(
"ERROR AL RECHAZAR:",
error
);

}

}
);

solicitudes.appendChild(div);

});

}
);

}

function cargarAmigos(){

if(!usuarioActual || !amigos)return;

onValue(
ref(db,"amigos/"+usuarioActual),
(snapshot)=>{

amigos.innerHTML="";

if(!snapshot.exists()){

amigos.innerHTML=
"No tienes amigos todavía.";

return;

}

snapshot.forEach(amigo=>{

const datos=amigo.val();
const uid=amigo.key;

const div=document.createElement("div");

div.className="amigoLista";

div.innerHTML=`
<img src="${datos.foto || "default.png"}">
<span>${datos.nombre || "Usuario"}</span>

<button class="eliminarAmigo">
Eliminar
</button>
`;

const eliminar=
div.querySelector(".eliminarAmigo");

eliminar.addEventListener(
"click",
async()=>{

if(!confirm(
"¿Quieres eliminar a este amigo?"
))return;

try{

await remove(
ref(
db,
"amigos/"+usuarioActual+"/"+uid
)
);

await remove(
ref(
db,
"amigos/"+uid+"/"+usuarioActual
)
);

}catch(error){

console.error(
"ERROR AL ELIMINAR AMIGO:",
error
);

}

}
);

amigos.appendChild(div);

});

}
);

}

if(pestaña){

const nuevaPestaña=
pestaña.cloneNode(true);

pestaña.replaceWith(nuevaPestaña);

nuevaPestaña.addEventListener(
"click",
()=>{

mostrarZona(zonaAmigos);

cargarSolicitudes();

cargarAmigos();

}
);

}

cargarSolicitudes();

cargarAmigos();

}

esperarUsuario();

})();

(function(){

const panelSocial=document.querySelector(".socialPanel");
const botonPerfil=document.querySelector(".abrirPerfil");
const botonSocial=document.querySelector(".abrirSocial");
const zonaPerfil=document.getElementById("zonaPerfil");

function abrirPerfilAutomaticamente(){

if(!panelSocial || !zonaPerfil)return;

panelSocial.classList.remove("oculto");

if(typeof mostrarZona==="function"){
mostrarZona(zonaPerfil);
}else{
zonaPerfil.style.display="block";
}

}

botonPerfil?.addEventListener(
"click",
()=>{
setTimeout(()=>{
abrirPerfilAutomaticamente();
},0);
}
);

botonSocial?.addEventListener(
"click",
()=>{
setTimeout(()=>{
abrirPerfilAutomaticamente();
},0);
}
);

})();


(function(){

    const VERSION_TERMINOS = "1.0";

    const registroFormulario =
        document.querySelector(".registroFormulario");

    const botonRegistrar =
        document.querySelector(".registrar");

    if(!registroFormulario || !botonRegistrar){
        console.warn(
            "FishTrack: no se encontró el formulario de registro."
        );
        return;
    }

    const zonaTerminos = document.createElement("div");

    zonaTerminos.className = "zonaAceptacionTerminos";

    zonaTerminos.innerHTML = `

        <label class="checkTerminos">

            <input
                type="checkbox"
                id="aceptarTerminos"
            >

            <span class="checkPersonalizado"></span>

            <span class="textoAceptacion">

                Acepto los

                <button
                    type="button"
                    id="abrirTerminos"
                    class="botonLinkTerminos"
                >
                    Términos y Condiciones
                </button>

                de FishTrack.

            </span>

        </label>

        <p
            id="mensajeTerminos"
            class="mensajeTerminos"
        >
            Debes aceptar los Términos y Condiciones para crear una cuenta.
        </p>

    `;

    botonRegistrar.parentNode.insertBefore(
        zonaTerminos,
        botonRegistrar
    );

    const aceptarTerminos =
        document.getElementById("aceptarTerminos");

    const abrirTerminos =
        document.getElementById("abrirTerminos");

    const mensajeTerminos =
        document.getElementById("mensajeTerminos");

    botonRegistrar.disabled = true;

    botonRegistrar.classList.add(
        "botonRegistroBloqueado"
    );

    aceptarTerminos.addEventListener(
        "change",
        function(){

            if(this.checked){

                botonRegistrar.disabled = false;

                botonRegistrar.classList.remove(
                    "botonRegistroBloqueado"
                );

                mensajeTerminos.style.display = "none";

            }else{

                botonRegistrar.disabled = true;

                botonRegistrar.classList.add(
                    "botonRegistroBloqueado"
                );

                mensajeTerminos.style.display = "block";

            }

        }
    );

    const modalTerminos =
        document.createElement("div");

    modalTerminos.id = "modalTerminos";

    modalTerminos.className =
        "modalTerminos oculto";

    modalTerminos.innerHTML = `

        <div class="contenidoTerminos">

            <div class="encabezadoTerminos">

                <div>

                    <h1>
                        Términos y Condiciones
                    </h1>

                    <p>
                        FishTrack
                    </p>

                </div>

                <button
                    type="button"
                    id="cerrarTerminos"
                    class="cerrarTerminos"
                >
                    ✕
                </button>

            </div>

            <div class="cuerpoTerminos">

                <p class="ultimaActualizacionTerminos">
                    Última actualización: 17 de agosto de 2026
                    <br>
                    Versión: ${VERSION_TERMINOS}
                </p>

                <section>

                    <h2>1. Aceptación de los términos</h2>

                    <p>
                        Al crear una cuenta y utilizar FishTrack,
                        aceptas estos Términos y Condiciones.
                        Si no estás de acuerdo con alguno de ellos,
                        no debes crear una cuenta ni utilizar la plataforma.
                    </p>

                </section>

                <section>

                    <h2>2. ¿Qué es FishTrack?</h2>

                    <p>
                        FishTrack es una plataforma orientada a la
                        comunidad de pesca que permite consultar
                        información relacionada con peces, ubicaciones,
                        mapas y otros recursos relacionados con la
                        actividad pesquera.
                    </p>

                    <p>
                        La plataforma también puede incluir funciones
                        sociales que permiten a los usuarios interactuar
                        entre sí.
                    </p>

                </section>

                <section>

                    <h2>3. Creación de una cuenta</h2>

                    <p>
                        Para utilizar determinadas funciones de FishTrack
                        es necesario crear una cuenta proporcionando
                        información como nombre, correo electrónico y
                        contraseña.
                    </p>

                    <p>
                        El usuario es responsable de proporcionar
                        información correcta y de mantener segura su
                        contraseña.
                    </p>

                    <p>
                        Una cuenta no debe ser utilizada para hacerse
                        pasar por otra persona.
                    </p>

                </section>

                <section>

                    <h2>4. Perfil del usuario</h2>

                    <p>
                        FishTrack permite a los usuarios crear y modificar
                        determinados elementos de su perfil, incluyendo
                        nombre y fotografía.
                    </p>

                    <p>
                        El usuario es responsable del contenido que
                        coloque en su perfil.
                    </p>

                </section>

                <section>

                    <h2>5. Funciones sociales</h2>

                    <p>
                        FishTrack puede permitir buscar otros usuarios,
                        enviar solicitudes de amistad, administrar amigos
                        y comunicarse mediante chats privados.
                    </p>

                    <p>
                        Los usuarios deben utilizar estas funciones de
                        manera responsable y respetuosa.
                    </p>

                </section>

                <section>

                    <h2>6. Comunidad y publicaciones</h2>

                    <p>
                        Los usuarios pueden publicar contenido dentro
                        de las funciones comunitarias de FishTrack.
                    </p>

                    <p>
                        El usuario conserva la responsabilidad sobre el
                        contenido que publica.
                    </p>

                    <p>
                        No está permitido publicar contenido ilegal,
                        amenazas, acoso, spam, suplantación de identidad
                        o contenido destinado a perjudicar a otros usuarios.
                    </p>

                </section>

                <section>

                    <h2>7. Ubicaciones y mapas</h2>

                    <p>
                        La información relacionada con ubicaciones,
                        coordenadas, zonas de pesca y mapas puede ser
                        proporcionada por la plataforma o por usuarios.
                    </p>

                    <p>
                        FishTrack no garantiza que una ubicación,
                        coordenada o información proporcionada por un
                        usuario sea completamente exacta o esté
                        permanentemente disponible.
                    </p>

                </section>

                <section>

                    <h2>8. Información de pesca</h2>

                    <p>
                        La información proporcionada por FishTrack tiene
                        fines informativos y no constituye una garantía
                        de que una determinada especie se encuentre en
                        una ubicación concreta o de que las condiciones
                        sean adecuadas para pescar.
                    </p>

                    <p>
                        El usuario debe tomar sus propias decisiones y
                        actuar de acuerdo con las normas y condiciones
                        de seguridad aplicables.
                    </p>

                </section>

                <section>

                    <h2>9. Privacidad</h2>

                    <p>
                        FishTrack puede almacenar información necesaria
                        para proporcionar las funciones de la plataforma,
                        como información de cuenta, perfil, publicaciones,
                        amistades y otras funciones utilizadas por el usuario.
                    </p>

                    <p>
                        La información debe utilizarse únicamente para
                        proporcionar y mejorar los servicios de FishTrack,
                        de acuerdo con las políticas de privacidad
                        aplicables.
                    </p>

                </section>

                <section>

                    <h2>10. Contenido de los usuarios</h2>

                    <p>
                        Al publicar contenido en FishTrack, el usuario
                        declara que tiene derecho a compartir dicho
                        contenido y que no infringe los derechos de otras
                        personas.
                    </p>

                    <p>
                        FishTrack puede retirar contenido que incumpla
                        estos términos o que perjudique el funcionamiento
                        o la seguridad de la plataforma.
                    </p>

                </section>

                <section>

                    <h2>11. Conductas no permitidas</h2>

                    <p>
                        Está prohibido utilizar FishTrack para:
                    </p>

                    <ul>

                        <li>
                            Suplantar la identidad de otra persona.
                        </li>

                        <li>
                            Acosar, amenazar o molestar a otros usuarios.
                        </li>

                        <li>
                            Publicar contenido ilegal.
                        </li>

                        <li>
                            Realizar spam.
                        </li>

                        <li>
                            Intentar acceder a cuentas de otros usuarios.
                        </li>

                        <li>
                            Manipular o intentar dañar la plataforma.
                        </li>

                        <li>
                            Utilizar la plataforma para actividades
                            fraudulentas.
                        </li>

                    </ul>

                </section>

                <section>

                    <h2>12. Suspensión de cuentas</h2>

                    <p>
                        FishTrack puede restringir o suspender una cuenta
                        cuando exista un incumplimiento de estos términos,
                        abuso de las funciones de la plataforma o una
                        conducta que pueda perjudicar a otros usuarios
                        o al servicio.
                    </p>

                </section>

                <section>

                    <h2>13. Eliminación de cuenta</h2>

                    <p>
                        El usuario puede solicitar la eliminación de su
                        cuenta de acuerdo con las funciones disponibles
                        en la plataforma.
                    </p>

                    <p>
                        La eliminación de una cuenta puede provocar la
                        pérdida de información asociada a ella.
                    </p>

                </section>

                <section>

                    <h2>14. Disponibilidad del servicio</h2>

                    <p>
                        FishTrack puede experimentar interrupciones,
                        errores, mantenimiento o cambios en sus funciones.
                    </p>

                    <p>
                        No se garantiza que todas las funciones estén
                        disponibles permanentemente.
                    </p>

                </section>

                <section>

                    <h2>15. Cambios en los términos</h2>

                    <p>
                        Estos Términos y Condiciones pueden actualizarse
                        cuando sea necesario para reflejar cambios en
                        FishTrack, sus funciones o requisitos aplicables.
                    </p>

                    <p>
                        Cuando se publique una nueva versión, el usuario
                        podrá tener que aceptar nuevamente los términos
                        antes de continuar utilizando determinadas funciones.
                    </p>

                </section>

                <section>

                    <h2>16. Aceptación</h2>

                    <p>
                        Al marcar la casilla de aceptación durante el
                        registro, confirmas que has leído y aceptas
                        estos Términos y Condiciones.
                    </p>

                </section>

                <section>

                    <h2>17. Contacto</h2>

                    <p>
                        Si tienes preguntas relacionadas con estos
                        Términos y Condiciones, puedes comunicarte con
                        el equipo responsable de FishTrack mediante los
                        medios de contacto proporcionados por la plataforma.
                    </p>

                </section>

                <div class="finalTerminos">

                    <strong>
                        FishTrack
                    </strong>

                    <span>
                        Información y comunidad para una pesca exitosa.
                    </span>

                </div>

            </div>

            <div class="pieTerminos">

                <button
                    type="button"
                    id="aceptarDesdeTerminos"
                    class="botonAceptarTerminos"
                >
                    Aceptar y cerrar
                </button>

            </div>

        </div>

    `;

    document.body.appendChild(modalTerminos);

    abrirTerminos.addEventListener(
        "click",
        function(){

            modalTerminos.classList.remove("oculto");

            document.body.classList.add(
                "terminosAbiertos"
            );

        }
    );

    const cerrarTerminos =
        document.getElementById("cerrarTerminos");

    cerrarTerminos.addEventListener(
        "click",
        cerrarModalTerminos
    );

    const aceptarDesdeTerminos =
        document.getElementById(
            "aceptarDesdeTerminos"
        );

    aceptarDesdeTerminos.addEventListener(
        "click",
        function(){

            aceptarTerminos.checked = true;

            botonRegistrar.disabled = false;

            botonRegistrar.classList.remove(
                "botonRegistroBloqueado"
            );

            mensajeTerminos.style.display = "none";

            cerrarModalTerminos();

        }
    );

    function cerrarModalTerminos(){

        modalTerminos.classList.add("oculto");

        document.body.classList.remove(
            "terminosAbiertos"
        );

    }

    modalTerminos.addEventListener(
        "click",
        function(e){

            if(e.target === modalTerminos){

                cerrarModalTerminos();

            }

        }
    );

    document.addEventListener(
        "keydown",
        function(e){

            if(
                e.key === "Escape" &&
                !modalTerminos.classList.contains("oculto")
            ){

                cerrarModalTerminos();

            }

        }
    );

    const botonRegistrarNuevo =
        botonRegistrar.cloneNode(true);

    botonRegistrar.replaceWith(
        botonRegistrarNuevo
    );

    const botonRegistroFinal =
        botonRegistrarNuevo;

    botonRegistroFinal.disabled =
        !aceptarTerminos.checked;

    botonRegistroFinal.addEventListener(
        "click",
        async function(){

            if(!aceptarTerminos.checked){

                mensajeTerminos.style.display =
                    "block";

                return;

            }

            const nombre =
                document.querySelector(
                    ".nombreRegistro"
                )?.value.trim();

            const correo =
                document.querySelector(
                    ".correoRegistro"
                )?.value.trim();

            const pass =
                document.querySelector(
                    ".passRegistro"
                )?.value;

            if(!nombre || !correo || !pass){

                alert(
                    "Completa todos los campos."
                );

                return;

            }

            botonRegistroFinal.disabled = true;

            botonRegistroFinal.textContent =
                "Creando cuenta...";

            try{

                const cuenta =
                    await createUserWithEmailAndPassword(
                        auth,
                        correo,
                        pass
                    );

                await set(
                    ref(
                        db,
                        "usuarios/" +
                        cuenta.user.uid
                    ),
                    {

                        nombre:nombre,

                        foto:"default.png",

                        online:true,

                        ultimaConexion:Date.now(),

                        terminosAceptados:true,

                        versionTerminos:
                            VERSION_TERMINOS,

                        fechaAceptacionTerminos:
                            Date.now()

                    }
                );

                alert(
                    "Cuenta creada correctamente."
                );

                aceptarTerminos.checked = false;

                botonRegistroFinal.disabled =
                    true;

                botonRegistroFinal.textContent =
                    "Registrarse";

            }catch(error){

                console.error(
                    "ERROR AL REGISTRAR:",
                    error
                );

                alert(
                    error.message
                );

                botonRegistroFinal.disabled =
                    !aceptarTerminos.checked;

                botonRegistroFinal.textContent =
                    "Registrarse";

            }

        }
    );

})();

(function(){

    function agregarHoraMensajes(){

        const contenedor = document.getElementById("mensajesPrivados");

        if(!contenedor) return;

        const mensajes = contenedor.querySelectorAll(".mensaje");

        mensajes.forEach(mensaje => {

            if(mensaje.querySelector(".horaMensaje")) return;

            const hora = document.createElement("span");

            hora.className = "horaMensaje";

            const ahora = new Date();

            hora.textContent = ahora.toLocaleTimeString([], {
                hour:"2-digit",
                minute:"2-digit"
            });

            mensaje.appendChild(hora);

        });

    }

    const contenedor = document.getElementById("mensajesPrivados");

    if(!contenedor) return;

    const observer = new MutationObserver(() => {
        agregarHoraMensajes();
    });

    observer.observe(contenedor, {
        childList:true,
        subtree:true
    });

    agregarHoraMensajes();

})();

(function(){

    const boton = document.querySelector(".registrar");
    const checkbox = document.getElementById("aceptarTerminos");
    const mensaje = document.getElementById("mensajeTerminos");

    if(!boton || !checkbox) return;

    boton.type = "button";

    function actualizarBoton(){

        if(checkbox.checked){

            boton.disabled = false;

            boton.classList.remove(
                "botonRegistroBloqueado"
            );

            if(mensaje){
                mensaje.style.display = "none";
            }

        }else{

            boton.disabled = true;

            boton.classList.add(
                "botonRegistroBloqueado"
            );

        }

    }

    checkbox.addEventListener(
        "change",
        actualizarBoton
    );

    actualizarBoton();

    const aceptarTerminos =
        document.getElementById("aceptarDesdeTerminos");

    aceptarTerminos?.addEventListener(
        "click",
        function(){

            checkbox.checked = true;

            actualizarBoton();

        }
    );

})();


(function(){

    const checkbox = document.getElementById("aceptarTerminos");
    const botonRegistrar = document.querySelector(".registrar");
    const modal = document.getElementById("modalTerminos");
    const cuerpo = document.querySelector(".cuerpoTerminos");
    const botonAceptar = document.getElementById("aceptarDesdeTerminos");
    const mensaje = document.getElementById("mensajeTerminos");

    if(!checkbox || !botonRegistrar || !modal || !cuerpo || !botonAceptar){
        return;
    }

    checkbox.style.display = "none";
    checkbox.hidden = true;

    let aceptado = false;

    botonRegistrar.type = "button";
    botonRegistrar.disabled = true;

    botonRegistrar.classList.add(
        "botonRegistroBloqueado"
    );

    if(mensaje){
        mensaje.style.display = "none";
    }

    const pie = document.querySelector(".pieTerminos");

    if(pie){
        pie.remove();
    }

    cuerpo.appendChild(botonAceptar);

    botonAceptar.addEventListener(
        "click",
        function(){

            aceptado = true;

            checkbox.checked = true;

            botonRegistrar.disabled = false;

            botonRegistrar.classList.remove(
                "botonRegistroBloqueado"
            );

            if(mensaje){
                mensaje.style.display = "none";
            }

            modal.classList.add("oculto");

            document.body.classList.remove(
                "terminosAbiertos"
            );

        }
    );

    botonRegistrar.addEventListener(
        "click",
        function(e){

            if(!aceptado){

                e.preventDefault();
                e.stopImmediatePropagation();

                if(mensaje){
                    mensaje.style.display = "block";
                }

                return;
            }

        },
        true
    );

})();



(function(){

    const boton =
        document.getElementById("botonConfiguracion");

    const zonaPerfil =
        document.getElementById("zonaPerfil");

    if(!boton || !zonaPerfil) return;


    let panel =
        document.getElementById("panelConfiguracion");


    if(!panel){

        panel = document.createElement("div");

        panel.id = "panelConfiguracion";

        panel.innerHTML = `

            <h3>⚙️ Configuración</h3>

            <p>Tema</p>

            <button id="configOscuro">
                🌙 Oscuro
            </button>

            <button id="configClaro">
                ☀️ Claro
            </button>

            <p>Idioma</p>

            <button id="configEspanol">
                🇪🇸 Español
            </button>

            <button id="configIngles">
                🇺🇸 English
            </button>

        `;

        zonaPerfil.appendChild(panel);

    }


    boton.addEventListener(
        "click",
        function(e){

            e.stopPropagation();

            panel.classList.toggle("activo");

        }
    );


    panel.addEventListener(
        "click",
        function(e){

            e.stopPropagation();

        }
    );


    document.addEventListener(
        "click",
        function(){

            panel.classList.remove("activo");

        }
    );


    /* TEMA */

    function cambiarTema(tema){

        document.documentElement.classList.remove(
            "temaClaro",
            "temaOscuro"
        );

        document.documentElement.classList.add(
            tema === "claro"
                ? "temaClaro"
                : "temaOscuro"
        );

        localStorage.setItem(
            "fishtrackTema",
            tema
        );

    }


    document
        .getElementById("configOscuro")
        .addEventListener(
            "click",
            function(){

                cambiarTema("oscuro");

            }
        );


    document
        .getElementById("configClaro")
        .addEventListener(
            "click",
            function(){

                cambiarTema("claro");

            }
        );


    cambiarTema(
        localStorage.getItem("fishtrackTema") || "oscuro"
    );


    /* IDIOMA */

    const idiomas = {

        es: {
            configuracion: "⚙️ Configuración",
            tema: "Tema",
            oscuro: "🌙 Oscuro",
            claro: "☀️ Claro",
            idioma: "Idioma"
        },

        en: {
            configuracion: "⚙️ Settings",
            tema: "Theme",
            oscuro: "🌙 Dark",
            claro: "☀️ Light",
            idioma: "Language"
        }

    };


    function cambiarIdioma(idioma){

        const texto =
            idiomas[idioma];

        if(!texto) return;


        panel.querySelector("h3").textContent =
            texto.configuracion;


        const parrafos =
            panel.querySelectorAll("p");


        if(parrafos[0])
            parrafos[0].textContent =
                texto.tema;


        if(parrafos[1])
            parrafos[1].textContent =
                texto.idioma;


        document.getElementById(
            "configOscuro"
        ).textContent =
            texto.oscuro;


        document.getElementById(
            "configClaro"
        ).textContent =
            texto.claro;


        localStorage.setItem(
            "fishtrackIdioma",
            idioma
        );

    }


    document
        .getElementById("configEspanol")
        .addEventListener(
            "click",
            function(){

                cambiarIdioma("es");

            }
        );


    document
        .getElementById("configIngles")
        .addEventListener(
            "click",
            function(){

                cambiarIdioma("en");

            }
        );


    cambiarIdioma(
        localStorage.getItem("fishtrackIdioma") || "es"
    );


})();


(function(){

    const botonOriginal =
        document.getElementById("publicarComunidad");

    const inputFoto =
        document.getElementById("fotoComunidad");

    const mensaje =
        document.getElementById("mensajeComunidad");

    const lista =
        document.getElementById("listaComunidad");

    if(!botonOriginal || !inputFoto || !mensaje || !lista){
        console.log("Elementos de Comunidad no encontrados");
        return;
    }


    const boton =
        botonOriginal.cloneNode(true);

    botonOriginal.replaceWith(boton);


    let fotoSeleccionada = null;


    inputFoto.addEventListener(
        "change",
        function(){

            fotoSeleccionada =
                this.files[0] || null;

            if(!fotoSeleccionada){
                return;
            }

            if(!fotoSeleccionada.type.startsWith("image/")){

                alert("Selecciona una imagen.");

                this.value = "";
                fotoSeleccionada = null;

                return;
            }

        }
    );


    boton.addEventListener(
        "click",
        async function(){

            const texto =
                mensaje.value.trim();


            if(!texto && !fotoSeleccionada){

                alert(
                    "Escribe algo o selecciona una foto."
                );

                return;
            }


            if(!usuarioActual){

                alert(
                    "Debes iniciar sesión."
                );

                return;
            }


            boton.disabled = true;
            boton.textContent = "Subiendo...";


            try{

                let imagenURL = "";


                if(fotoSeleccionada){

                    const datos =
                        new FormData();


                    datos.append(
                        "file",
                        fotoSeleccionada
                    );


                    datos.append(
                        "upload_preset",
                        "fishtrack"
                    );


                    const respuesta =
                        await fetch(
                            "https://api.cloudinary.com/v1_1/x0dxmtp5/image/upload",
                            {
                                method:"POST",
                                body:datos
                            }
                        );


                    const resultado =
                        await respuesta.json();


                    if(!respuesta.ok){

                        console.error(
                            "Cloudinary:",
                            resultado
                        );

                        throw new Error(
                            "No se pudo subir la imagen."
                        );

                    }


                    imagenURL =
                        resultado.secure_url;

                }


                boton.textContent =
                    "Publicando...";


                const nueva =
                    push(
                        ref(
                            db,
                            "comunidad"
                        )
                    );


                await set(
                    nueva,
                    {

                        uid:usuarioActual,

                        nombre:
                            nombrePerfil?.textContent ||
                            datosUsuarioActual.nombre ||
                            "Usuario",

                        foto:
                            fotoPerfil?.src ||
                            "default.png",

                        mensaje:texto,

                        imagen:imagenURL,

                        fecha:Date.now()

                    }
                );


                mensaje.value = "";

                inputFoto.value = "";

                fotoSeleccionada = null;


                cargarComunidad();


            }catch(error){

                console.error(
                    "ERROR COMUNIDAD:",
                    error
                );

                alert(
                    "No se pudo publicar."
                );

            }


            boton.disabled = false;
            boton.textContent = "Publicar";

        }
    );


    cargarComunidad = function(){

        if(!usuarioActual || !lista){
            return;
        }


        onValue(
            ref(db,"comunidad"),
            (snapshot)=>{

                lista.innerHTML = "";


                if(!snapshot.exists()){

                    lista.innerHTML =
                        "No hay publicaciones.";

                    return;

                }


                let publicaciones = [];


                snapshot.forEach(pub=>{

                    publicaciones.push({

                        id:pub.key,

                        ...pub.val()

                    });

                });


                publicaciones.sort(
                    (a,b)=>
                        (b.fecha || 0) -
                        (a.fecha || 0)
                );


                publicaciones.forEach(pub=>{

                    const div =
                        document.createElement("div");


                    div.className =
                        "publicacion";


                    div.innerHTML = `

                        <div class="publicacionUsuario">

                            <img
                                src="${pub.foto || "default.png"}"
                            >

                            <h3>
                                ${pub.nombre || "Usuario"}
                            </h3>

                        </div>


                        ${
                            pub.mensaje
                            ?
                            `
                            <p class="publicacionTexto">
                                ${pub.mensaje}
                            </p>
                            `
                            :
                            ""
                        }


                        ${
                            pub.imagen
                            ?
                            `
                            <div class="publicacionImagen">

                                <img
                                    src="${pub.imagen}"
                                    alt="Foto de publicación"
                                >

                            </div>
                            `
                            :
                            ""
                        }


                        <div class="reacciones">

                            <button class="likePublicacion">

                                ❤️ ${
                                    pub.likes
                                    ?
                                    Object.keys(pub.likes).length
                                    :
                                    0
                                }

                            </button>


                            ${
                                pub.uid === usuarioActual
                                ?
                                `
                                <button class="eliminarPublicacion">
                                    🗑️
                                </button>
                                `
                                :
                                ""
                            }

                        </div>

                    `;


                    const botonLike =
                        div.querySelector(
                            ".likePublicacion"
                        );


                    botonLike?.addEventListener(
                        "click",
                        async()=>{

                            const like =
                                ref(
                                    db,
                                    "comunidad/" +
                                    pub.id +
                                    "/likes/" +
                                    usuarioActual
                                );


                            const existe =
                                await get(like);


                            if(existe.exists()){

                                await remove(like);

                            }else{

                                await set(
                                    like,
                                    true
                                );

                            }

                        }
                    );


                    const botonEliminar =
                        div.querySelector(
                            ".eliminarPublicacion"
                        );


                    botonEliminar?.addEventListener(
                        "click",
                        async()=>{

                            if(
                                confirm(
                                    "¿Eliminar publicación?"
                                )
                            ){

                                await remove(
                                    ref(
                                        db,
                                        "comunidad/" +
                                        pub.id
                                    )
                                );

                            }

                        }
                    );


                    lista.appendChild(div);

                });

            }
        );

    };


})();

(function(){

    const input = document.getElementById("fotoComunidad");
    const mensaje = document.getElementById("mensajeComunidad");

    if(!input || !mensaje) return;

    const zona = document.createElement("div");

    zona.id = "previewFotoComunidad";

    zona.innerHTML = `
        <div class="previewFotoCaja">
            <img id="previewFotoImagen">

            <button
                type="button"
                id="quitarPreviewFoto"
            >
                ✕
            </button>
        </div>
    `;

    mensaje.parentNode.insertBefore(
        zona,
        mensaje
    );

    const imagen =
        document.getElementById("previewFotoImagen");

    const quitar =
        document.getElementById("quitarPreviewFoto");


    input.addEventListener("change", function(){

        const archivo = this.files[0];

        if(!archivo){
            zona.style.display = "none";
            return;
        }

        if(!archivo.type.startsWith("image/")){

            alert("Selecciona una imagen válida.");

            this.value = "";
            zona.style.display = "none";

            return;
        }

        const lector = new FileReader();

        lector.onload = function(e){

            imagen.src = e.target.result;

            zona.style.display = "block";

        };

        lector.readAsDataURL(archivo);

    });


    quitar.addEventListener("click", function(){

        input.value = "";

        imagen.src = "";

        zona.style.display = "none";

    });

})();


(function(){

    const input = document.getElementById("fotoComunidad");
    const preview = document.getElementById("previewFotoComunidad");
    const imagen = document.getElementById("previewFotoImagen");
    const mensaje = document.getElementById("mensajeComunidad");
    const publicar = document.getElementById("publicarComunidad");

    if(!input || !preview || !publicar) return;

    publicar.addEventListener("click", function(){

        setTimeout(function(){

            input.value = "";

            if(imagen){
                imagen.removeAttribute("src");
                imagen.src = "";
            }

            preview.style.display = "none";

            if(mensaje){
                mensaje.value = "";
            }

        }, 1500);

    });

})();


// solucion supongo


    (function(){

    function iniciarActualizacionFotoTiempoReal(){

        if(!usuarioActual){

            setTimeout(
                iniciarActualizacionFotoTiempoReal,
                300
            );

            return;
        }

        const usuarioRef =
            ref(
                db,
                "usuarios/" + usuarioActual
            );


        onValue(
            usuarioRef,
            async(snapshot)=>{

                if(!snapshot.exists()){
                    return;
                }


                const datos =
                    snapshot.val();


                const nuevaFoto =
                    datos.foto || "default.png";


                datosUsuarioActual =
                    datos;


                if(fotoPerfil){

                    if(fotoPerfil.src !== nuevaFoto){

                        fotoPerfil.src =
                            nuevaFoto;

                    }

                }


                if(nombrePerfil){

                    nombrePerfil.textContent =
                        datos.nombre || "Usuario";

                }


                actualizarFotoAmigos(
                    nuevaFoto
                );

                actualizarFotoSolicitudes(
                    nuevaFoto
                );

                actualizarFotoPublicaciones(
                    nuevaFoto
                );

            }
        );

    }


    async function actualizarFotoAmigos(nuevaFoto){

        if(!usuarioActual){
            return;
        }


        try{

            const amigos =
                await get(
                    ref(
                        db,
                        "amigos/" + usuarioActual
                    )
                );


            if(!amigos.exists()){
                return;
            }


            const cambios = {};


            amigos.forEach(amigo=>{

                const uid =
                    amigo.key;


                cambios[
                    "amigos/" +
                    uid +
                    "/" +
                    usuarioActual +
                    "/foto"
                ] = nuevaFoto;

            });


            if(
                Object.keys(cambios).length > 0
            ){

                await update(
                    ref(db),
                    cambios
                );

            }

        }catch(error){

            console.error(
                "Error actualizando foto en amigos:",
                error
            );

        }

    }


    async function actualizarFotoSolicitudes(nuevaFoto){

        if(!usuarioActual){
            return;
        }


        try{

            const solicitudes =
                await get(
                    ref(db,"solicitudes")
                );


            if(!solicitudes.exists()){
                return;
            }


            const cambios = {};


            solicitudes.forEach(usuario=>{

                const datos =
                    usuario.val();


                if(
                    datos &&
                    datos[usuarioActual]
                ){

                    cambios[
                        "solicitudes/" +
                        usuario.key +
                        "/" +
                        usuarioActual +
                        "/foto"
                    ] = nuevaFoto;

                }

            });


            if(
                Object.keys(cambios).length > 0
            ){

                await update(
                    ref(db),
                    cambios
                );

            }

        }catch(error){

            console.error(
                "Error actualizando foto en solicitudes:",
                error
            );

        }

    }


    async function actualizarFotoPublicaciones(nuevaFoto){

        if(!usuarioActual){
            return;
        }


        try{

            const publicaciones =
                await get(
                    ref(db,"comunidad")
                );


            if(!publicaciones.exists()){
                return;
            }


            const cambios = {};


            publicaciones.forEach(publicacion=>{

                const datos =
                    publicacion.val();


                if(
                    datos &&
                    datos.uid === usuarioActual
                ){

                    cambios[
                        "comunidad/" +
                        publicacion.key +
                        "/foto"
                    ] = nuevaFoto;

                }

            });


            if(
                Object.keys(cambios).length > 0
            ){

                await update(
                    ref(db),
                    cambios
                );

            }

        }catch(error){

            console.error(
                "Error actualizando foto en publicaciones:",
                error
            );

        }

    }


    iniciarActualizacionFotoTiempoReal();

})();


(function(){

    const login = document.querySelector(".loginPantalla");

    if(!login) return;

    login.style.display = "none";

    const mostrarLogin = () => {
        login.style.display = "";
        login.classList.remove("oculto");
    };

    const ocultarLogin = () => {
        login.style.display = "none";
    };

    ocultarLogin();

    const original = window.onAuthStateChanged;

    const esperarFirebase = setInterval(() => {

        if(typeof usuarioActual !== "undefined"){

            clearInterval(esperarFirebase);

            if(usuarioActual){
                ocultarLogin();
            }else{
                mostrarLogin();
            }

        }

    }, 50);

    setTimeout(() => {
        clearInterval(esperarFirebase);

        if(typeof usuarioActual !== "undefined"){

            if(usuarioActual){
                ocultarLogin();
            }else{
                mostrarLogin();
            }

        }

    }, 10000);

})();
