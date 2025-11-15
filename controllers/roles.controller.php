<?php
/* CONTROLADOR DE ROLES */

// error_reporting(0); 
require_once('../models/roles.models.php');

$Roles = new Roles_Model(); 

switch($_GET["op"]){

    case "todos":
        $datos = array();
        $datos = $Roles->todos();
        $todos = array(); 
        while($fila = mysqli_fetch_assoc($datos)){
            $todos[] = $fila;
        }
        echo json_encode($todos);
        break;

    case "uno":
        $idrol = $_POST["idrol"]; 
        
        $datos = array();
        $datos = $Roles->uno($idrol);
        $uno = mysqli_fetch_assoc($datos);
        
        echo json_encode($uno);
        break;

    case "insertar":
        $rnombre = $_POST["rnombre"];   
        $rdescripcion = $_POST["rdescripcion"]; 
        $datos = array();
        $datos = $Roles->insertar($rnombre, $rdescripcion);
        echo json_encode($datos); 
        break;

    case "actualizar":
        $idrol = $_POST["idrol"];
        $rnombre = $_POST["rnombre"];   
        $rdescripcion = $_POST["rdescripcion"]; 

        $datos = array();
        $datos = $Roles->actualizar($idrol, $rnombre, $rdescripcion);
        echo json_encode($datos); 
        break;

    case "eliminar":
        $idrol = $_POST["idrol"]; 

        $datos = array();
        $datos = $Roles->eliminar($idrol);
        echo json_encode($datos); 
        break;
    default:
        break;
}
?>