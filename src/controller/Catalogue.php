<?php

class Catalogue {
    
    public function __construct()
    {
       
    }
    
    public function mainPage()
    {
        require("view/header.html");
        echo "<div class='row'>";
        echo "<div class='col-md-3'>";
        require("view/border_left.html");
        echo "</div>";
        echo "<div class='col-md-9'>";
        require("view/catalogue.html");
        echo "</div>";
        echo "</div>";
        require("view/footer.html");
    }

}
