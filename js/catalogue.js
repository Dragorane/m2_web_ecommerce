$.ajax({
    url: "js/product.json",
    type: 'GET',
    dataType: 'json',
    success: function(json) {
        var $data = json; //content of our json products
        var cpt = 0; //counting our articles
        var catalogue = "<div class='row'>\n"; //catalogue : html
        var arrayCategories = {}; //array to stock categorie
        var htmlCategories = ""; //var to stock html code for categorie
        var arrayBrand = {};
        var htmlBrand = "";
        var arrayColor = {};
        var htmlColor = "";
        for (let article of $data) {
            catalogue = buildCatalogue(catalogue, article, cpt);
            arrayCategories = buildKV(arrayCategories, article["categorie"]);
            arrayBrand = buildKV(arrayBrand, article["brand"]);
            arrayColor = buildKV(arrayColor, article["color"]);
            cpt = cpt + 1;
        }
        catalogue += "</div>\n";
        htmlCategories = printCategories(arrayCategories);
        htmlBrand = printBrand(arrayBrand);
        htmlColor = printColor(arrayColor);
        $("#products_catalogue").html(catalogue);
        $("#cpt_items").html(cpt);
        $("#categoriesSelection").html(htmlCategories);
        $("#brandSelection").html(htmlBrand);
        $("#colorSelection").html(htmlColor);
    }
});


function buildKV(array, key) {
    if (typeof array[key] === 'undefined') {
        array[key] = 1;
    }
    else {
        array[key] = array[key] + 1;
    }
    return array;
}

function printColor(arrayColor) {
    console.log(arrayColor);
    var htmlColor = "";
    for (var key in arrayColor) {
        let value = arrayColor[key];
        htmlColor += "<div class='color_selector " + key + "'></div>"
    }
    return htmlColor;
}

function printBrand(arrayBrand) {
    var htmlBrand = "<form><div class='checkbox'>";
    for (var key in arrayBrand) {
        let value = arrayBrand[key];
        htmlBrand += "<label>";
        htmlBrand += "<input type='checkbox'>" + key + " (" + value + ")";
        htmlBrand += "</label><br/>";
    }
    htmlBrand += "</div></form>";
    return htmlBrand;
}

function printCategories(arrayCategories) {
    var htmlCategories = "<ul class='list-unstyled'>";
    for (var key in arrayCategories) {
        let value = arrayCategories[key];
        htmlCategories += "<li>" + key + " (" + value + ")</li>";
        htmlCategories += "<ul id=\"" + key + "\"></ul>";
    }
    htmlCategories += "</ul>";
    return htmlCategories;
}

function buildCatalogue(catalogue, article, cpt) {
    if ((cpt % 3) == 0) {
        catalogue += "</div>\n"
        catalogue += "<div class='row'>\n"
    }
    catalogue += "<div class='col-md-4'>\n";
    catalogue += "<div class='container-fluide'>\n";
    catalogue += "<div class='pictures_article'>\n";
    catalogue += "<div class='div-img-article'>\n";
    if (article["promo"] == "20") {
        catalogue += "<img class='img-article-promo' src='ressources/img-09.png'/>\n"
    }
    if (article["age"] == "new") {
        catalogue += "<img class='img-article-promo' src='ressources/img-10.png'/>\n"
    }
    catalogue += "<img class='img-article-catalogue' src='ressources/img-08.png'/>\n";
    catalogue += "</div>\n";
    catalogue += "</div>\n";
    catalogue += "<a href='#'><span class='article_title'>" + article["title"] + "</span></a><br/>\n";
    if (article["promo"] == "20") {
        var promo = parseInt(article["price"]) * parseInt(article["price"]) / 100
        var resultat = parseInt(article["price"]) - parseInt(promo);
        catalogue += "<span class='price_catolgue'><span class='price_catalogue_1'>" + article["price"] + "$</span> <span class='price_catalogue_2'>" + resultat + "$</span></span>\n";
    }
    else {
        catalogue += "<span class='price_catolgue'>" + article["price"] + "$</span>\n";
    }
    catalogue += "<div class='article_button'>\n";
    catalogue += " <img src='ressources/img-11.png' class='subimg-article-catalogue' />\n";
    catalogue += "<img src='ressources/img-12.png' class='subimg-article-catalogue' />\n";
    catalogue += " <img src='ressources/img-13.png' class='subimg-article-catalogue' />\n";
    catalogue += "</div>\n";
    catalogue += "</div>\n";
    catalogue += "</div>\n";
    return catalogue;
}
