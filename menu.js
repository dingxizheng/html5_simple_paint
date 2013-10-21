/*
 *@author Xizheng Ding
 */

 //menu containner
 var MenuBar = Class.extend({
 	id: "#MenuBar",
 	menuNum: 0,
 	height: 50,
 	width: 200,
 	menus: {},
 	init: function(){
 		//initialize the prime position of the menubar
 		$(this.id).css("left", $(State.getInstance()._stageContainnerid).offset().left - 140);
 		$(this.id).css("top", $(State.getInstance()._stageContainnerid).offset().top);
 	},
 	add: function(menuitem){
 		menuNum ++;
 		menus.add(nenuitem);
 	},
 	remove: function(){
 	},
 	update: function(){

 	},
 });

//var _menubar = new MenuBar();

 //menu item 
 var MenuItem = Class.extend({
 	_command: null,
 	_id:"#",
 	_handler: null,
 	_background: "",
 	_font_size: 10,
 	init: function(id){
 		this._id = "#" + id;
 		this.onhover();
 		this.endhover();
 		this.onclick();
 	},
 	activate: function(value){
 	},
 	clicked: function(value){
 		if(value){
 			$(this._id).css("background", "#dfdfff");
 			$(this._id).css("font-size", 15);
 			this._background = "#dfdfff";
 			this._font_size = 15;
 		}else{
 			$(this._id).css("background", "");
 			$(this._id).css("font-size", 10);
 			this._background = "";
 			this._font_size = 10;
 		}
 	},
 	onclick: function(){
 		var obj = this;
 		$(this._id).bind("click", function(){
 			State.getInstance().setMenu(obj);
 		});
 	},
 	onhover: function(){
 		$(this._id).bind("mouseenter", function(){
 			$(this).css("background", "#efefef");
 			$(this).css("font-size", 15);
 		});
 	},
 	endhover: function(){
 		var obj = this;
 		$(this._id).bind("mouseleave", function(){
 			$(this).css("background", obj._background);
 			$(this).css("font-size", obj._font_size);
 		});
 	},
 });


//Undo menu item;
 var MenuUndo = MenuItem.extend({
 	init: function(id){
 		this._super(id);
 	},
 	activate: function(value){
 		if(value)
 			State.getInstance().undoCmd();
 		this.clicked(value);
 	},
 });


 //AddRect menu item
 var MenuAddRect = MenuItem.extend({
 	_addrectcmd: null,
 	init: function(id){
 		this._super(id);
 	},
 	activate: function(act){
		var state = State.getInstance();
		var obj = this;
		if(this._handler == null)
			this._handler = function(evt) {
				$(state.getContainer()).unbind("mousedown");
				var a_rect = new canvasRect();
 		    	obj._addrectcmd = new addRectCmd(a_rect);
				var mousePos = State.getInstance()._stage.getMousePosition();
				state.doCmd(obj._addrectcmd);
				obj._addrectcmd.getcanvasObject().setxy(mousePos.x - 50, mousePos.y - 25);
 				obj._addrectcmd.getcanvasObject().enableDraggable(false);
 				obj._addrectcmd.getcanvasObject()._offset.x = 10;
 				obj._addrectcmd.getcanvasObject()._offset.y = 5;
 				obj._addrectcmd.getcanvasObject()._editMode = true;
 				obj._addrectcmd.getcanvasObject().render();
 				obj.cancleDrawing();
			};
		if(act)
			$(state.getContainer()).bind("mousedown", this._handler);
		else
			$(state.getContainer()).unbind("mousedown");

		this.clicked(act);
	},
	cancleDrawing: function(){
		var state = State.getInstance();
		var obj = this;
		$(state.getContainer()).bind("mouseleave", function(){
			if(obj._addrectcmd.getcanvasObject()._editMode){
				obj._addrectcmd.getcanvasObject().enableDraggable(true);
				state.undoCmd();
			};
			$(state.getContainer()).unbind("mouseleave");
		});
	},
 });

