$(document).ready(function() {
    
    const BASE_URL = '/tareasAD/asistenciaD4/controllers/';
    const rolesModule = new Roles(BASE_URL);
    const miembrosModule = new Miembros(BASE_URL);
    const registrosModule = new Registros(BASE_URL);
    
    $('#btn-roles').on('click', function(e) {
        e.preventDefault();
        rolesModule.cargarTabla(); 
    });

    $('#btn-miembros').on('click', function(e) {
        e.preventDefault();
        miembrosModule.cargarTabla();
    });
    
    $('#btn-registros').on('click', function(e) {
        e.preventDefault();
        registrosModule.cargarTabla();
    });

});