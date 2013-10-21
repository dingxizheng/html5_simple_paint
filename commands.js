/**
 *@author Xizheng Ding
 */

/**
 *define a interface with two methods 'execute', 'undo'
 */
var command = new Interface('command',['execute','undo']);


var addCmd = Class.extend({
	_canvasObject: null,
	_tempObject: null,
	init: function(canvasobject){	
		/*check interface implementation*/
		Interface.ensureImplements(this, command); 
		this._canvasObject = canvasobject;
	},
	getcanvasObject: function(){
		return this._canvasObject;
	},
	mousedown: function(){
	},
	drawing: function(){

	},
	execute: function(){
		var state = State.getInstance();
		state.addObject(this.getcanvasObject());
 		state.layerUpdate();
	},
	undo: function(){
		var state = State.getInstance();
		state.removeObject(this.getcanvasObject());
		state.layerUpdate();
	},
});

//add_rectangle command
var addRectCmd = addCmd.extend({
	init: function(canvasobject){
		this._super(canvasobject);
		this._tempObject = new canvasRect();
	},
});

//var _addR = new addRectCmd();


//add_line command
var addLineCmd = addCmd.extend({   // implements command
	init: function(canvasobject){
		this._super(canvasobject); 
	},
});



//add_circle command
var addCircleCmd = addCmd.extend({   // implements command
	init: function(canvasobject){
		this._super(canvasobject); 
	},
});



//delete obejct command
var deleteObejctCmd = addCmd.extend({ // implements command
	_canvasObject: null,
	init: function(canvasobject){
		this._canvasObject = canvasobject;
	},
	execute: function(){
		var state = State.getInstance();
		state.hideObject(this.getcanvasObject());
		state.layerUpdate();
	},
	undo: function(){
		var state = State.getInstance();
		state.showObject(this.getcanvasObject());
 		state.layerUpdate();
	},
});



//copy_shape command
var copyShapeCmd = Class.extend({   // implements command
	_canvasObject: null,
	_lastUnpasted: null,
	init: function(canvasobject){
		//check interface implementation
		Interface.ensureImplements(this, command); 
		this.copyAttributes(canvasobject);
		this._canvasObject.copy(canvasobject);
		this._canvasObject.render();
	},
	copyAttributes: function(canvasobject){
		if(canvasobject instanceof canvasCircle)
			this._canvasObject = new canvasCircle();
		else if(canvasobject instanceof canvasRect)
			this._canvasObject = new canvasRect();
		else 
			this._canvasObject = new canvasLine();
	},
	getcanvasObject: function(){
		return this._canvasObject;
	},
	execute: function(){
        var state = State.getInstance();
        this._lastUnpasted = state._unpastedObject;
        state.copyObject(this.getcanvasObject());
        state.layerUpdate();
	},
	undo: function(){
		var state = State.getInstance();
        state.copyObject(this._lastUnpasted);
        state.layerUpdate();
	},
});



//cut_shape command
var cutShapeCmd = Class.extend({   // implements command
	_targetObject:null,
	_canvasObject: null,
	_isCutEntered: null,
	init: function(canvasobject){
		//check interface implementation
		Interface.ensureImplements(this, command); 
		this._targetObject = canvasobject;
	},
	execute: function(){
		var state = State.getInstance();
		var copy = new copyShapeCmd(this._targetObject);
		var deletec = new deleteObejctCmd(this._targetObject);
		
		state.doCmd(copy);
		state.doCmd(deletec);	
	},
	undo: function(){
		var state = State.getInstance();
		state.undoCmd();
		state.undoCmd();
	},
});



//paste_shape command
var pasteShapeCmd = Class.extend({   // implements command
	_canvasObject: null,
	_iscut: false,
	init: function(){
		//check interface implementation
		Interface.ensureImplements(this, command);  
		this._canvasObject = State.getInstance()._unpastedObject;
	},
	getcanvasObject: function(){
		return this._canvasObject;
	},
	execute: function(){
		var state = State.getInstance();
		state.pasteObject();
	},
	undo: function(){
		var state = State.getInstance();
		state.undoCmd();
		state.removeObject(this.getcanvasObject());
		state.layerUpdate();
	},
});



//edit Cmd
var editShapeCmd = Class.extend({	// implements command
	_canvasObject: null,
	init: function(canvasobject){
		//check interface implementation
		Interface.ensureImplements(this, command);  
		this._canvasObject = canvasobject;
		for(attribute in canvasobject.getparams())
			this[attribute] = canvasobject.getparams()[attribute];
	},
	getcanvasObject: function(){
		return this._canvasObject;
	},
	execute: function(){
	},
	undo: function(){
		for(attribute in this.getcanvasObject().getparams())
			this.getcanvasObject().getparams()[attribute] = this[attribute];
		this.getcanvasObject().render();
		//console.log("nihao");
	},
});



//reize_shape command
var resizeShapeCmd = Class.extend({   // implements command
	init: function(){
		//check interface implementation
		Interface.ensureImplements(this, command);  
	},
	execute: function(){

	},
	undo: function(){},
});




var _addCircleCmd = new addCircleCmd();