//AddCircle menu item
 var MenuAddCircle = MenuItem.extend({
 	_addrectcmd: null,
 	init: function(id){
 		this._super(id);
 	},
 	activate: function(act){
		var state = State.getInstance();
		var obj = this;
		if(this._handler == null)
			this._handler = function(evt) {
				var a_circle = new canvasCircle();
 		    	obj._addrectcmd = new addCircleCmd(a_circle);
				var mousePos = State.getInstance()._stage.getMousePosition();
				state.doCmd(obj._addrectcmd);
 				obj._addrectcmd.getcanvasObject().enableDraggable(false);
 				obj._addrectcmd.getcanvasObject().setxy(mousePos.x - 25, mousePos.y - 25);
 				obj._addrectcmd.getcanvasObject()._enterRadius = 5;
 				obj._addrectcmd.getcanvasObject()._editMode = true;
 				obj._addrectcmd.getcanvasObject().render();
 				obj.cancleDrawing();
			};
		if(act)
			$(state.getContainer()).bind("mousedown", this._handler);
		else
			$(state.getContainer()).unbind("mousedown");

		this.clicked(act);
	},
	cancleDrawing: function(){
		var state = State.getInstance();
		var obj = this;
		$(state.getContainer()).bind("mouseleave", function(){
			if(obj._addrectcmd.getcanvasObject()._editMode){
				obj._addrectcmd.getcanvasObject().enableDraggable(true);
				state.undoCmd();
			};
			$(state.getContainer()).unbind("mouseleave");
		});
	},
 });

 //AddLinemenu item
 var MenuAddLine = MenuItem.extend({
 	_addrectcmd: null,
 	init: function(id){
 		this._super(id);
 	},
 	activate: function(act){
		var state = State.getInstance();
		var obj = this;
		if(this._handler == null)
			this._handler = function(evt) {	
				var a_line = new canvasLine();
 		    	obj._addrectcmd = new addLineCmd(a_line);
				var mousePos = State.getInstance()._stage.getMousePosition();
				state.doCmd(obj._addrectcmd);
				obj._addrectcmd.getcanvasObject()._isAxlePoint1 = true;
				obj._addrectcmd.getcanvasObject().setxy(mousePos.x - 10, mousePos.y - 10);
 				obj._addrectcmd.getcanvasObject().enableDraggable(false);
 				obj._addrectcmd.getcanvasObject()._scale = 0.2;
 				obj._addrectcmd.getcanvasObject()._editMode = true;
 				obj._addrectcmd.getcanvasObject().render();
 				obj.cancleDrawing();
			};
		if(act)
			$(state.getContainer()).bind("mousedown", this._handler);
		else
			$(state.getContainer()).unbind("mousedown");

		this.clicked(act);
	},
	cancleDrawing: function(){
		var state = State.getInstance();
		var obj = this;
		$(state.getContainer()).bind("mouseleave", function(){
			if(obj._addrectcmd.getcanvasObject()._editMode){
				obj._addrectcmd.getcanvasObject().enableDraggable(true);
				state.undoCmd();
			};
			$(state.getContainer()).unbind("mouseleave");
		});
	},
 });


 //mouse tool item
 var MenuMouseTool = MenuItem.extend({
 	init: function(id){
 		this._super(id);
 	},
 	activate: function(act){
 		var state = State.getInstance();
 		if(act)
 			state.setDraggable(true);

 		this.clicked(act);
 	},
 });

 //mouse tool item
 var MenuEdit = MenuItem.extend({
 	init: function(id){
 		this._super(id);
 	},
 	activate: function(act){
 		var state = State.getInstance();
 		if(act)
 			state.setDraggable(false);

 		this.clicked(act);
 	},
 });


 //delete item
 var MenuDelete = MenuItem.extend({
 	init: function(id){
 		this._super(id);
 	},
 	activate: function(act){
 		var state = State.getInstance();
 		if(act && state.getSelectObject()){
 			var deleteCmd = new deleteObejctCmd(state.getSelectObject());
 			state.doCmd(deleteCmd);
 		}

 		this.clicked(act);
 	},
 });


 //copy item
 var MenuCopy = MenuItem.extend({
 	init: function(id){
 		this._super(id);
 	},
 	activate: function(act){
 		var state = State.getInstance();
 		if(act && state.getSelectObject()){
 			var copy = new copyShapeCmd(state.getSelectObject());
 			state.doCmd(copy);
 		};
 		this.clicked(act);
 	},
 });


 var MenuCut = MenuItem.extend({
 	init: function(id){
 		this._super(id);
 	},
 	activate: function(act){
 		var state = State.getInstance();
 		if(act && state.getSelectObject()){
 			var cut = new cutShapeCmd(state.getSelectObject());
 			state.doCmd(cut);
 		};
 		this.clicked(act);
 	},
 });


  var MenuPaste= MenuItem.extend({
 	init: function(id){
 		this._super(id);
 	},
 	activate: function(act){
 		var state = State.getInstance();
 		if(act){
 			var paste = new pasteShapeCmd();
 			state.doCmd(paste);
 		};
 		this.clicked(act);
 	},
 });