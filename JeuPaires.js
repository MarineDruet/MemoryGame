"use strict";

// tableau qui regroupe les liens vers les images
let tabImg = ["p1.png", "p2.png", "p3.png", "p4.png", "p5.png", "p6.png", "p7.png", "p8.png", "p9.png", "p10.png", "p11.png", "p12.png", "p13.png", "p14.png", "p15.png", "p16.png", "p17.png", "p18.png", "p19.png", "p20.png"];
let partie = null;
let score = 0;
let dureePartie = null;
let chrono = 0;
let topDuree = 0;
let nbPaires = null;

class Carte {
    constructor(img, partie) {
        this.img = img;
        this.partie = partie;
        this.retournable = true;
        this.retournee = false;
        this.idElem = null;
        this.elementGraph = null;
    }

    // permet de retourner les cartes
    retournerCarte() {
        this.elementGraph.src = "img/" + this.img;
        this.retournee = true;
    }
    retournerCarteDos() {
        this.elementGraph.src = "img/dos.png";
        this.retournee = false;
    }

    // action du jeu de paires
    cliquer() {

        // tant qu'il y a moins de 2 cartes visibles, on retourne une carte
        if (this.partie.nbCarteVisibles < 2) {

            if (this.retournee == true) {
                alert("Choisissez une autre carte !");
            } else {
                this.retournerCarte();
                this.partie.cartesVisibles.push(this);
                this.partie.nbCarteVisibles++;
            }
        }

        // lorsque deux cartes sont visibles, on compare les cartes pour vérifier si elles sont identiques
        if (this.partie.nbCarteVisibles == 2) {
            if (this.partie.cartesVisibles[0].img == this.partie.cartesVisibles[1].img) {
                this.partie.cartesVisibles[0].retournable = false;
                this.partie.cartesVisibles[1].retournable = false;
                this.partie.cartesVisibles = [];
                this.partie.nbCarteVisibles = 0;
                this.partie.nbPairesOK++;
                if (this.partie.nbPairesOK == nbPaires) {
                    clearInterval(dureePartie);
                    alert("Victoire! " + this.partie.nbClick + " clicks");
                    this.partie.afficherScore();
                    Jeu.afficherMeilleurTemps();

                }
            } else {
                // si elles sont différentes, on les remet de dos
                setTimeout(function () {
                    for (let i = 0; i < partie.tabCartes.length; i++) {
                        if (partie.tabCartes[i].retournee == true && partie.tabCartes[i].retournable == true) {
                            partie.tabCartes[i].retournerCarteDos();
                            partie.nbCarteVisibles = 0;
                            partie.cartesVisibles = [];
                        }
                    }
                }, 1000);
            }
        }
    }


}

class Partie {

    constructor() {

        // tableau qui regroupe les paires de cartes
        this.tabCartes = [];
        // nombre de carte retournées
        this.nbCarteVisibles = 0;
        // carte dont paire trouvées
        this.nbPairesOK = 0;
        // stock la paire en cours
        this.cartesVisibles = [];
        // compte le nombre de click par partie
        this.nbClick = 0;
        this.tabElem = [];

    }

    // fonction pour mélanger le contenu d'un tableau
    shuffle() {
        var j, x, i;
        for (i = this.tabCartes.length; i; i -= 1) {
            j = Math.floor(Math.random() * i);
            x = this.tabCartes[i - 1];
            this.tabCartes[i - 1] = this.tabCartes[j];
            this.tabCartes[j] = x;
        }
    }

    // initialise le jeu de paires
    initialiser() {
        dureePartie = setInterval(Jeu.calculerDureePartie, 1000);

        // on rempli le tableau de cartes avec des paires
        while (this.tabCartes.length < (nbPaires * 2)) {
            for (let i = 0; i < tabImg.length; i++) {
                let carte = new Carte(tabImg[i], this);
                let carte2 = new Carte(tabImg[i], this);
                this.tabCartes.push(carte);
                this.tabCartes.push(carte2);
                if ((nbPaires * 2) - this.tabCartes.length == 0) {
                    break;
                }
            }
        }

        console.log(this.tabCartes);


        // on mélange le contenu du tableau
        this.shuffle();

        // liste des balises img
        let zone = document.getElementById("zoneImage");

        for (let k = 0; k < (nbPaires * 2); k++) {
            let elem = document.createElement("img");
            elem.id = k;
            elem.src = "img/dos.png";
            zone.appendChild(elem);
            this.tabElem.push(elem);

            this.tabCartes[k].idElem = this.tabElem[k].id;
            this.tabCartes[k].elementGraph = this.tabElem[k];
            this.tabElem[k].addEventListener("click", Jeu.cliquer);
        }
    }

    rechercherCarte(id) {
        let carte;
        for (let i = 0; i < this.tabCartes.length; i++) {
            if (this.tabCartes[i].idElem == id) {
                carte = this.tabCartes[i];
            }
        }
        return carte;
    }

    afficherScore() {
        if (score == 0) {
            score = this.nbClick;
        }
        if (score > this.nbClick) {
            score = this.nbClick;
        }
        document.getElementById("score").innerHTML = score;
    }
}

class Jeu {
    static main() {
        partie = new Partie();
        nbPaires = Number(prompt("Nombre de paires?"));
        partie.initialiser();

    }

    static cliquer() {
        let carte = partie.rechercherCarte(this.id);
        partie.nbClick++;
        carte.cliquer();
    }

    // on re initialiser la partie
    static resetPartie() {

        for (let i = 0; i < partie.tabCartes.length; i++) {
            partie.tabCartes[i].retournable = true;
            partie.tabCartes[i].retournee = false;
            partie.tabCartes[i].idElem = null;
            partie.tabCartes[i].retournerCarteDos();
        }

        partie.tabCartes = [];
        partie.nbCarteVisibles = 0;
        partie.nbPairesOK = 0;
        partie.cartesVisibles = [];
        partie.nbClick = 0;
        clearInterval(dureePartie);
        chrono = 0;
        partie.tabElem = [];
        let zone = document.getElementById("zoneImage");

        while (zone.firstChild) {
            zone.removeChild(zone.firstChild);
        }
        partie.initialiser();
    }

    static calculerDureePartie() {
        if (partie.nbPairesOK < nbPaires) {
            document.getElementById("chrono").innerHTML = chrono++;
        }
    }

    static afficherMeilleurTemps() {
        if (topDuree == 0) {
            topDuree = chrono;
        }
        if (topDuree > chrono) {
            topDuree = chrono;
        }

        document.getElementById("topchrono").innerHTML = topDuree;
    }
}