//var index=0;
var sensorId;
var edgenodeId;
var edgenodeIP;
var sensorIndex;

function setSensorInfo(_edgenode, _edgenodeId, _sensor, _sensorId, _ip, _sensorIndex) {
    sensorId = _sensorId;
    edgenodeId = _edgenodeId;
    edgenodeIP = _ip;
    sensorIndex = _sensorIndex;
    $('#idInput').val(_edgenode + " (" + _edgenodeId + ")");
    $('#sensorInput').val(_sensor);
    $('#modal_add_sensor').modal();
}

function setModifySensorInfo(_edgenode, _edgenodeId, _sensor, _sensorId, _name, _desc, _ip, _sensorIndex) {
    sensorId = _sensorId;
    edgenodeId = _edgenodeId;
    edgenodeIP = _ip;
    sensorIndex = _sensorIndex;
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
        url: "/sensorlist/savejson"
            + "/" + $('#idInput').val()
            + "/" + $('#sensorInput').val()
            + "/" + $('#nameInput').val()
            + "/" + $('#descriptionInput').val()
            + "/" + sensorId
            + "/" + edgenodeId
            + "/" + edgenodeIP
            + "/" + sensorIndex
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
        url: "/sensorlist/savejson"
            + "/" + $('#modify_idInput').val()
            + "/" + $('#modify_sensorInput').val()
            + "/" + $('#modify_nameInput').val()
            + "/" + $('#modify_descriptionInput').val()
            + "/" + sensorId
            + "/" + edgenodeId
            + "/" + edgenodeIP
            + "/" + sensorIndex
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
        url: "/sensorlist/deletejson/" + sensorId,
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