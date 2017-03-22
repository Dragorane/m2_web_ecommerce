function loadPage(inputToFocus) {
    $.ajax({
        url: "js/product.json",
        type: 'GET',
        dataType: 'json',
        success: function(json) {
            var $data = json; //content of our json products
            var cpt = 0; //counting our articles
            var tablehtml = "<table class='table'>\n"; //catalogue : html
            tablehtml += "<tr><th>Item Name</th><th>Price</th><th>Quantity</th><th>SubTotal</th><th></th></tr>\n";
            var articleQuantity = 0;
            var total = 0;
            var price = 0;
            var subTotal = 0;
            var newProductDiv = "";
            for (let article of $data) {
                if (localStorage.getItem(article["id"]) !== null) {
                    articleQuantity = parseInt(localStorage.getItem(article["id"]));
                    var price = parseFloat(article["price"]);
                    if (article["promo"] == "20") {
                        var promo = price * parseFloat(article["promo"]) / 100
                        var price = price - parseFloat(promo);
                    }
                    subTotal = articleQuantity * parseFloat(article["price"]);
                    tablehtml += "<tr>";
                    tablehtml += "<th><img src='ressources/cart.png' class='img-article-sc'>" + article["title"] + "</th>";
                    tablehtml += "<th>" + price + "</th>";
                    tablehtml += "<th><form action='?page=shoppingcart' method='POST'><input type='text' name='" + article["id"] + "' value='" + articleQuantity + "'></input></form></th>";
                    tablehtml += "<th>" + subTotal + "</th>";
                    tablehtml += "<th><img src='ressources/cart-02.png' class='subimg-article-catalogue' onclick=\"removeArticleSC(" + article["id"] + ")\" /></th>";
                    tablehtml += "</tr>\n";
                    total += subTotal;
                    cpt = cpt + 1;
                }
                if ((localStorage.getItem("newProduct") !== null) && (article["id"] === localStorage.getItem("newProduct"))) {
                    newProductDiv = "<div class='alert alert-success'><strong><span id='addedproduct'>" + article["title"] + "</span> has been successfully added to your shopping cart.</strong></div>";
                    localStorage.removeItem("newProduct");
                }
            }
            tablehtml += "</table>\n";
            $("#newProductAdded").html(newProductDiv);
            $("#shoppingCartTable").html(tablehtml);
            localStorage.setItem("itemInSc", cpt);
            $("#itemInSC").html(cpt);
            $("#grandTotal").html("$" + total);
            $("#subTotal").html("$" + total);
            if (inputToFocus !== null) {
                var InputValue = $("input[name=" + inputToFocus + "]").val(); //store the value of the element
                console.log(InputValue);
                $("input[name=" + inputToFocus + "]").focus().val(InputValue);;
            }
        }
    });
}


$(document).on('change keyup', 'input', function() {
    var newQuantity = parseInt($(this).val());
    var id = $(this).attr("name");
    localStorage.removeItem(id);
    localStorage.setItem(id, newQuantity);
    loadPage(id);
});

function removeArticleSC(id) {
    localStorage.removeItem(id);
    loadPage(null);
}

loadPage(null);
