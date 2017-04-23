var checkedBrand = {}; //global var for brand filter

//main function to full reload the interface
//@param filter : if filter==1 then remove filter (example : first loading of interface)
function reloadPage(filter) {
    //Get our data
    $.ajax({
        url: "js/product.json",
        type: 'GET',
        dataType: 'json',
        success: function(json) {
            var $data = json;           //content of our json products
            var cpt = 0;                //counting our articles
            var arrayCategories = {};   //array to stock categorie's data
            var arraySubCategories = {};//array to stock subcategorie's data
            var htmlCategories = "";    //var to stock html code for categorie and subcategorie
            var arrayBrand = {};        //array to stock brand's data
            var htmlBrand = "";         //array to stock brand's html
            var arrayColor = {};        //array to stock color's data
            var htmlColor = "";         //array to stock color's html
            var htmlCatalog = "<div class='row newCatalogLine'>\n";                     //variable to stock catalogue's html
            for (let article of $data) {
                arrayCategories = buildKV(arrayCategories, "All");                      //add "all" at the top of our categorie
                arrayCategories = buildKV(arrayCategories, article["categorie"]);       //add each categorie in our array
                arrayBrand = buildKV(arrayBrand, article["brand"]);                     //add each brand in our array
                arrayColor = buildKV(arrayColor, article["color"]);                     //add each color in our array
                var searchFilter = filterSearch(article["title"]);                      //apply search filter
                var categoryFilter = filterCategorie(article["categorie"], article["sub_categorie"], arraySubCategories); //apply categorie filter
                var subCategorieFilter = filterSubCategorie(article["sub_categorie"]);  //apply subcategorie filter
                if (filter !== 1) {     //remove every filter if user doesn't use them
                    initBrand(article["brand"]);
                    searchFilter = true;
                    categoryFilter.show = true;
                    subCategorieFilter = true;
                }
                arraySubCategories = categoryFilter.subcat;                             //get subcategories's array
                var colorFilter = filterColor(article["color"]);                        //apply filter color
                var priceFilter = filterPrice(article["price"]);                        //apply price filter
                var brandFilter = filterBrand(article["brand"]);                        //apply brand filter
                //chekc the boolean return of each filter, if everyone is true : print the article.
                if (brandFilter === true && colorFilter === true && priceFilter === true & searchFilter === true && categoryFilter.show === true && subCategorieFilter === true) {
                    htmlCatalog = buildArticle(htmlCatalog, article, cpt);              //add article inside our catalogue
                    cpt = cpt + 1;
                }
            }
            htmlCatalog += "</div>\n";
            //Print each element in our interface
            htmlCategories = printCategories(arrayCategories, arraySubCategories);
            htmlBrand = printBrand(arrayBrand);
            htmlColor = printColor(arrayColor);
            $("#products_catalogue").html(htmlCatalog);
            $("#cpt_items").html(cpt);
            $("#categoriesSelection").html(htmlCategories);
            $("#brandSelection").html(htmlBrand);
            $("#colorSelection").html(htmlColor);
            //actualize countor of article in shopping cart
            if (localStorage.getItem("itemInSc") === null) {
                $("#itemInSC").html("0");
            }
            else {
                $("#itemInSC").html(localStorage.getItem("itemInSc"));
            }
        }
    });
}

function initBrand(brand) {
    checkedBrand[brand] = 1;
}

function filterBrand(brand) {
    var showArticle = false;
    if ((checkedBrand[brand] === 1) || checkedBrand[brand] === "undefined") {
        showArticle = true;
    }
    return showArticle;

}

function filterColor(color) {
    var showArticle = false;
    if ((localStorage.getItem("colorFilter") === "undefined") || (localStorage.getItem("colorFilter") === null)) {
        showArticle = true;
    }
    else {
        if (localStorage.getItem("colorFilter") === color) {
            showArticle = true;
        }
    }
    return showArticle;

}

function filterPrice(price) {
    var showArticle = false;
    var min = localStorage.getItem("priceFilterMin");
    var max = localStorage.getItem("priceFilterMax");
    if ((min === "undefined") || (max === "undefined") || (min === null) || (max === null)) {
        showArticle = true;
    }
    else {
        if ((parseInt(price) >= parseInt(min)) && (parseInt(price) <= parseInt(max))) {
            showArticle = true;
        }
    }
    return showArticle;
}


function filterSearch(title) {
    var showArticle = false;
    if ((localStorage.getItem("filter_search") === "undefined") || (localStorage.getItem("filter_search") === null)) {
        showArticle = true;
    }
    else {
        if (title.includes(localStorage.getItem("filter_search"))) {
            showArticle = true;
        }
    }
    return showArticle;
}

