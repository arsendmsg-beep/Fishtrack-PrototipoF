window.onload = function(){

const parametros = new URLSearchParams(window.location.search);

const pez = parametros.get("pez");

const peces = document.querySelectorAll(".pezWiki");

if(pez){

    peces.forEach(function(p){

        if(p.id !== pez){

            p.style.display = "none";

        }else{

            p.classList.add("seleccionado");

            setTimeout(function(){

                p.scrollIntoView({
                    behavior:"smooth",
                    block:"center"
                });

            },300);

        }

    });

}

const modal = document.querySelector(".modalUbicaciones");

const botones = document.querySelectorAll(".btnUbicaciones");

const cerrar = document.querySelector(".cerrarModal");

botones.forEach(function(boton){

    boton.addEventListener("click",function(){

        modal.style.display="flex";

    });

});

cerrar.addEventListener("click",function(){

    modal.style.display="none";

});

modal.addEventListener("click",function(e){

    if(e.target === modal){

        modal.style.display="none";

    }

});

};


window.addEventListener("load", function () {

const modalZonasPesca = document.querySelector(".modalZonasPesca");
const botonesZonasPesca = document.querySelectorAll(".btnZonas");
const cerrarZonasPesca = document.querySelector(".cerrarZonasPesca");
const contenidoZonasPesca = document.querySelector(".contenidoZonasPesca");

if (!modalZonasPesca || !contenidoZonasPesca) return;

const zonasPesca = {

    pezvela:[
        "Quepos",
        "Golfo Dulce",
        "Marina Pez Vela"
    ],

    dorado:[
        "Quepos",
        "Papagayo",
        "Pacífico Central"
    ],

    atun:[
        "Mar abierto",
        "Golfo de Papagayo",
        "Pacífico Sur"
    ],

    marlin:[
        "Quepos",
        "Los Sueños",
        "Golfo Dulce"
    ],

    robalo:[
        "Estero de Puntarenas",
        "Golfo de Nicoya",
        "Manglares"
    ],

    pargo:[
        "Isla del Caño",
        "Papagayo",
        "Quepos"
    ],

    pezgallo:[
        "Playa Herradura",
        "Quepos",
        "Golfito"
    ],

    peto:[
        "Golfo de Papagayo",
        "Pacífico Central",
        "Pacífico Sur"
    ],

    sabalo:[
        "Golfo de Nicoya",
        "Estero de Puntarenas",
        "Ríos y estuarios del Pacífico"
    ],

    corvina:[
        "Golfo de Nicoya",
        "Puntarenas",
        "Golfo Dulce"
    ],

    sierra:[
        "Golfo de Nicoya",
        "Papagayo",
        "Pacífico Central"
    ],

    pezespada:[
        "Pacífico Norte",
        "Pacífico Central",
        "Pacífico Sur"
    ],

    mero:[
        "Golfo de Papagayo",
        "Isla del Coco",
        "Isla del Caño"
    ],

    pargonegro:[
        "Golfo de Papagayo",
        "Isla del Coco",
        "Pacífico Sur"
    ],

    barracuda:[
        "Golfo de Papagayo",
        "Quepos",
        "Golfo Dulce"
    ],

    lisa:[
        "Golfo de Nicoya",
        "Estero de Puntarenas",
        "Manglares del Pacífico"
    ],

    jurel:[
        "Golfo de Papagayo",
        "Quepos",
        "Pacífico Central"
    ],

    pezleon:[
        "Golfo de Papagayo",
        "Isla del Coco",
        "Pacífico Norte"
    ],

    tiburonmartillo:[
        "Isla del Coco",
        "Isla del Caño",
        "Pacífico Sur"
    ],

    bagre:[
        "Golfo de Nicoya",
        "Estero de Puntarenas",
        "Golfo Dulce"
    ],

    palometa:[
        "Golfo de Papagayo",
        "Quepos",
        "Pacífico Central"
    ],

    pezgato:[
        "Ríos y lagunas",
        "Zonas de agua dulce",
        "Estuarios"
    ],

    cabrilla:[
        "Golfo de Papagayo",
        "Isla del Caño",
        "Golfo Dulce"
    ],

    ronco:[
        "Golfo de Papagayo",
        "Golfo de Nicoya",
        "Pacífico Central"
    ]

};

botonesZonasPesca.forEach(function (boton) {

    boton.addEventListener("click", function () {

        const pez = boton.closest(".pezWiki");

        if (!pez) return;

        const zonas = zonasPesca[pez.id] || [];

        contenidoZonasPesca.innerHTML = "";

        if (zonas.length === 0) {

            contenidoZonasPesca.innerHTML = `
                <div class="zonaPesca">
                    📍 Sin información
                </div>
            `;

        } else {

            zonas.forEach(function (zona) {

                contenidoZonasPesca.innerHTML += `
                    <div class="zonaPesca">
                        🎣 ${zona}
                    </div>
                `;

            });

        }

        modalZonasPesca.style.display = "flex";

    });

});

if (cerrarZonasPesca) {

    cerrarZonasPesca.addEventListener("click", function () {

        modalZonasPesca.style.display = "none";

    });

}

modalZonasPesca.addEventListener("click", function (e) {

    if (e.target === modalZonasPesca) {

        modalZonasPesca.style.display = "none";

    }

});

});