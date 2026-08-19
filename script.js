function formatoGPS(valor,tipo){
let direccion=tipo==="lat"
?valor>=0?"N":"S"
:valor>=0?"E":"W";

return `${Math.abs(valor).toFixed(3)}° ${direccion}`;
}

const TIDE_API_KEY="76a2f21d-82be-42d7-8022-b1f2039084f9";

const botonMapa=document.querySelector(".abrirMapa");
const cerrarMapa=document.querySelector(".cerrarMapa");
const mapaDiv=document.querySelector(".mapa");

const climaBtnMapa=document.querySelector(".climaMapaBtn");
const climaBtnUsuario=document.querySelector(".abrirClimaUsuario");

const climaPanel=document.querySelector(".climaPanel");
const climaMapaPanel=document.querySelector(".climaMapaPanel");

const cerrarClima=document.querySelector(".cerrarClima");
const cerrarClimaMapa=document.querySelector(".cerrarClimaMapa");

const obtenerClima=document.querySelector(".obtenerClima");


const temperatura=document.querySelector(".temperatura");
const viento=document.querySelector(".viento");
const humedad=document.querySelector(".humedad");
const lluvia=document.querySelector(".lluvia");
const estadoPesca=document.querySelector(".estadoPesca");
const ubicacionClima=document.querySelector(".ubicacionClima");


const tempMapa=document.querySelector(".tempMapa");
const vientoMapa=document.querySelector(".vientoMapa");
const direccionMapa=document.querySelector(".direccionMapa");
const mareaMapa=document.querySelector(".mareaMapa");


const infoMapa=document.querySelector(".infoMapa");
const latTexto=document.querySelector(".lat");
const lngTexto=document.querySelector(".lng");


const wikipedia=document.querySelector(".wikipedia");
const wikiPanel=document.querySelector(".wikiPanel");
const cerrarWiki=document.querySelector(".cerrarWiki");


if(wikipedia){
wikipedia.onclick=()=>{
if(wikiPanel)
wikiPanel.style.display="flex";
};
}


if(cerrarWiki){
cerrarWiki.onclick=()=>{
if(wikiPanel)
wikiPanel.style.display="none";
};
}


const ubicacionesPanel=document.querySelector(".ubicacionesPanel");
const listaUbicaciones=document.querySelector(".listaUbicaciones");


let mapa;
let mapaCreado=false;


let lugares=JSON.parse(localStorage.getItem("pesca"))||[];



function abrirClimaMapa(){

if(climaMapaPanel)
climaMapaPanel.style.display="flex";

cargarClimaMapa();

}


function abrirClimaUsuario(){

if(climaPanel)
climaPanel.style.display="flex";

}


if(climaBtnMapa)
climaBtnMapa.onclick=abrirClimaMapa;


if(climaBtnUsuario)
climaBtnUsuario.onclick=abrirClimaUsuario;


if(obtenerClima)
obtenerClima.onclick=cargarClimaUsuario;


if(cerrarClima){
cerrarClima.onclick=()=>{
if(climaPanel)
climaPanel.style.display="none";
};
}


if(cerrarClimaMapa){
cerrarClimaMapa.onclick=()=>{
if(climaMapaPanel)
climaMapaPanel.style.display="none";
};
}
function abrirMapa(){

if(!mapaDiv)return;


mapaDiv.style.display="block";

mapaDiv.offsetHeight;


let botonClimaMapa=document.querySelector(".climaMapaBtn");

if(botonClimaMapa)
botonClimaMapa.style.display="flex";


if(infoMapa)
infoMapa.style.display="flex";


if(cerrarMapa)
cerrarMapa.style.display="block";



setTimeout(()=>{


if(!mapaCreado){


mapa=L.map(mapaDiv,{
zoomControl:true
}).setView(
[9.976,-84.829],
13
);



let normal=L.tileLayer(
"https://tile.openstreetmap.org/{z}/{x}/{y}.png",
{
attribution:"© OpenStreetMap"
}
);



let satelite=L.tileLayer(
"https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
{
attribution:"© Esri"
}
);



normal.addTo(mapa);



L.control.layers({

"🗺️ Mapa":normal,

"🌎 Satélite":satelite

}).addTo(mapa);



mapa.on("moveend",()=>{


let centro=mapa.getCenter();


if(latTexto)
latTexto.textContent=formatoGPS(
centro.lat,
"lat"
);


if(lngTexto)
lngTexto.textContent=formatoGPS(
centro.lng,
"lng"
);


});



lugares.forEach(p=>crearPunto(p));



mapa.on("click",e=>{


let nombre=prompt("Nombre del lugar de pesca:");

if(!nombre)return;


let usuario=prompt("Nombre del pescador:");

if(!usuario)return;



let punto={

lat:e.latlng.lat,

lng:e.latlng.lng,

nombre,

usuario,

pez:prompt("Pez recomendado:")||"No especificado",

descripcion:prompt("Descripción del lugar:")||"Sin descripción"

};



lugares.push(punto);



localStorage.setItem(
"pesca",
JSON.stringify(lugares)
);



crearPunto(punto);



});



mapaCreado=true;


}



mapa.invalidateSize(true);


},500);



}

