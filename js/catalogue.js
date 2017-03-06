$.ajax({
    url: "js/product.json",
    type: 'GET',
    dataType: 'json',
    success: function (json) {
    var $data=json;
    console.log($data);
    console.log($data[0]["age"]);
    updateCatalogue($data);
    }
});

function updateCatalogue(data){
        console.log(data[1]["name"]);
}
console.log("coucou ?");
