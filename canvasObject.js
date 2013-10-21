/**
*@author Xizheng Ding
*/

/*
 *  create a canvasObject Class extend from base Class
 */
var canvasObject = Class.extend({
	_id: null,
	_shape: null,
	_params: {},
	_isMouseIn: false,
	_editMode: false,
	_onhoverstroke: {
		stroke: "red",
	},
	_endhoverstroke: {},

	//constructor
	init: function(){
		this._id = getUniqid("canvasObject_");
		this[this._id] = {};
		for(attribute in this._params)
			this[this._id][attribute] = this._params[attribute];

		this.draw();
		this.onhover();
		this.endhover();
		this.mouseup();
		this.onclick();
		this.mousedown();
		this.mousemove();
	},
	getparams: function(){
		return this[this._id];
	},
	getshape: function(){
		return this._shape;
	},
	getendhoverstroke: function(){
		for(attr in this._onhoverstroke){
			this._endhoverstroke[attr] = this.getparams()[attr];
		};
		return this._endhoverstroke;
	},
	update: function(params){
		for(attribute in params)
			this.getparams()[attribute] = params[attribute];
		this.render();
	},
	copy: function(canvasObject){
		this[this._id] = null;
		this._id = getUniqid("canvasObject_");
		this[this._id] = {};
		for(attribute in canvasObject.getparams())
			this[this._id][attribute] = canvasObject.getparams()[attribute];
	},
	update: function(attribute, value){
		var att = {};
		att[attribute] = value;
		this.getshape().setAttrs(att);
		this.getparams()[attribute] = value;
		State.getInstance().layerUpdate();
	},
	setxy: function(value_x, value_y){
		this.getparams()["x"] = value_x;
		this.getparams()["y"] = value_y;
	},
	render: function(){
		this.getshape().setAttrs(this.getparams());
		State.getInstance().layerUpdate();
	},
	onhover: function(){
		var obj = this;
        this._shape.on("mouseover", function(){
        	obj._isMouseIn = true;
        	this.setAttrs(obj._onhoverstroke);
        	State.getInstance().layerUpdate();
        	if(!obj._editMode)
        		State.getInstance().moveColorBar(obj);      		
        	State.getInstance().setOnhoverObject(obj);
        });
	},
	enableDraggable: function(value){
		this.update("draggable", value);
	},
	mousedown: function(){
		var obj = this;
		this._shape.on("mousedown", function(){
			State.getInstance().resetColorBar();
			if(!obj.getparams()["draggable"] && obj._isMouseIn){
				obj._editMode = true;
				var edit = new editShapeCmd(obj);
				State.getInstance().doCmd(edit);
			}else if(obj.getparams()["draggable"] && obj._isMouseIn){
				State.getInstance().setSelectObject(obj);
			}
		});
	},
	editMode: function(){
	},
	endhover: function(){
		var obj = this;
		this._shape.on("mouseout", function(){
			obj._isMouseIn = false;
			this.setAttrs(obj.getendhoverstroke());
			State.getInstance().layerUpdate();
			obj._editMode = false;
		});
	},
	mouseup: function(){
		var obj = this;
		this._shape.on("mouseup", function(){
			if(!obj._editMode){
				var move = new editShapeCmd(obj);
				State.getInstance().doCmd(move);
				obj.setxy(this.getX(), this.getY());
				obj.render();
		    }
			obj._editMode = false;
        });
	},
	onclick: function(){
		var obj = this;
		this._shape.on("click", function(){
			//obj.setxy(35, 35);
        });
	},
});



var canvasCircle = canvasObject.extend({
	_params: {
		x: 200,
        y: 100,
        radius: 30,
        fill: '#ffeeee',
        stroke: 'black',
        strokeWidth: 2,
        draggable: true,
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffset: 2,
        shadowOpacity: 0.5
	},
	_enterRadius: 0,
	init: function(){
		this._super();
		this.calculateRadius();
	},
	draw: function(){
		this._shape = new Kinetic.Circle(this.getparams());
	},
	mousemove: function(){
		var obj = this;
		var state = State.getInstance();
		state.getContainer().addEventListener('mousemove', function(evt) {
			if(obj._editMode)
				obj.changeshape();
		});
	},
	calculateRadius: function(){
		var obj = this;
		this.getshape().on("mousedown", function(){
			var mousePos = State.getInstance()._stage.getMousePosition();
			var centerPos = obj.getCenterPoint();
			var radius = Math.sqrt((centerPos.x - mousePos.x)*(centerPos.x - mousePos.x) + (centerPos.y - mousePos.y)*(centerPos.y - mousePos.y));
			obj._enterRadius = obj.getparams()["radius"] - radius; 
		});
	},
	changeshape: function(){
		 var mousePos = State.getInstance()._stage.getMousePosition();
		 var centerPos = this.getCenterPoint();
		 var radius = Math.sqrt((centerPos.x - mousePos.x)*(centerPos.x - mousePos.x) + (centerPos.y - mousePos.y)*(centerPos.y - mousePos.y));
		 this.update("radius", radius + this._enterRadius);
	},
	getCenterPoint: function(){
		var point = {x: 0, y: 0};
		point["x"] = this.getparams()["x"] ;
		point["y"] = this.getparams()["y"] ;
		return point;
	},
});



