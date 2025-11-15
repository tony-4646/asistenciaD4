<?php

/* CONEXION BD */

class Clase_Conectar{
    public $conexion;
    protected $db;
    private $host= 'localhost';
    private $uid = 'root';
    private $pwd='';
    private $database='ad_asistencia';

    public function Procedimiento_Conectar(){
        $this->conexion = mysqli_connect( $this->host,  $this->uid,  $this->pwd);
        
        if(mysqli_connect_errno()){ 
            die("Error al conectarse con MySQL: " . mysqli_connect_error());
        }

        mysqli_query($this->conexion,"SET NAMES utf8");
        
        $this->db = mysqli_select_db($this->conexion, $this->database);
        
        if($this->db == 0) {
            die("Error al conectar con la base de datos: " . mysqli_error($this->conexion));
        }
        return $this->conexion;
    }
}
?>
