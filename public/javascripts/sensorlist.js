//$("#btn_temperature").click ( function() { $("#title_add_sensor").text("Add Sensor"); });
//$("#btn_humidity").click ( function() { $("#title_add_sensor").text("Add Sensor"); });
//$("#btn_co2").click ( function() { $("#title_add_sensor").text("Add Sensor"); });
//$("#btn_camera").click ( function() { $("#title_add_sensor").text("Add Sensor"); });

$("#btn_save_sensor").click ( function() {
	var data = "<tr><td>1</td><td>실내온도</td><td>ON</td><td>1층 실내온도</td><td><button id='btn_edit' type='button' class='btn btn-primary btn-xs' data-toggle='modal' data-target='#modal_edit_sensor'>Edit</button></td></tr>";
   	$("#table_body").append( data );
   	$('#modal_add_sensor').modal('hide');
});

$("#btn_delete_sensor").click ( function() {
	$('#modal_edit_sensor').modal('hide');
	
	//=========== 테이블 리프레시=============
	//========================================
});

$("#btn_edit_sensor").click ( function() {
	$('#modal_edit_sensor').modal('hide');
});


// $(document).on ("click", "#btn_edit",  function() {
	
// });