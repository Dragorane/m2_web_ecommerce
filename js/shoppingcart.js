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
        for (let article of $data) {
            articleQuantity = parseInt(localStorage.getItem(article["id"]));
            var price = parseFloat(article["price"]);
            if (article["promo"] == "20") {
                var promo = price * parseFloat(article["promo"]) / 100
                var price = price - parseFloat(promo);
            }
            subTotal = articleQuantity * parseFloat(article["price"]);
            if (localStorage.getItem(article["id"]) !== null) {
                tablehtml += "<tr><th>" + article["title"] + "</th><th>" + price + "</th><th>" + articleQuantity + "</th><th>" + subTotal + "</th><th></th></tr>\n";
            }
            total+=subTotal;
        }
        tablehtml += "</table>\n";
        $("#shoppingCartTable").html(tablehtml);
        $("#itemInSC").html(localStorage.length);
        $("#grandTotal").html("$"+total);
        $("#subTotal").html("$"+total);
    }
});
