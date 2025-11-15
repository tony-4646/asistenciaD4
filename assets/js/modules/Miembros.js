class Miembros {
    constructor(baseUrl) {
        this.baseUrl = baseUrl + 'miembros.controller.php';
        this.container = $('#contenido-dinamico');
        this.tituloArea = $('#titulo-area');
        this.rolesControllerUrl = baseUrl + 'roles.controller.php'; 
    }

    //Cargar la tabla
    cargarTabla() {
        this.tituloArea.text('Gestor de Miembros');

        $.ajax({
            url: this.baseUrl + '?op=todos',
            type: 'GET',
            dataType: 'json',
            success: (data) => {
                this.renderizarTabla(data);
            },
            error: () => {
                this.container.html('<p class="alert alert-danger">Error al cargar Miembros.</p>');
            }
        });
    }

    //Renderizar tabla
    renderizarTabla(miembros) {
        let html = `
            <button class="btn btn-success mb-3" id="btn-nuevo-miembro">
                <i class="fas fa-user-plus"></i> Insertar Nuevo Miembro
            </button>
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Rol</th>
                        <th>Nombres</th>
                        <th>Apellidos</th>
                        <th>Teléfono</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
        `;

        miembros.forEach(miembro => {           
            html += `
                <tr>
                    <td>${miembro.idmiembro}</td>
                    <td>${miembro.rol}</td>
                    <td>${miembro.mnombres}</td>
                    <td>${miembro.mapellidos}</td>
                    <td>${miembro.mtelefono}</td>
                    <td>
                        <button class="btn btn-sm btn-editar-miembro" data-id="${miembro.idmiembro}">Editar</button>
                        <button class="btn btn-sm btn-danger btn-eliminar-miembro" data-id="${miembro.idmiembro}">Eliminar</button>
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
        $('#btn-nuevo-miembro').on('click', () => {
            this.fetchRolesAndRenderForm({}); 
        });

        $('.btn-editar-miembro').on('click', (e) => { 
            const id = $(e.currentTarget).data('id'); 
            this.editarMiembro(id); 
        });

        $('.btn-eliminar-miembro').on('click', (e) => { 
            const id = $(e.currentTarget).data('id'); 
            this.eliminarMiembro(id); 
        });
    }

    //Lista de roles antes de renderizar formulario
    fetchRolesAndRenderForm(miembro) {
        $.ajax({
            url: this.rolesControllerUrl + '?op=todos',
            type: 'GET',
            dataType: 'json',
            success: (rolesData) => {
                this._renderForm(miembro, rolesData);
            },
            error: () => {
                this.container.html('<p class="alert alert-danger">Error: No se pudo cargar la lista de Roles para el formulario.</p>');
            }
        });
    }

    //Renderizar formulario 
    _renderForm(miembro = {}, rolesData) {
        const isEditing = miembro.idmiembro !== undefined;
        const title = isEditing ? 'Editar Miembro ID: ' + miembro.idmiembro : 'Insertar Nuevo Miembro';
        const btnText = isEditing ? 'Guardar Cambios' : 'Registrar Miembro';

        let rolesOptions = rolesData.map(rol => {
            const selected = (miembro.idrol == rol.idrol) ? 'selected' : '';
            return `<option value="${rol.idrol}" ${selected}>${rol.rnombre}</option>`;
        }).join('');
        
        rolesOptions = `<option value="">Sin Rol Asignado</option>` + rolesOptions;


        let html = `
            <h2>${title}</h2>
            <a href="#" class="btn btn-secondary mb-3" id="btn-volver-miembros">← Volver al Listado</a>
            <form id="formulario-miembro">
                <input type="hidden" id="idmiembro" name="idmiembro" value="${miembro.idmiembro || ''}">
                
                <div class="mb-3">
                    <label for="idrol" class="form-label">Rol</label>
                    <select class="form-control" id="idrol" name="idrol">
                        ${rolesOptions}
                    </select>
                </div>

                <div class="mb-3">
                    <label for="mnombres" class="form-label">Nombres</label>
                    <input type="text" class="form-control" id="mnombres" name="mnombres" 
                            value="${miembro.mnombres || ''}" required>
                </div>
                
                <div class="mb-3">
                    <label for="mapellidos" class="form-label">Apellidos</label>
                    <input type="text" class="form-control" id="mapellidos" name="mapellidos" 
                            value="${miembro.mapellidos || ''}" required>
                </div>

                <div class="mb-3">
                    <label for="mtelefono" class="form-label">Teléfono</label>
                    <input type="text" class="form-control" id="mtelefono" name="mtelefono" 
                            value="${miembro.mtelefono || ''}" required>
                </div>
                
                <button type="submit" class="btn btn-primary" id="btn-guardar-miembro">
                    ${btnText}
                </button>
            </form>
        `;

        this.container.html(html);
        this.handleFormSubmit();

        $('#btn-volver-miembros').on('click', (e) => {
            e.preventDefault();
            this.cargarTabla();
        });
    }

    //Editar miembro (obtener datos)
    editarMiembro(id) {
        $.ajax({
            url: this.baseUrl + '?op=uno',
            type: 'POST',
            data: { idmiembro: id }, 
            dataType: 'json',
            success: (data) => {
                if (data && data.idmiembro) {
                    this.fetchRolesAndRenderForm(data); 
                } else {
                    alert('No se encontraron datos para el ID del miembro: ' + id);
                }
            },
            error: (xhr, status, error) => {
                console.error("Error al obtener datos del miembro ID " + id + ":", error);
                alert('Error al cargar los datos de edición.');
            }
        });
    }

    eliminarMiembro(id) {
        if (confirm(`¿Está seguro de eliminar al Miembro ID: ${id}? Esto borrará también sus registros de asistencia (CASCADE).`)) {
            $.post(this.baseUrl + '?op=eliminar', { idmiembro: id }, (response) => {
                const success = (response === true || response === 1);

                if (success) {
                    alert('Miembro eliminado con éxito.');
                    this.cargarTabla(); 
                } else {
                    alert(`Error al eliminar el miembro. Respuesta: ${response}`);
                }
            }, 'json').fail(() => {
                alert("Error de conexión o respuesta no JSON al eliminar.");
            });
        }
    }


    //Enviar datos
    handleFormSubmit() {
        $('#formulario-miembro').on('submit', (e) => {
            e.preventDefault();

            const idmiembro = $('#idmiembro').val();
            const operation = idmiembro ? 'actualizar' : 'insertar';
            const urlController = this.baseUrl + '?op=' + operation;

            let postData = {
                idrol: $('#idrol').val() || null, 
                mnombres: $('#mnombres').val(),
                mapellidos: $('#mapellidos').val(),
                mtelefono: $('#mtelefono').val(),
            };

            if (idmiembro) {
                postData.idmiembro = idmiembro;
            }

            $.post(urlController, postData, (response) => {
                const success = (response === true || response === 1);

                if (success) {
                    alert(`Miembro ${operation === 'insertar' ? 'registrado' : 'actualizado'} con éxito.`);
                    this.cargarTabla(); 
                } else {
                    alert(`Error al ${operation === 'insertar' ? 'insertar' : 'actualizar'} el miembro. Respuesta: ${response}`);
                }
            }, 'json').fail(() => {
                alert("Datos repetidos (número de teléfono) o error de conexión. Asegúrese de asignar un rol al miembro.");
            });
        });
    }
}