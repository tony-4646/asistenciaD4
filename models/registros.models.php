<?php
/* CRUD (adaptado a la lógica de negocio) DE REGISTROS*/
require_once('../config/conexion.php');

class Registros_Model {

    public function todos() {
        $con = new Clase_Conectar();
        $con = $con->Procedimiento_Conectar();
        $cadena = "SELECT * FROM detalleregistros";
        $stmt = $con->prepare($cadena);
        $stmt->execute();
        $datos = $stmt->get_result(); 
        $con->close();
        return $datos; 
    }

    public function uno($idregistro) {
        $con = new Clase_Conectar();
        $con = $con->Procedimiento_Conectar();
        $cadena = "SELECT * FROM registros WHERE idregistro = ?";
        $stmt = $con->prepare($cadena);
        $stmt->bind_param('i', $idregistro); 
        $stmt->execute();
        $datos = $stmt->get_result();
        $con->close();
        return $datos; 
    }

    public function insertar($idmiembro) {
        $con = new Clase_Conectar();
        $con = $con->Procedimiento_Conectar();     
        $cadena = "INSERT INTO registros(idmiembro, rfecha, ringreso, rsalida) VALUES (?, CURDATE(), CURTIME(), NULL)"; 
        $stmt = $con->prepare($cadena);
        $stmt->bind_param('i', $idmiembro);
        $resultado = $stmt->execute();
        $con->close();    
        return $resultado; 
    }

    public function salida($idregistro) {
        $con = new Clase_Conectar();
        $con = $con->Procedimiento_Conectar();
        $cadena = "UPDATE registros SET rsalida = CURTIME() WHERE idregistro = ?";      
        $stmt = $con->prepare($cadena);
        $stmt->bind_param('i', $idregistro); 
        $resultado = $stmt->execute();
        $con->close();
        return $resultado; 
    }
}
?>