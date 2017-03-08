<?php
//This is the route file
session_start();
require("controller/Page.php");
$pageController = new Page;

// Routing
if (isset ($_GET ['page'])) $page = $_GET ['page'];
if (isset ($_GET ['action'])) $action = $_GET ['action']; else $action = "";
		
switch ($page) {
 	case "shoppingcart":
 		$pageController->shoppingCartPage();
		break;
	case "catalogue":
		$pageController->mainPage();
		break;
	default:
		$pageController->mainPage();
        break;
}

