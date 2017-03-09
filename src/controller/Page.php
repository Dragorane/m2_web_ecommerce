<?php

class Page {
    
    public function __construct()
    {
       
    }
    
    public function mainPage()
    {
        require("view/header.html");
        echo "<div class='row'>";
        echo "<p>Home > Design</p>";
        echo "<h1>Design</h1>";
        echo "</div>";
        echo "<div class='row'>";
        echo "<div class='col-md-3'>";
        require("view/border_left.html");
        echo "</div>";
        echo "<div class='col-md-9'>";
        require("view/catalogue.html");
        echo "</div>";
        echo "</div>";
        require("view/footer.html");
        echo "<script src='js/catalogue.js'></script>";
    }
    
    public function shoppingCartPage(){
        require("view/header.html");
        echo "<div class='row'>";
        echo "<p>Home > Shopping Cart</p>";
        echo "<h1>Shopping Cart</h1>";
        echo "</div>";
        echo "<div class='row'>";
        echo " <div class='table-responsive'>";
        echo "<table id='shoppingCartTable' class='table'>";
        echo "<tr><th>Item Name</th><th>Price</th><th>Quantity</th><th>SubTotal</th><th></th></tr>";
        echo "</table>";
        echo "</div>";
        echo "</div>";
        echo "<div class='row'>";
        echo "<div class='alert alert-success'><strong><span id='addedproduct'>!Product!</span> has been successfully added to your shopping cart.</strong></div>";
        echo "</div>";
        echo "<div class='row'>";
        echo "<div class='col-md-4'>";
        require("view/shoppingcart/estimateShippingForm.html");
        echo "</div>";
        echo "<div class='col-md-4'>";
        require("view/shoppingcart/discountCouponForm.html");
        echo "</div>";
        echo "<div class='col-md-4'>";
        require("view/shoppingcart/orderTotalForm.html");
        echo "</div>";
        echo "</div>";
        require("view/footer.html");
    }

}