if(botonMapa)
botonMapa.onclick=abrirMapa;



if(cerrarMapa){

cerrarMapa.onclick=()=>{
    let botonClimaMapa=document.querySelector(".climaMapaBtn");

if(botonClimaMapa)
botonClimaMapa.style.display="none";


if(mapaDiv)
mapaDiv.style.display="none";


if(infoMapa)
infoMapa.style.display="none";


if(cerrarMapa)
cerrarMapa.style.display="none";


if(climaMapaPanel)
climaMapaPanel.style.display="none";


};

}
function crearPunto(datos){

let marcador=L.marker([
datos.lat,
datos.lng
]).addTo(mapa);


marcador.bindPopup(`

<h3>🎣 ${datos.nombre}</h3>

<p>
👤 Creado por:<br>
${datos.usuario}
</p>

<p>
🐟 Pez recomendado:<br>
${datos.pez}
</p>

<p>
📝 Descripción:<br>
${datos.descripcion}
</p>

<p>
📍 ${formatoGPS(datos.lat,"lat")}
<br>
${formatoGPS(datos.lng,"lng")}
</p>

<button class="eliminarPunto">
🗑️ Eliminar
</button>

`);



marcador.on("popupopen",()=>{

let boton=document.querySelector(".eliminarPunto");


if(boton){

boton.onclick=()=>{

mapa.removeLayer(marcador);


lugares=lugares.filter(p=>
!(p.lat===datos.lat &&
p.lng===datos.lng)
);


localStorage.setItem(
"pesca",
JSON.stringify(lugares)
);


};

}


});


return marcador;

}





function mostrarUbicaciones(){

if(!listaUbicaciones)return;


listaUbicaciones.innerHTML="";


if(lugares.length===0){

listaUbicaciones.innerHTML=
"<p>No hay ubicaciones creadas todavía.</p>";

return;

}



lugares.forEach(p=>{


let div=document.createElement("div");


div.innerHTML=`

<h3>
📍 ${p.nombre}
</h3>

<p>
👤 ${p.usuario}
</p>

<p>
🐟 ${p.pez}
</p>

<p>
📝 ${p.descripcion}
</p>

<p>
🌎 ${formatoGPS(p.lat,"lat")}
<br>
${formatoGPS(p.lng,"lng")}
</p>


<button class="irUbicacion">
🗺️ Ir al mapa
</button>

`;



listaUbicaciones.appendChild(div);



div.querySelector(".irUbicacion").onclick=()=>{


if(ubicacionesPanel)
ubicacionesPanel.style.display="none";


abrirMapa();


setTimeout(()=>{

if(mapa)

mapa.setView(
[p.lat,p.lng],
15
);

},300);


};


});


}






