var checkedBrand = {}; //global var to brand filter

function reloadPage(filter) {
    $.ajax({
        url: "js/product.json",
        type: 'GET',
        dataType: 'json',
        success: function(json) {
            var $data = json; //content of our json products
            var cpt = 0; //counting our articles
            var arrayCategories = {}; //array to stock categorie
            var htmlCategories = ""; //var to stock html code for categorie
            var arraySubCategories = {};
            var arrayBrand = {};
            var htmlBrand = "";
            var arrayColor = {};
            var htmlColor = "";
            var htmlCatalog = "<div class='row'>\n"; //catalogue : html
            for (let article of $data) {
                arrayCategories = buildKV(arrayCategories, article["categorie"]);
                arrayBrand = buildKV(arrayBrand, article["brand"]);
                arrayColor = buildKV(arrayColor, article["color"]);
                if (filter !== null) {
                    switch (filter.type) {
                        case "search":
                            if (article["title"].includes(filter.value)) {
                                htmlCatalog = buildArticle(htmlCatalog, article, cpt);
                                cpt = cpt + 1;
                            }
                            break;
                        case "color":
                            if (article["color"] === filter.value) {
                                htmlCatalog = buildArticle(htmlCatalog, article, cpt);
                                cpt = cpt + 1;
                            }
                            break;
                        case "brand":
                            console.log("ça passe ! brand : " + article["brand"] + " value : " + checkedBrand[article["brand"]]);
                            if (checkedBrand[article["brand"]] === 1) {
                                htmlCatalog = buildArticle(htmlCatalog, article, cpt);
                                cpt = cpt + 1;
                            }
                    }
                }
                else {
                    if (localStorage.getItem("categorieFilter") !== null) {
                        categoriesFilter(htmlCatalog, article, cpt);
                        if (localStorage.getItem("categorieFilter") === article["categorie"]) {
                            if (localStorage.getItem("subCategorieFilter") !== null) {
                                if (localStorage.getItem("subCategorieFilter") === article["sub_categorie"]) {
                                    htmlCatalog = buildArticle(htmlCatalog, article, cpt);
                                    cpt = cpt + 1;
                                }
                            }
                            else {
                                htmlCatalog = buildArticle(htmlCatalog, article, cpt);
                                cpt = cpt + 1;
                            }
                            arraySubCategories = buildKV(arraySubCategories, article["sub_categorie"]);
                        }
                    }
                    else {
                        htmlCatalog = buildArticle(htmlCatalog, article, cpt);
                        cpt = cpt + 1;
                    }
                }
            }
            htmlCatalog += "</div>\n";
            htmlCategories = printCategories(arrayCategories, arraySubCategories);
            htmlBrand = printBrand(arrayBrand);
            htmlColor = printColor(arrayColor);
            $("#products_catalogue").html(htmlCatalog);
            $("#cpt_items").html(cpt);
            $("#categoriesSelection").html(htmlCategories);
            $("#brandSelection").html(htmlBrand);
            $("#colorSelection").html(htmlColor);
            if (localStorage.getItem("itemInSc") === null) {
                $("#itemInSC").html("0");
            }
            else {
                $("#itemInSC").html(localStorage.getItem("itemInSc"));
            }
        }
    });
}


function buildKV(array, key) {
    if (typeof array[key] === 'undefined') {
        array[key] = 1;
    }
    else {
        array[key] = array[key] + 1;
    }
    return array;
}

function categoriesFilter(htmlCatalog, article, cpt) {

}

function printColor(arrayColor) {
    var htmlColor = "";
    for (var key in arrayColor) {
        let value = arrayColor[key];
        htmlColor += "<div class='color_selector " + key + "' name='" + key + "' onclick='colorSelection(\"" + key + "\")'></div>"
    }
    return htmlColor;
}

function printBrand(arrayBrand) {
    var htmlBrand = "<form><div class='checkbox'>";
    for (var key in arrayBrand) {
        let value = arrayBrand[key];
        htmlBrand += "<label>";
        if (checkedBrand[key] === 1) {
            htmlBrand += "<input type='checkbox' name='" + key + "' onclick='checkBrand(this)' checked='checked'>" + key + " (" + value + ")";
        }
        else {
            htmlBrand += "<input type='checkbox' name='" + key + "' onclick='checkBrand(this)'>" + key + " (" + value + ")";
        }
        htmlBrand += "</label><br/>";
    }
    htmlBrand += "</div></form>";
    return htmlBrand;
}

