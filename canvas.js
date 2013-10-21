/*
 * @author Xizheng Ding 
 * @Lakehead University
 */

 var State = Class.extend({
 	//operations
 	_operations: { undo: "undo", mouse: "mouse", edit: "edit", addrect: "addrect", addcircle: "addcircle", addline: "addline", copy: "copy", cut: "cut", paste: "paste", delete: "delete"},
 	//current operation
 	_currentOperation: null,
 	//instance of this class. Used as singleton pattern.
 	_instance : null,
 	//stage
 	_stage: null,
 	//stageContainner 
 	_stageContainner : "canvasContainner",
 	//stageContainner id
 	_stageContainnerid : "#canvasContainner",
 	//canvas width
 	_width: 700,
 	//canvas height
 	_height: 480,
 	//offset.x of canvas
 	_offsetx: 0,
 	//offset.y of canvas
 	_offsety: 0,
 	//whether the mouse is inside the canvas
 	_mouseIn: false,
 	//unpastedObject
 	_unpastedObject: null,
 	//commands had been executed
    _commands: [],
    //isCutEntered
    _isCutEntered: false,
    //command has not been executed
    _unexecutedCmd: null,
    //onCutedObject
    _onCutedObject: null,
    //object that is on hovered by mouse
    _onhoveredObject: null,
    //object that is on clicked by mouse
    _onclickedObject: null,
    //canvas objects
    _canvasobjects: [],
    //tempShape
    _tempShape:null,
    //menuItems
    _menuItems: [],
    //layer
    _layers: null,
    //
    _mouseTool: true,
    _strokeColor: null,
 	init: function(){
 		this._currentOperation = this._operations.mouse;
 	},
 	setCanvas: function(){
 		this._stage = new Kinetic.Stage({
			container: this._stageContainner,
			width: this._width,
			height: this._height
		});

		this._layer = new Kinetic.Layer({
			width: this._width,
			height: this._height,
		});
		this._stage.add(this._layer);
		this._stage.draw();

		$(document).bind("contextmenu",function(e){
			State.getInstance().moveMenuBar();
        	return false;
    	});

    	$(document).bind("click",function(e){
			State.getInstance().resetMenuBar();
			State.getInstance().resetColorBar();
        	//return false;
    	});

 	},
 	setMenuItems: function(){
 		for(var i = 0; i < arguments.length; i++)
 			this._menuItems.push(arguments[i]);
 	},
 	setMenu: function(menuitem){
 		for(var i = 0; i < this._menuItems.length; i++)
 			this._menuItems[i].activate(false);
 		menuitem.activate(true);
 	},
 	setSelectObject: function(canvasobject){
 		if(this._onclickedObject)
 			this._onclickedObject.update("stroke", this._strokeColor);
 		this._onclickedObject = canvasobject;
 		this._strokeColor = this._onclickedObject.getparams()["stroke"];
 		this._onclickedObject.update("stroke", "yellow");
 	},
 	getSelectObject: function(){
 		return this._onclickedObject;
 	},
 	setOnhoverObject: function(canvasobject){
 		this._onhoveredObject = canvasobject;
 		this.setColorBarColor(this._onhoveredObject.getparams()["fill"],this._onhoveredObject.getparams()["stroke"]);
 	},
 	getOnhoverObject: function(){
 		return this._onhoveredObject;
 	},
 	setDraggable: function(value){
 		for(var i = 0; i < this._canvasobjects.length; i++)
 			this._canvasobjects[i].enableDraggable(value);
 	},
 	getContainer: function(){
 		return this._stage.getContainer();
 	},
 	doCmd: function(canvascmd){
 		canvascmd.execute();
 		this._commands.push(canvascmd);
 	},
 	undoCmd: function(){
 		var cmd = this._commands.pop();
 		cmd.undo();
 		if(cmd instanceof pasteShapeCmd){
 			cmd._iscut = true;
 		};

 	},
 	pasteObject: function(){
 		if(this._unpastedObject)
 			this.addObject(this._unpastedObject);
 	},
 	setCutEntered: function(cutentered){
 		this._isCutEntered = cutentered;
 	},
 	copyObject: function(canvasobject){
 		this._unpastedObject = canvasobject;
 	},
 	showObject: function(canvasobject){
 		canvasobject.getshape().show();
 	},
 	hideObject: function(canvasobject){
 		canvasobject.getshape().hide();
 	},
 	moveMenuBar: function(){
 		var mousePos = this._stage.getMousePosition();
 		$("#MenuBar").animate({
 			left: $(this._stageContainnerid).offset().left + mousePos.x,
 			top: $(this._stageContainnerid).offset().top + mousePos.y - 50,
 		});
 	},
 	resetMenuBar: function(){
 		var mousePos = this._stage.getMousePosition();
 		$("#MenuBar").animate({
 			left: $(this._stageContainnerid).offset().left - 140,
 			top: $(this._stageContainnerid).offset().top ,
 		});
 	},
 	moveColorBar: function(canvasobject){
 		$("#colorBar").animate({
 			left: $(this._stageContainnerid).offset().left + canvasobject.getCenterPoint().x,
 			top: $(this._stageContainnerid).offset().top + canvasobject.getCenterPoint().y,
 		});
 	},
 	setColorBarColor: function(color1, color2){
 		console.log();
 		 $('#fillcolor div').css("backgroundColor", color1);
 		 $('#strokecolor div').css("backgroundColor", color2);
 	},
 	doColorCmd: function(){
 		if(this._onhoveredObject == null)
 			return;

 		var color = new editShapeCmd(this._onhoveredObject);
		this.doCmd(color);
 	},
 	resetColorBar: function(){
 		$("#colorBar").animate({
 			left: $(this._stageContainnerid).offset().left + 500,
 			top: $(this._stageContainnerid).offset().top - 48,
 		});
 	},
 	addObject: function(canvasobject){
 		this._canvasobjects.push(canvasobject);
 		this._layer.add(canvasobject.getshape());
 		//canvasobject.init();
 	},
 	removeObject: function(canvasobject){
 		this._canvasobjects.remove(canvasobject);
 		canvasobject.getshape().remove();
 	},
 	layerUpdate: function(){
 		this._layer.draw();
 	},
 });

 State.getInstance = function(){
 	if(!this._instance)
 		this._instance =  new State();
 	return this._instance;
 };