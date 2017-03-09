$.ajax({
    url: "js/product.json",
    type: 'GET',
    dataType: 'json',
    success: function(json) {
        var $data = json;
        console.log($data);
        console.log($data[0]["age"]);
        var cpt = 0;
        var catalogue = "<div class='row'>\n";
        for (let article of $data) {
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
                var promo= parseInt(article["price"])*parseInt(article["price"])/100
                var resultat=parseInt(article["price"]) - parseInt(promo);
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
            cpt = cpt + 1;
        }
        catalogue += "</div>\n";
         $("#products_catalogue").html(catalogue);
         $("#cpt_items").html(cpt);
    }

});
