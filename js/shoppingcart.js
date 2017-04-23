//main function to full reload the interface
//@param inputToFocus : id of the element to apply focus after reloading
function reloadPage(inputToFocus) {
    //Get our data
    $.ajax({
        url: "js/product.json",
        type: 'GET',
        dataType: 'json',
        //load the page
        success: function(json) {
            var $data = json; //content of our json products
            var cpt = 0; //number of our articles
            var articleQuantity = 0;
            var total = 0;
            var price = 0;
            var subTotal = 0;
            var newProductDiv = ""; // contain html code for "#newProductAdded"'s div
            var tablehtml = "<table class='table'>\n"; //tablehtml : will contain html code to print our table
            tablehtml += "<tr><th>Item Name</th><th>Price</th><th>Quantity</th><th>SubTotal</th><th></th></tr>\n";
            for (let article of $data) {
                if (localStorage.getItem(article["id"]) !== null) {
                    articleQuantity = parseInt(localStorage.getItem(article["id"]));
                    var price = parseFloat(article["price"]);
                    if (article["promo"] == "20") {
                        var promo = price * parseFloat(article["promo"]) / 100
                        var price = price - parseFloat(promo);
                    }
                    subTotal = articleQuantity * parseFloat(price);
                    tablehtml += "<tr>";
                    tablehtml += "<td><img src='" + article["image_min"] + "' class='img-article-sc'><span class='titleArticleSc'>" + article["title"] + "</span></td>";
                    tablehtml += "<td class='tocenter'><span class='SC-text-table'> $" + price + ".00</span></td>";
                    tablehtml += "<td class='tocenter'><form action='?page=shoppingcart' method='POST'><input type='text' name='" + article["id"] + "' value='" + articleQuantity + "'></input></form></td>";
                    tablehtml += "<td class='tocenter'><span class='SC-text-table'> $" + subTotal + ".00</span></th>";
                    tablehtml += "<td class='tocenter'><img src='ressources/cart-02.png' class='img-del-article-SC' onclick=\"removeArticleSC(" + article["id"] + ")\" /></td>";
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
            
            //Table ready to print, Initialization of interface begin
            $("#newProductAdded").html(newProductDiv);
            $("#shoppingCartTable").html(tablehtml);
            localStorage.setItem("itemInSc", cpt);
            $("#itemInSC").html(cpt);
            $("#grandTotal").html("$" + total);
            $("#subTotal").html("$" + total);
            //Focus our input if needed
            if (inputToFocus !== null) {
                var InputValue = $("input[name=" + inputToFocus + "]").val();
                $("input[name=" + inputToFocus + "]").focus().val(InputValue);;
            }
        }
    });
}

//Eventlister to watch our input changing
$(document).on('change keyup', 'input', function() {
    var newQuantity = $(this).val();
    var id = $(this).attr("name");
    localStorage.removeItem(id);
    if ((isNaN(newQuantity)) || (newQuantity === '')) {
        newQuantity = 0;
    }
    localStorage.setItem(id, parseInt(newQuantity));
    reloadPage(id);
});

//function removeArticleSC : function to remove an article if user clic on the cross
function removeArticleSC(id) {
    localStorage.removeItem(id);
    reloadPage(null);
}

//first load of our page
reloadPage(null);
