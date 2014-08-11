var index=0;
var sensorId;
var edgenodeId;

function setSensorInfo(_index, _edgenode, _edgenodeId, _sensor, _sensorId) {
    index = _index;
    sensorId = _sensorId;
    edgenodeId = _edgenodeId;
    $('#idInput').val(_edgenode + " (" + _edgenodeId + ")");
    $('#sensorInput').val(_sensor);
    $('#modal_add_sensor').modal();
}

function setModifySensorInfo(_index, _edgenode, _edgenodeId, _sensor, _sensorId, _name, _desc) {
    index = _index;
    sensorId = _sensorId;
    edgenodeId = _edgenodeId;
    $('#modify_idInput').val(_edgenode);
    $('#modify_sensorInput').val(_sensor);
    $('#modify_nameInput').val(_name);
    $('#modify_descriptionInput').val(_desc);
    $('#modal_modify_sensor').modal();
}

function clearInput() {
    $('#idInput').val("");
    $('#sensorInput').val("");
    $('#nameInput').val("");
    $('#descriptionInput').val("");

    $('#modify_idInput').val("");
    $('#modify_sensorInput').val("");
    $('#modify_nameInput').val("");
    $('#modify_descriptionInput').val("");
}

$("#btn_save_sensor").click ( function() {
    if ( $('#idInput').val() == "" || $('#sensorInput').val() == "" ||
        $('#nameInput').val() == "" || $('#descriptionInput').val() == "") {

        alert("Input Empty!");
        return;
    }
    $.ajax({
        url: "/sensorlist/savejson/" + index
            + "/" + $('#idInput').val()
            + "/" + $('#sensorInput').val()
            + "/" + $('#nameInput').val()
            + "/" + $('#descriptionInput').val()
            + "/" + sensorId
            + "/" + edgenodeId
            + "/add",
        type: 'get',
        dataType: 'text',
        success: function (data) {
            if (data == "success") {
                alert("Success Added.");
                location.reload();
            }
        }
    });

    clearInput();
   	$('#modal_add_sensor').modal('hide');
});

$("#btn_modify_sensor").click ( function() {
    if ( $('#modify_idInput').val() == "" || $('#modify_sensorInput').val() == "" ||
        $('#modify_nameInput').val() == "" || $('#modify_descriptionInput').val() == "") {

        alert("Input Empty!");
        return;
    }
    $.ajax({
        url: "/sensorlist/savejson/" + index
            + "/" + $('#modify_idInput').val()
            + "/" + $('#modify_sensorInput').val()
            + "/" + $('#modify_nameInput').val()
            + "/" + $('#modify_descriptionInput').val()
            + "/" + sensorId
            + "/" + edgenodeId
            + "/modify",
        type: 'get',
        dataType: 'text',
        success: function (data) {
            if (data == "success") {
                alert("Success Modified.");
                location.reload();
            }
        }
    });

    clearInput();
    $('#modal_modify_sensor').modal('hide');
});

$("#btn_delete_sensor").click ( function() {
//    if ( $('#modify_idInput').val() == "" || $('#modify_sensorInput').val() == "" ||
//        $('#modify_nameInput').val() == "" || $('#modify_descriptionInput').val() == "") {
//
//        alert("input empty!");
//        return;
//    }
    $.ajax({
        url: "/sensorlist/deletejson/" + index,
        type: 'get',
        dataType: 'text',
        success: function (data) {
            if (data == "success") {
                alert("Success Removed.");
                location.reload();
            }
        }
    });

    clearInput();
    $('#modal_modify_sensor').modal('hide');
});