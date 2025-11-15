<?php
/* CONTROLADOR DE MIEMBROS */

// error_reporting(0); 
require_once('../models/miembros.models.php');

$Miembros = new Miembros_Model();

switch($_GET["op"]){

    case "todos":
        $datos = array();
        $datos = $Miembros->todos();
        $todos = array(); 
        while($fila = mysqli_fetch_assoc($datos)){
            $todos[] = $fila;
        }
        echo json_encode($todos);
        break;

    case "uno":
        $idmiembro = $_POST["idmiembro"]; 
        
        $datos = array();
        $datos = $Miembros->uno($idmiembro);
        $uno = mysqli_fetch_assoc($datos);
        
        echo json_encode($uno);
        break;

    case "insertar":
        $idrol = $_POST["idrol"]; 
        $mnombres = $_POST["mnombres"];   
        $mapellidos = $_POST["mapellidos"]; 
        $mtelefono = $_POST["mtelefono"]; 

        $datos = array();
        $datos = $Miembros->insertar($idrol, $mnombres, $mapellidos, $mtelefono);
        
        echo json_encode($datos);
        break;

    case "actualizar":
        $idmiembro = $_POST["idmiembro"];
        $idrol = $_POST["idrol"];
        $mnombres = $_POST["mnombres"];   
        $mapellidos = $_POST["mapellidos"]; 
        $mtelefono = $_POST["mtelefono"]; 

        $datos = array();
        $datos = $Miembros->actualizar($idmiembro, $idrol, $mnombres, $mapellidos, $mtelefono);
        echo json_encode($datos);
        break;

    case "eliminar":
        $idmiembro = $_POST["idmiembro"]; 

        $datos = array();
        $datos = $Miembros->eliminar($idmiembro);
        echo json_encode($datos);
        break;

    default:
        break;
}
?>