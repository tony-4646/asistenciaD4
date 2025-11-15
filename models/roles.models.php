<?php
/* CRUD DE ROLES */
require_once('../config/conexion.php');

class Roles_Model {

    public function todos() {
        $con = new Clase_Conectar();
        $con = $con->Procedimiento_Conectar();
        $cadena = "SELECT * FROM roles";
        $stmt = $con->prepare($cadena);
        $stmt->execute();
        $datos = $stmt->get_result(); 
        $con->close();
        return $datos; 
    }

    public function uno($idrol) {
        $con = new Clase_Conectar();
        $con = $con->Procedimiento_Conectar();
        $cadena = "SELECT * FROM roles WHERE idrol = ?";
        $stmt = $con->prepare($cadena);
        $stmt->bind_param('i', $idrol); 
        $stmt->execute();
        $datos = $stmt->get_result();
        $con->close();
        return $datos; 
    }

    public function insertar($rnombre, $rdescripcion) {
        $con = new Clase_Conectar();
        $con = $con->Procedimiento_Conectar();     
        $cadena = "INSERT INTO roles(rnombre, rdescripcion) VALUES (?, ?)"; 
        $stmt = $con->prepare($cadena);
        $stmt->bind_param('ss', $rnombre, $rdescripcion);
        $resultado = $stmt->execute();
        $con->close();    
        return $resultado; 
    }

    public function actualizar($idrol, $rnombre, $rdescripcion) {
        $con = new Clase_Conectar();
        $con = $con->Procedimiento_Conectar();
        $cadena = "UPDATE roles SET rnombre = ?, rdescripcion = ? WHERE idrol = ?";      
        $stmt = $con->prepare($cadena);
        $stmt->bind_param('ssi', $rnombre, $rdescripcion, $idrol); 
        $resultado = $stmt->execute();
        $con->close();
        return $resultado; 
    }

    public function eliminar($idrol) {
        $con = new Clase_Conectar();
        $con = $con->Procedimiento_Conectar();
        $cadena = "DELETE FROM roles WHERE idrol = ?";      
        $stmt = $con->prepare($cadena);
        $stmt->bind_param('i', $idrol); 
        $resultado = $stmt->execute();
        $con->close();
        return $resultado; 
    }
}
?>