function printCategories(arrayCategories, arraySubCategories) {
    var htmlCategories = "<ul class='list-unstyled'>";
    for (var key in arrayCategories) {
        let value = arrayCategories[key];
        if (localStorage.getItem("categorieFilter") === null) {
            htmlCategories += "<li onclick=\"articleInCategorie('" + key + "')\">" + key + " (" + value + ")</li>";
        }
        else {
            if (localStorage.getItem("categorieFilter") !== key) {
                htmlCategories += "<li onclick=\"articleInCategorie('" + key + "')\">" + key + " (" + value + ")</li>";
            }
            else {
                htmlCategories += "<li class='selectedCategory' onclick=\"articleInCategorie('" + key + "')\">" + key + " (" + value + ")</li>";
                htmlCategories += "<ul class='list-unstyled'>";
                for (var subKey in arraySubCategories) {
                    let subValue = arraySubCategories[subKey];
                    if (localStorage.getItem("subCategorieFilter") !== subKey) {
                        htmlCategories += "<li class='subCategory' onclick=\"articleInSubCategorie('" + subKey + "')\">" + subKey + " (" + subValue + ")</li>";
                    }
                    else {
                        htmlCategories += "<li class='subCategory selectedCategory' onclick=\"articleInSubCategorie('" + subKey + "')\">" + subKey + " (" + subValue + ")</li>";
                    }
                }
                htmlCategories += "</ul>";
            }
        }
    }
    htmlCategories += "</ul>";
    return htmlCategories;
}

function articleInCategorie(categorie) {
    localStorage.removeItem("subCategorieFilter");
    localStorage.setItem("categorieFilter", categorie);
    reloadPage(null);
}

function articleInSubCategorie(categorie) {
    localStorage.setItem("subCategorieFilter", categorie);
    reloadPage(null);
}

function searchBarController() {
    var newSearch = {
        value: $("#searchBarCatalog").val(),
        type: "search"
    };
    if (newSearch.value === "") {
        reloadPage(null);
    }
    else {
        reloadPage(newSearch);
    }
}

function colorSelection(color) {
    var colorSearch = {
        value: color,
        type: "color"
    };
    reloadPage(colorSearch);
}

function checkBrand(input) {
    var brandSearch = {
        value: "not use for brand",
        type: "brand"
    };
    if (input.checked) {
        checkedBrand[input.name] = 1;
    }
    else {
        checkedBrand[input.name] = 0;
    }
    reloadPage(brandSearch);
}

function buildArticle(catalogue, article, cpt) {
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
        var promo = parseInt(article["price"]) * article["promo"] / 100
        var resultat = parseInt(article["price"]) - parseInt(promo);
        catalogue += "<span class='price_catolgue'><span class='price_catalogue_1'>" + article["price"] + "$</span> <span class='price_catalogue_2'>" + resultat + "$</span></span>\n";
    }
    else {
        catalogue += "<span class='price_catolgue'>" + article["price"] + "$</span>\n";
    }
    catalogue += "<div class='article_button'>\n";
    catalogue += " <img src='ressources/img-11.png' class='subimg-article-catalogue' onclick=\"addArticleToSC(" + article["id"] + ",1)\" />\n";
    catalogue += "<img src='ressources/img-12.png' class='subimg-article-catalogue' />\n";
    catalogue += " <img src='ressources/img-13.png' class='subimg-article-catalogue' />\n";
    catalogue += "</div>\n";
    catalogue += "</div>\n";
    catalogue += "</div>\n";
    return catalogue;
}

function addArticleToSC(id, quantity) {
    var newquantity = 0;
    if (localStorage.getItem(id) === null) {
        localStorage.setItem(id, quantity);
    }
    else {
        quantity = localStorage.getItem(id);
        newquantity = parseInt(quantity) + 1
        localStorage.removeItem(id);
        localStorage.setItem(id, newquantity);
    }
    var article = "";
    localStorage.setItem("newProduct", id);
    document.location.href = "?page=shoppingcart"
}

reloadPage(null);