function filterCategorie(categorie, subCategorie, arraySubCategories) {
    var showArticle = false;
    if (localStorage.getItem("categorieFilter") === "undefined") {
        localStorage.setItem("categorieFilter", "All");
    }
    if (localStorage.getItem("categorieFilter") === categorie) {
        showArticle = true;
        arraySubCategories = buildKV(arraySubCategories, subCategorie);
    }
    if (localStorage.getItem("categorieFilter") === "All") {
        showArticle = true;
    }
    return {
        show: showArticle,
        subcat: arraySubCategories
    };
}

function filterSubCategorie(subCategory) {
    var showArticle = false;
    if ((localStorage.getItem("subCategorieFilter") === "undefined") || (localStorage.getItem("subCategorieFilter") === null)) {
        showArticle = true;
    }
    else {
        if (localStorage.getItem("subCategorieFilter") === subCategory) {
            showArticle = true;
        }
    }
    return showArticle;
}

/*Catalog's filter function*/

function articleInCategorie(categorie) {
    localStorage.removeItem("subCategorieFilter");
    localStorage.setItem("categorieFilter", categorie);
    reloadPage(1);
}

function articleInSubCategorie(categorie) {
    localStorage.setItem("subCategorieFilter", categorie);
    reloadPage(1);
}

function searchBarController() {
    var search = $("#searchBarCatalog").val();
    if (search === "") {
        localStorage.removeItem("filter_search");
    }
    else {
        localStorage.setItem("filter_search", search);

    }
    reloadPage(1);
}

function colorSelection(color) {
    if (color === localStorage.getItem("colorFilter")) {
        localStorage.removeItem("colorFilter");
    }
    else {
        localStorage.setItem("colorFilter", color);
    }
    reloadPage(1);
}

function checkBrand(input) {
    if (input.checked) {
        checkedBrand[input.name] = 1;
    }
    else {
        checkedBrand[input.name] = 0;
    }
    reloadPage(1);
}

/*Kvstore function*/

//function to build a kvstore from a js array
//@param array : our kvstore
//@param key : our kvstore's key
//@return array : our kvstore with new value.
function buildKV(array, key) {
    if (typeof array[key] === 'undefined') {
        array[key] = 1;
    }
    else {
        array[key] = array[key] + 1;
    }
    return array;
}

/*======= HTML generator functions ========*/

//function printColor : use to print color filter (htmlbuilder)
//@param arrayColor :  color's array data
//@return htmlColor : variable which contain color's html
function printColor(arrayColor) {
    var htmlColor = "";
    for (var key in arrayColor) {
        let value = arrayColor[key];
        if (localStorage.getItem("colorFilter") === key) {
            htmlColor += "<div class='active_color_selector " + key + "' name='" + key + "' onclick='colorSelection(\"" + key + "\")'></div>"
        }
        else {
            htmlColor += "<div class='color_selector " + key + "' name='" + key + "' onclick='colorSelection(\"" + key + "\")'></div>"
        }
    }
    return htmlColor;
}

//function printBrand : use to print brand filter (htmlbuilder)
//@param arrayBrand : brand's array data
//@return htmlBrand : variable which contain brand's html
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

//function printCategories : use to print categorie and subcategorie filter (htmlbuilder)
//@param arrayCategories : categories's data array
//@param arraySubCategories : subcategories's data array
//@return htmlCategories : variable which contain categories's html
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

//function buildArticle : use to print an article on our interface
//@param catalogue : html's catalogue
//@param article : article's data
//@param cpt : article's number, use to begin a new line
//@return : catalogue's html variable
function buildArticle(catalogue, article, cpt) {
    if ((cpt % 3) == 0) {
        catalogue += "</div>\n"
        catalogue += "<div class='row newCatalogLine'>\n"
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
    catalogue += "<img class='img-article-catalogue' src='" + article["image"] + "'/>\n";
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

//funcion : addArticleToSC for adding a new article into user's shopping cart
//@param : id : selected article's id
//@param : quantity : article's quantity added in user's shopping cart
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

//slider declaration for price filter
var priceSlider = $('#ex2').slider();
/*Slider eventListner : actualise price's filter parameter*/
priceSlider.on('slideStop', function(ev) {
    localStorage.setItem("priceFilterMin", priceSlider.data('slider').value[0]);
    localStorage.setItem("priceFilterMax", priceSlider.data('slider').value[1]);
    reloadPage(1);
});

reloadPage(null);