async function cargarClimaMapa(){

if(!mapa)return;


let centro=mapa.getCenter();


try{


let respuesta=await fetch(
`https://api.open-meteo.com/v1/forecast?latitude=${centro.lat}&longitude=${centro.lng}&current=temperature_2m,wind_speed_10m,wind_direction_10m`
);



let datos=await respuesta.json();

let clima=datos.current;


if(!clima)return;



if(tempMapa)

tempMapa.textContent=
clima.temperature_2m+"°C";



if(vientoMapa)

vientoMapa.textContent=
clima.wind_speed_10m+" km/h";



if(direccionMapa)

direccionMapa.textContent=
gradosDireccion(clima.wind_direction_10m);



let tide=await fetch(
`https://www.worldtides.info/api/v3?heights&lat=${centro.lat}&lon=${centro.lng}&key=${TIDE_API_KEY}`
);



let tideDatos=await tide.json();

let alturas=tideDatos.heights||[];



if(alturas.length){


let ahora=Date.now();


let actual=alturas.reduce((a,b)=>
Math.abs(b.dt*1000-ahora)<
Math.abs(a.dt*1000-ahora)
?b:a
);



let max=Math.max(
...alturas.map(a=>a.height)
);


let min=Math.min(
...alturas.map(a=>a.height)
);


let mitad=(max+min)/2;



if(mareaMapa)

mareaMapa.textContent=
actual.height>mitad
?"🌊 Marea alta"
:"⬇️ Marea baja";


}else{


if(mareaMapa)

mareaMapa.textContent="Sin datos";


}



}catch(error){

console.log("Error clima mapa:",error);


}

}
async function cargarClimaUsuario(){

if(!navigator.geolocation){

alert("Tu dispositivo no permite ubicación");

return;

}



navigator.geolocation.getCurrentPosition(async posicion=>{


let lat=posicion.coords.latitude;

let lng=posicion.coords.longitude;



try{


let respuesta=await fetch(
`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation`
);



let datos=await respuesta.json();

let clima=datos.current;



if(ubicacionClima){

let lugar="Ubicación desconocida";

try{

let ubicacion=await fetch(
`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
);

let datosLugar=await ubicacion.json();

lugar=
datosLugar.address.city ||
datosLugar.address.town ||
datosLugar.address.village ||
datosLugar.address.state ||
"Ubicación desconocida";


if(datosLugar.address.country){
lugar += ", "+datosLugar.address.country;
}


}catch(error){

console.log("Error obteniendo lugar:",error);

}


ubicacionClima.textContent=lugar;

}



if(temperatura)

temperatura.textContent=
clima.temperature_2m+"°C";



if(viento)

viento.textContent=
clima.wind_speed_10m+" km/h";



if(humedad)

humedad.textContent=
clima.relative_humidity_2m+"%";



if(lluvia)

lluvia.textContent=
clima.precipitation+" mm";



if(estadoPesca){


if(
clima.wind_speed_10m<20 &&
clima.precipitation===0
){


estadoPesca.textContent=
"🎣 Buen momento para pescar";


estadoPesca.className=
"estadoPesca pescaBuena";


}else if(clima.wind_speed_10m<35){


estadoPesca.textContent=
"⚠️ Pesca regular";


estadoPesca.className=
"estadoPesca pescaRegular";


}else{


estadoPesca.textContent=
"❌ Poco recomendable";


estadoPesca.className=
"estadoPesca pescaMala";


}


}



}catch(error){

console.log("Error clima usuario:",error);

}


});


}





function gradosDireccion(grados){

if(grados>=337||grados<22)
return "Norte";

if(grados<67)
return "Noreste";

if(grados<112)
return "Este";

if(grados<157)
return "Sureste";

if(grados<202)
return "Sur";

if(grados<247)
return "Suroeste";

if(grados<292)
return "Oeste";

return "Noroeste";

}





const buscarPez=document.getElementById("buscarPez");
const filtroPez=document.getElementById("filtroPez");
const listaPeces=document.querySelector(".pecesLista");

function obtenerTarjetasPeces(){
if(!listaPeces)return [];
return Array.from(
listaPeces.querySelectorAll(":scope > .pezCard")
);
}

function filtrarPeces(){

if(!listaPeces)return;

const texto=buscarPez
?buscarPez.value.toLowerCase().trim()
:"";

const filtro=filtroPez
?filtroPez.value
:"todos";

const tarjetasPeces=obtenerTarjetasPeces();

tarjetasPeces.forEach(pez=>{

const nombreElemento=
pez.querySelector(".peznombre");

if(!nombreElemento)return;

const nombre=
nombreElemento.textContent
.toLowerCase()
.trim();

const tipo=
pez.dataset.tipo||"";

const coincideNombre=
nombre.includes(texto);

const coincideFiltro=
filtro==="todos"||
tipo.includes(filtro);

pez.style.display=
coincideNombre&&coincideFiltro
?""
:"none";

});

}

if(buscarPez){
buscarPez.addEventListener(
"input",
filtrarPeces
);
}

if(filtroPez){
filtroPez.addEventListener(
"change",
filtrarPeces
);
}

obtenerTarjetasPeces().forEach(pez=>{
pez.style.display="";
});

const botonPremiumTelefono=document.querySelector(".botonPremiumTelefono");

const premiumTelefono=document.querySelector(".premiumTelefono");


botonPremiumTelefono?.addEventListener("click",()=>{

premiumTelefono.classList.toggle("activo");

});


const bienvenida = document.querySelector(".bienvenida");

if(bienvenida){

    if(sessionStorage.getItem("bienvenidaMostrada")){

        bienvenida.style.display="none";

    }else{

        sessionStorage.setItem(
            "bienvenidaMostrada",
            "true"
        );

    }

}

document.addEventListener("visibilitychange",()=>{

    if(document.visibilityState==="hidden"){

        setTimeout(()=>{

            if(!document.hasFocus()){

                sessionStorage.removeItem(
                    "bienvenidaMostrada"
                );

            }

        },1000);

    }

});


(function(){

    const bienvenida = document.querySelector(".bienvenida");

    if(!bienvenida) return;

    const esMovil = window.innerWidth <= 768;

    if(esMovil) return;

    const vinoDeOtraPagina =
        document.referrer &&
        new URL(document.referrer).origin === window.location.origin;

    if(vinoDeOtraPagina){
        bienvenida.style.display = "none";
    }else{
        sessionStorage.removeItem("bienvenidaMostrada");
        bienvenida.style.display = "";
    }

})();
