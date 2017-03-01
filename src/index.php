<?php
//This is the route file
session_start();
require("controller/Catalogue.php");
$catalogueController = new Catalogue;

// Routing
if (isset ($_GET ['page'])) $page = $_GET ['page'];
if (isset ($_GET ['action'])) $action = $_GET ['action']; else $action = "";
		
switch ($page) {
 	case "shopping_cart":
 		require("php/$page.php");
		break;
	case "catalogue":
		$catalogueController->mainPage();
		break;
	default:
		$catalogueController->mainPage();
        break;
}