var canvasRect = canvasObject.extend({
	_params: {
		x: 50,
        y: 50,
        width: 100,
        height: 50,
        fill: '#eeeeff',
        stroke: 'black',
        strokeWidth: 2,
        draggable: true,
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffset: 2,
        shadowOpacity: 0.5
	},
	_offset: {x: 0, y: 0},
	init: function(){
		this._super();
		this.calculateOffset();
	},
	draw: function(){
		this._shape = new Kinetic.Rect(this.getparams());
	},
	mousemove: function(){
		var obj = this;
		var state = State.getInstance();
		state.getContainer().addEventListener('mousemove', function(evt) {
			if(obj._editMode)
				obj.changeshape();
		});
	},
	calculateOffset: function(){
		var obj = this;
		this.getshape().on("mousedown", function(){
			var mousePos = State.getInstance()._stage.getMousePosition();
			var centerPos = obj.getCenterPoint();
			obj._offset.x = obj.getparams()["width"] / 2 - Math.abs(mousePos.x - centerPos.x);
			obj._offset.y = obj.getparams()["height"] / 2 - Math.abs(mousePos.y - centerPos.y);
		});
	},
	changeshape: function(){
		 var mousePos = State.getInstance()._stage.getMousePosition();
		 var centerPos = this.getCenterPoint();
		 var half_width = Math.abs(mousePos.x - centerPos.x) + this._offset.x;
		 var half_height = Math.abs(mousePos.y - centerPos.y) + this._offset.y;
		 this.update("x", centerPos.x - half_width);
		 this.update("y", centerPos.y - half_height);
		 this.update("width", 2 * half_width);
		 this.update("height", 2 * half_height);
	},
	getCenterPoint: function(){
		var point = {x: 0, y: 0};
		point["x"] = this.getparams()["x"] + this.getparams()["width"] / 2;
		point["y"] = this.getparams()["y"] + this.getparams()["height"] / 2;
		return point;
	},
});


/*
 * Line Object 
 * It extends atrributes and methods from canvasObject
 */
var canvasLine = canvasObject.extend({
	_params: {
		x: 0,
		y: 0,
        points: [100, 50, 300, 150],
        stroke: 'black',
        strokeWidth: 2,
        draggable: true,
        shadowBlur: 10,
        shadowOffset: 2,
        shadowOpacity: 0.5
	},
	_scale: 0.2,
	_axle: {},
	_isAxlePoint1: false,
	init: function(){
		this._super();
		this.update("strokeWidth", 4);
		this.calculateScale();
	},
	draw: function(){
		this._shape = new Kinetic.Line(this.getparams());
	},
	mousemove: function(){
		var obj = this;
		var state = State.getInstance();
		state.getContainer().addEventListener('mousemove', function(evt) {
			if(obj._editMode)
				obj.changeshape();
		});
	},
	changeshape: function(){
		 var mousePos = State.getInstance()._stage.getMousePosition();
		 var centerPos = this.getCenterPoint();
		 var point_x = this.getparams()["points"][2] + (mousePos.x - this.getparams()["points"][2]) * (1 + this._scale);
		 var point_y = this.getparams()["points"][3] + (mousePos.y - this.getparams()["points"][3]) * (1 + this._scale);
		 if(this._isAxlePoint1){
		 	point_x = this.getparams()["points"][0] + (mousePos.x - this.getparams()["points"][0]) * (1 + this._scale);
		 	point_y = this.getparams()["points"][1] + (mousePos.y - this.getparams()["points"][1]) * (1 + this._scale);
		 	this.update("points", [this.getparams()["points"][0], this.getparams()["points"][1], point_x, point_y]);
		 	return;
		 }
		 this.update("points", [point_x, point_y, this.getparams()["points"][2], this.getparams()["points"][3]]);
	},
	calculateScale: function(){
		var obj = this;
		this.getshape().on("mousedown", function(){
			var mousePos = State.getInstance()._stage.getMousePosition();
			var centerPos = obj.getCenterPoint();
			var mouseToP1 = Math.sqrt((mousePos.x - obj.getparams()["points"][0]) * (mousePos.x - obj.getparams()["points"][0]) + (mousePos.y - obj.getparams()["points"][1]) * (mousePos.y - obj.getparams()["points"][1]));
			var mouseToP2 = Math.sqrt((mousePos.x - obj.getparams()["points"][2]) * (mousePos.x - obj.getparams()["points"][2]) + (mousePos.y - obj.getparams()["points"][3]) * (mousePos.y - obj.getparams()["points"][3]));
			if(mouseToP1 >= mouseToP2){
				obj._isAxlePoint1 = true;
				obj._scale = mouseToP2 / (mouseToP1 + mouseToP2);
			}else{
				obj._isAxlePoint1 = false;
				obj._scale = mouseToP1 / (mouseToP1 + mouseToP2);
			}
		});
	},
	getCenterPoint: function(){
		var point = {x: 0, y: 0};
		point["x"] = (this.getparams()["points"][0] + this.getparams()["points"][2]) / 2;
		point["y"] = (this.getparams()["points"][1] + this.getparams()["points"][3]) / 2;
		return point;
	},
	mouseup: function(){
		var obj = this;
		this._shape.on("mouseup", function(){
			if(!obj._editMode){
				var move = new editShapeCmd(obj);
				State.getInstance().doCmd(move);
				obj.setxy(this.getPoints()[0].x + this.getX(), this.getPoints()[0].y + this.getY());
				obj.render();
			}
			obj._editMode = false;
        });
	},
	resetPosition: function(){
		this.update("y", this._axle.y - Math.abs(this.getparams()["points"][1] - this._axle.y));
	},
	setxy: function(value_x, value_y){
		var offset_x = value_x - this.getparams()["points"][0] ;
		var offset_y = value_y - this.getparams()["points"][1] ;
		this.getparams()["points"][0] = value_x;
		this.getparams()["points"][1] = value_y;
		this.getparams()["points"][2] += offset_x;
		this.getparams()["points"][3] += offset_y;
		this.getparams()["x"] = 0;
		this.getparams()["y"] = 0;
	},
});