class Roles {
    constructor(baseUrl) {
        this.baseUrl = baseUrl + 'roles.controller.php';
        this.container = $('#contenido-dinamico');
        this.tituloArea = $('#titulo-area');
    }

    //Cargar la tabla
    cargarTabla() {
        this.tituloArea.text('Gestor de Roles');

        $.ajax({
            url: this.baseUrl + '?op=todos',
            type: 'GET',
            dataType: 'json',
            success: (data) => {
                this.renderizarTabla(data);
            },
            error: (xhr, status, error) => {
                this.container.html('<p class="alert alert-danger">Error al cargar Roles.</p>');
            }
        });
    }

    //Renderizar tabla
    renderizarTabla(roles) {
        let html = `
            <button class="btn btn-success mb-3" id="btn-nuevo-rol">
                <i class="fas fa-plus-circle"></i> Insertar Nuevo Rol
            </button>
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
        `;
        roles.forEach(rol => {
            html += `
                <tr>
                    <td>${rol.idrol}</td>
                    <td>${rol.rnombre}</td>
                    <td>${rol.rdescripcion}</td>
                    <td>
                        <button class="btn btn-sm btn-editar-rol" data-id="${rol.idrol}">Editar</button>
                        <button class="btn btn-sm btn-danger btn-eliminar-rol" data-id="${rol.idrol}">Eliminar</button>
                    </td>
                </tr>
            `;
        });

        html += `</tbody></table>`;

        this.container.html(html);
        this.attachTableEvents();
    }

    //Eventos de tabla
    attachTableEvents() {
        $('#btn-nuevo-rol').on('click', () => {
            this.renderizarFormulario({}); 
        });

        $('.btn-editar-rol').on('click', (e) => { 
            const id = $(e.currentTarget).data('id'); 
            this.editarRol(id); 
        });

        $('.btn-eliminar-rol').on('click', (e) => { 
            const id = $(e.currentTarget).data('id'); 
            this.eliminarRol(id); 
        });
    }

    //Renderizar formulario
    renderizarFormulario(rol = {}) {
        const isEditing = rol.idrol !== undefined;
        const title = isEditing ? 'Editar Rol ID: ' + rol.idrol : 'Insertar Nuevo Rol';
        const btnText = isEditing ? 'Guardar Cambios' : 'Registrar Rol';

        let html = `
            <h2>${title}</h2>
            <a href="#" class="btn btn-secondary mb-3" id="btn-volver-roles">← Volver al Listado</a>
            <form id="formulario-rol">
                <input type="hidden" id="idrol" name="idrol" value="${rol.idrol || ''}">
                
                <div class="mb-3">
                    <label for="rnombre" class="form-label">Nombre</label>
                    <input type="text" class="form-control" id="rnombre" name="rnombre" 
                            value="${rol.rnombre || ''}" required>
                </div>
                
                <div class="mb-3">
                    <label for="rdescripcion" class="form-label">Descripción</label>
                    <input type="text" class="form-control" id="rdescripcion" name="rdescripcion" 
                            value="${rol.rdescripcion || ''}" required>
                </div>
                
                <button type="submit" class="btn btn-primary" id="btn-guardar-rol">
                    ${btnText}
                </button>
            </form>
        `;

        this.container.html(html);
        this.handleFormSubmit();

        $('#btn-volver-roles').on('click', (e) => {
            e.preventDefault();
            this.cargarTabla();
        });
    }

    //Editar roles (obtencion del rol)
    editarRol(id) {
        $.ajax({
            url: this.baseUrl + '?op=uno',
            type: 'POST',
            data: { idrol: id }, 
            dataType: 'json',
            success: (data) => {
                if (data && data.idrol) { 
                    this.renderizarFormulario(data);
                } else {
                    alert('No se encontraron datos para el ID del rol: ' + id);
                }
            },
            error: (xhr, status, error) => {
                console.error("Error al obtener datos del rol ID " + id + ":", error);
                alert('Error al cargar los datos de edición.');
            }
        });
    }

    //Eliminar roles
    eliminarRol(id) {
        if (confirm(`¿Está seguro de eliminar el Rol ID: ${id}? Esta acción es irreversible.`)) {
            $.post(this.baseUrl + '?op=eliminar', { idrol: id }, (response) => {
                const success = (response === true || response === 1);

                if (success) {
                    alert('Rol eliminado con éxito.');
                    this.cargarTabla(); 
                } else {
                    alert(`Error al eliminar el rol. Respuesta: ${response}`);
                }
            }, 'json').fail(() => {
                alert("Error de conexión o respuesta no JSON al eliminar.");
            });
        }
    }


    //Envio de datos
    handleFormSubmit() {
        $('#formulario-rol').on('submit', (e) => {
            e.preventDefault();

            const idrol = $('#idrol').val();
            const operation = idrol ? 'actualizar' : 'insertar';
            const urlController = this.baseUrl + '?op=' + operation;

            let postData = {
                rnombre: $('#rnombre').val(),
                rdescripcion: $('#rdescripcion').val(),
            };

            if (idrol) {
                postData.idrol = idrol;
            }

            $.post(urlController, postData, (response) => {
                const success = (response === true || response === 1);

                if (success) {
                    alert(`Rol ${operation === 'insertar' ? 'registrado' : 'actualizado'} con éxito.`);
                    this.cargarTabla(); 
                } else {
                    alert(`Error al ${operation === 'insertar' ? 'insertar' : 'actualizar'} el rol. Respuesta: ${response}`);
                }
            }, 'json').fail(() => {
                alert("Datos repetidos o error de conexión. Verifique que el nombre sea único.");
            });
        });
    }
}