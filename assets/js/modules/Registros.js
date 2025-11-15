class Registros {
    constructor(baseUrl) {
        this.baseUrl = baseUrl + 'registros.controller.php';
        this.miembrosControllerUrl = baseUrl + 'miembros.controller.php';
        this.container = $('#contenido-dinamico');
        this.tituloArea = $('#titulo-area');
    }

    // Cargar la tabla de asistencias
    cargarTabla() {
        this.tituloArea.text('Control de Asistencias');

        $.ajax({
            url: this.baseUrl + '?op=todos',
            type: 'GET',
            dataType: 'json',
            success: (data) => {
                this.renderizarTabla(data);
            },
            error: () => {
                this.container.html('<p class="alert alert-danger">Error al cargar los registros de asistencia.</p>');
            }
        });
    }

    //Renderizar tabla
    renderizarTabla(registros) {
        let html = `
            <button class="btn btn-success mb-3" id="btn-nueva-entrada">
                <i class="fas fa-sign-in-alt"></i> Registrar Entrada Manual
            </button>
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>ID Reg</th>
                        <th>Miembro</th> 
                        <th>Fecha</th>
                        <th>Ingreso</th>
                        <th>Salida</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
        `;

        registros.forEach(registro => {
            const salidaTexto = registro.rsalida ? registro.rsalida : '<span class="badge bg-info">Abierto</span>';
            let actionButton = '';
            if (!registro.rsalida) {
                actionButton = `<button class="btn btn-sm btn-info btn-marcar-salida" data-id="${registro.idregistro}">Marcar Salida</button>`;
            } else {
                actionButton = `<span class="badge bg-success">Completo</span>`;
            }

            html += `
                <tr>
                    <td>${registro.idregistro}</td>
                    <td>${registro.rmiembro}</td>
                    <td>${registro.rfecha}</td>
                    <td>${registro.ringreso}</td>
                    <td>${salidaTexto}</td>
                    <td>${actionButton}</td>
                </tr>
            `;
        });

        html += `</tbody></table>`;

        this.container.html(html);
        this.attachTableEvents();
    }

    // Eventos de tabla
    attachTableEvents() {
        $('#btn-nueva-entrada').on('click', () => {
            this.fetchMiembrosAndRenderForm();
        });

        $('.btn-marcar-salida').on('click', (e) => {
            const id = $(e.currentTarget).data('id');
            this.marcarSalida(id);
        });
    }

    //Lista de usuarios antes de renderizar formulario
    fetchMiembrosAndRenderForm() {
        $.ajax({
            url: this.miembrosControllerUrl + '?op=todos',
            type: 'GET',
            dataType: 'json',
            success: (miembrosData) => {
                this._renderForm(miembrosData);
            },
            error: () => {
                alert('Error: No se pudo cargar la lista de Miembros.');
            }
        });
    }

    // Renderizar formulario
    _renderForm(miembrosData) {
        const title = 'Registrar Nueva Entrada Manual';
        const btnText = 'Registrar Ingreso';

        let miembrosOptions = miembrosData.map(miembro => {
            return `<option value="${miembro.idmiembro}">${miembro.mnombres} ${miembro.mapellidos} (ID: ${miembro.idmiembro})</option>`;
        }).join('');

        miembrosOptions = `<option value="" disabled selected>Seleccione un Miembro</option>` + miembrosOptions;

        let html = `
            <h2>${title}</h2>
            <a href="#" class="btn btn-secondary mb-3" id="btn-volver-registros">← Volver al Listado</a>
            <p class="alert alert-info">La fecha y hora de ingreso se registrarán automáticamente con la hora actual del servidor.</p>

            <form id="formulario-entrada">
                <div class="mb-3">
                    <label for="idmiembro" class="form-label">Miembro</label>
                    <select class="form-control" id="idmiembro" name="idmiembro" required>
                        ${miembrosOptions}
                    </select>
                </div>
                
                <button type="submit" class="btn btn-primary" id="btn-guardar-entrada">
                    ${btnText}
                </button>
            </form>
        `;

        this.container.html(html);
        this.handleFormSubmit();

        $('#btn-volver-registros').on('click', (e) => {
            e.preventDefault();
            this.cargarTabla();
        });
    }


    // Marca la salida de un registro
    marcarSalida(id) {
        if (confirm(`¿Estás seguro en registrar la hora salida del miembro a esta hora?`)) {
            $.post(this.baseUrl + '?op=salida', { idregistro: id }, (response) => {
                const success = (response === true || response === 1);

                if (success) {
                    alert('Salida registrada exitosamente.');
                    this.cargarTabla();
                } else {
                    alert(`Error al registrar salida. ${response}`);
                }
            }, 'json').fail(() => {
                alert("Error de conexión o respuesta no JSON al marcar salida.");
            });
        }
    }

    //enviar datos
    handleFormSubmit() {
        $('#formulario-entrada').on('submit', (e) => {
            e.preventDefault();

            const operation = 'insertar';
            const urlController = this.baseUrl + '?op=' + operation;

            let postData = {
                idmiembro: $('#idmiembro').val(),
            };

            $.post(urlController, postData, (response) => {
                const success = (response === true || response === 1);

                if (success) {
                    alert('Entrada registrada con éxito.');
                    this.cargarTabla();
                } else {
                    alert(`Error al registrar la entrada. ${response}`);
                }
            }, 'json').fail(() => {
                alert("Error, solo se pueden 2 registros de asistencia al día o ya existe una asistencia activa con este miembro.");
            });
        });
    }
}