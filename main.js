/**
*@Author Xizheng Ding
*/

$(function(){
	$("body").bind("mousemove", function(){
		$(this).css("cursor", 'default');
	});

	State.getInstance().setCanvas();
    var _menuBar = new MenuBar();
    var a_rect = new canvasRect();
    var addrectcmd = new addRectCmd(a_rect);
    var a_circle = new canvasCircle();
    var addcirclecmd = new addCircleCmd(a_circle);
    var a_line = new canvasLine();
    var addlinecmd = new addLineCmd(a_line);
    State.getInstance().doCmd(addrectcmd);
    State.getInstance().doCmd(addcirclecmd);
    State.getInstance().doCmd(addlinecmd);
    var b_circle = new canvasCircle();
    var addcirclecmd2 = new addCircleCmd(b_circle);
    State.getInstance().doCmd(addcirclecmd2);
    b_circle.update("fill", "#eeffee");
    State.getInstance().layerUpdate();

 State.getInstance().setMenuItems(
 	new MenuUndo("undo"), 
 	new MenuAddRect("addrect"), 
 	new MenuAddCircle("addcircle"), 
 	new MenuAddLine("addline"),
 	new MenuMouseTool("mouse"),
 	new MenuEdit("edit"),
 	new MenuDelete("delete"),
 	new MenuCopy("copy"),
 	new MenuCut("cut"),
 	new MenuPaste("paste"));


 State.getInstance().resetColorBar();

$('#fillcolor').ColorPicker({
	color: '#fff',
	onShow: function (colpkr) {
		$(colpkr).fadeIn(500);
		State.getInstance().doColorCmd();
		return false;
	},
	onHide: function (colpkr) {
		$(colpkr).fadeOut(500);
		return false;
	},
	onChange: function (hsb, hex, rgb) {
		$('#fillcolor div').css('backgroundColor', '#' + hex);
		State.getInstance().getOnhoverObject().update("fill", '#' + hex);
	}
 });
$('#fillcolor div').css('backgroundColor', "#fff");

  $('#strokecolor').ColorPicker({
	color: '#fff',
	onShow: function (colpkr) {
		$(colpkr).fadeIn(500);
		State.getInstance().doColorCmd(  );
		return false;
	}, 
	onHide: function (colpkr) {
		$(colpkr).fadeOut(500);
		return false;
	},
	onChange: function (hsb, hex, rgb) {
		$('#strokecolor div').css('backgroundColor', '#' + hex);
		State.getInstance().getOnhoverObject().update("stroke", '#' + hex);
	}
});
 $('#strokecolor div').css('backgroundColor', "#fff");
});