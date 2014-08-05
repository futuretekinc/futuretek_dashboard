var index=0;
var sensorId;

function setSensorInfo(_index, _edgenode, _sensor, _sensorId) {
    index = _index;
    sensorId = _sensorId;
    $('#idInput').val(_edgenode);
    $('#sensorInput').val(_sensor);
    $('#modal_add_sensor').modal();
}

function clearInput() {
    $('#idInput').val("");
    $('#sensorInput').val("");
    $('#nameInput').val("");
    $('#descriptionInput').val("");
}

$("#btn_save_sensor").click ( function() {
    if ( $('#idInput').val() == "" || $('#sensorInput').val() == "" ||
        $('#nameInput').val() == "" || $('#descriptionInput').val() == ""){

        alert("input empty!");
        return;
    }
    $.ajax({
        url: "/sensorlist/savejson/" + index + "/" + $('#idInput').val() + "/" + $('#sensorInput').val() + "/" + $('#nameInput').val() + "/" + $('#descriptionInput').val() + "/" + sensorId,
        type: 'get',
        dataType: 'text',
        success: function (data) {
            alert(data);
        }
    });

    clearInput();
   	$('#modal_add_sensor').modal('hide');
});