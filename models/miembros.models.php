<?php
/* CRUD DE MIEMBROS */
require_once('../config/conexion.php');

class Miembros_Model {

    public function todos() {
        $con = new Clase_Conectar();
        $con = $con->Procedimiento_Conectar();
        $cadena = "SELECT * FROM detallemiembros";
        $stmt = $con->prepare($cadena);
        $stmt->execute();
        $datos = $stmt->get_result(); 
        $con->close();
        return $datos; 
    }

    public function uno($idmiembro) {
        $con = new Clase_Conectar();
        $con = $con->Procedimiento_Conectar();
        $cadena = "SELECT * FROM miembros WHERE idmiembro = ?";
        $stmt = $con->prepare($cadena);
        $stmt->bind_param('i', $idmiembro); 
        $stmt->execute();
        $datos = $stmt->get_result();
        $con->close();
        return $datos; 
    }

    public function insertar($idrol, $mnombres, $mapellidos, $mtelefono) {
        $con = new Clase_Conectar();
        $con = $con->Procedimiento_Conectar();     
        $cadena = "INSERT INTO miembros(idrol, mnombres, mapellidos, mtelefono) VALUES (?, ?, ?, ?)"; 
        $stmt = $con->prepare($cadena);
        $stmt->bind_param('isss', $idrol, $mnombres, $mapellidos, $mtelefono);
        $resultado = $stmt->execute();
        $con->close();    
        return $resultado; 
    }

    public function actualizar($idmiembro, $idrol, $mnombres, $mapellidos, $mtelefono) {
        $con = new Clase_Conectar();
        $con = $con->Procedimiento_Conectar();
        $cadena = "UPDATE miembros SET idrol = ?, mnombres = ?, mapellidos = ?, mtelefono = ? WHERE idmiembro = ?";      
        $stmt = $con->prepare($cadena);
        $stmt->bind_param('isssi', $idrol, $mnombres, $mapellidos, $mtelefono, $idmiembro); 
        $resultado = $stmt->execute();
        $con->close();
        return $resultado; 
    }

    public function eliminar($idmiembro) {
        $con = new Clase_Conectar();
        $con = $con->Procedimiento_Conectar();
        $cadena = "DELETE FROM miembros WHERE idmiembro = ?";      
        $stmt = $con->prepare($cadena);
        $stmt->bind_param('i', $idmiembro);
        $resultado = $stmt->execute();
        $con->close();
        return $resultado; 
    }
}
?>