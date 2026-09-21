// =========================
// SUPABASE
// =========================

const SUPABASE_URL = "https://xwbaglonlmyzqlfbqhfz.supabase.co";
const SUPABASE_KEY = "sb_publishable_4y7E5I_0Gzjc7tMS3FX2RA_2KYumqjo";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// =========================
// VARIABLES
// =========================

let selectedGame = null;
let selectedProduct = null;


// =========================
// LOAD GAMES
// =========================

async function loadGames() {

    const gameList =
        document.getElementById("gameList");

    gameList.innerHTML =
        "<p>Loading game...</p>";


    const { data, error } =
        await supabaseClient
            .from("games")
            .select("*")
            .eq("status", true)
            .order("id");


    console.log("GAMES:", data);
    console.log("ERROR:", error);


    if (error) {

        gameList.innerHTML =
            "<p>Gagal load game: " +
            error.message +
            "</p>";

        return;
    }


    gameList.innerHTML = "";


    data.forEach(function(game) {

        const card =
            document.createElement("div");

        card.className =
            "game-card";


        card.innerHTML = `
            <h3>${game.name}</h3>
            <p>Pilih Game</p>
        `;


        card.addEventListener(
            "click",
            function() {

                selectGame(game);

            }
        );


        gameList.appendChild(card);

    });

}


// =========================
// SELECT GAME
// =========================

function selectGame(game) {

    selectedGame = game;


    // Hide Page 1
    document.getElementById(
        "gameSection"
    ).style.display = "none";


    // Show Page 2
    document.getElementById(
        "productSection"
    ).style.display = "block";


    // Player ID + Zone ID terus keluar
    document.getElementById(
        "playerSection"
    ).style.display = "block";


    // Nama game
    document.getElementById(
        "selectedGameName"
    ).textContent = game.name;


    // Load diamond
    loadProducts(game.id);

}


// =========================
// LOAD DIAMOND
// =========================

async function loadProducts(gameId) {

    const productList =
        document.getElementById(
            "productList"
        );


    productList.innerHTML =
        "<p>Loading diamond...</p>";


    const { data, error } =
        await supabaseClient
            .from("products")
            .select("*")
            .eq("game_id", gameId)
            .eq("status", true)
            .order("price");


    console.log("PRODUCTS:", data);
    console.log("ERROR:", error);


    if (error) {

        productList.innerHTML =
            "<p>Gagal load diamond: " +
            error.message +
            "</p>";

        return;
    }


    productList.innerHTML = "";


    data.forEach(function(product) {

        const card =
            document.createElement("div");


        card.className =
            "product-card";


        card.innerHTML = `
            <h3>${product.name}</h3>

            <p>
                ${product.description || ""}
            </p>

            <strong>
                RM ${Number(product.price).toFixed(2)}
            </strong>
        `;


        card.addEventListener(
            "click",
            function() {

                selectedProduct = product;


                document
                    .querySelectorAll(
                        ".product-card"
                    )
                    .forEach(function(item) {

                        item.classList.remove(
                            "selected"
                        );

                    });


                card.classList.add(
                    "selected"
                );

            }
        );


        productList.appendChild(card);

    });

}


// =========================
// BACK BUTTON
// =========================

const backButton =
    document.getElementById(
        "backButton"
    );


if (backButton) {

    backButton.addEventListener(
        "click",
        function() {

            document.getElementById(
                "productSection"
            ).style.display = "none";


            document.getElementById(
                "playerSection"
            ).style.display = "none";


            document.getElementById(
                "gameSection"
            ).style.display = "block";


            selectedGame = null;
            selectedProduct = null;

        }
    );

}


// =========================
// CONTINUE BUTTON
// =========================

const continueButton =
    document.getElementById(
        "continueButton"
    );


if (continueButton) {

    continueButton.addEventListener(
        "click",
        function() {

            const playerId =
                document.getElementById(
                    "playerId"
                ).value.trim();


            const zoneId =
                document.getElementById(
                    "zoneId"
                ).value.trim();


            if (!selectedProduct) {

                alert(
                    "Sila pilih diamond."
                );

                return;
            }


            if (!playerId) {

                alert(
                    "Sila masukkan Player ID."
                );

                return;
            }


            if (!zoneId) {

                alert(
                    "Sila masukkan Zone ID."
                );

                return;
            }


            // Simpan order
            localStorage.setItem(
                "orderGame",
                selectedGame.name
            );


            localStorage.setItem(
                "orderProduct",
                selectedProduct.name
            );


            localStorage.setItem(
                "orderPlayerId",
                playerId
            );


            localStorage.setItem(
                "orderZoneId",
                zoneId
            );


            localStorage.setItem(
                "orderPrice",
                selectedProduct.price
            );


            // Pergi Order Summary
            window.location.href =
                "order.html";

        }
    );

}


// =========================
// START WEBSITE
// =========================

loadGames();