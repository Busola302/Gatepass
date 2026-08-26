/* =========================================================
   RAFARA GATEPASS
   PORTAL / ROLE SELECTION
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       PORTAL CARDS
    ===================================================== */

    const portalCards = document.querySelectorAll(".portal-card");


    /* =====================================================
       CARD INTERACTION
    ===================================================== */

    portalCards.forEach(function (card) {

        const button = card.querySelector(".portal-button");

        if (!button) return;


        /*
         * Allow the entire card to feel clickable
         * while keeping the actual navigation on the button.
         */

        card.addEventListener("click", function (event) {

            /*
             * If the user clicked an actual link,
             * let the browser handle it normally.
             */

            if (event.target.closest("a")) {
                return;
            }

            button.click();

        });


        /*
         * Keyboard accessibility.
         */

        card.setAttribute("tabindex", "0");

        card.addEventListener("keydown", function (event) {

            if (event.key === "Enter" || event.key === " ") {

                event.preventDefault();

                button.click();

            }

        });

    });


    /* =====================================================
       PAGE LOAD ANIMATION
    ===================================================== */

    const intro = document.querySelector(".portal-intro");
    const cards = document.querySelectorAll(".portal-card");
    const help = document.querySelector(".portal-help");


    if (intro) {
        intro.style.opacity = "0";
        intro.style.transform = "translateY(12px)";

        setTimeout(function () {

            intro.style.transition =
                "opacity 0.5s ease, transform 0.5s ease";

            intro.style.opacity = "1";
            intro.style.transform = "translateY(0)";

        }, 80);
    }


    cards.forEach(function (card, index) {

        card.style.opacity = "0";
        card.style.transform = "translateY(15px)";

        setTimeout(function () {

            card.style.transition =
                "opacity 0.45s ease, transform 0.45s ease";

            card.style.opacity = "1";
            card.style.transform = "translateY(0)";

        }, 180 + (index * 100));

    });


    if (help) {

        help.style.opacity = "0";

        setTimeout(function () {

            help.style.transition = "opacity 0.5s ease";

            help.style.opacity = "1";

        }, 550);

    }


})();