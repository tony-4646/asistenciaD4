<?php
/* CONTROLADOR DE REGISTROS*/

// error_reporting(0); 
require_once('../models/registros.models.php');

$Registros = new Registros_Model();

switch($_GET["op"]){

    case "todos":
        $datos = array();
        $datos = $Registros->todos();
        $todos = array(); 
        while($fila = mysqli_fetch_assoc($datos)){
            $todos[] = $fila;
        }
        echo json_encode($todos);
        break;

    case "uno":
        $idregistro = $_POST["idregistro"]; 
        
        $datos = array();
        $datos = $Registros->uno($idregistro);
        $uno = mysqli_fetch_assoc($datos);
        
        echo json_encode($uno);
        break;


    case "insertar":
        $idmiembro = $_POST["idmiembro"]; 

        $datos = array();
        $datos = $Registros->insertar($idmiembro);
        
        echo json_encode($datos); 
        break;


    case "salida":
        $idregistro = $_POST["idregistro"]; 

        $datos = array();
        $datos = $Registros->salida($idregistro);
        echo json_encode($datos); 
        break;

    default:
        break;
}
?>