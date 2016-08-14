var game = window.game || {};
var util = window.util || {};
var resource = window.resource || {};
var enemy = window.enemy || {};
var weapon = window.weapon || {};

(function(gm, util, resource, enemy, weapon, undefined){
	gm.prepare = function(){
		let width = gm.settings.width;
		let height = gm.settings.height;
		let padding = gm.settings.padding;
		let dx = gm.settings.dx, dy = gm.settings.dy;
		let row = gm.settings.row, col = gm.settings.col;
		let xmlns = util.xmlns;
		gm.weapons = [];
		gm.enemies = [];

		var TILES = gm.TILES = new Array(); // 板块数组
		var CONSTRUCTION_PANEL; //建造面板

		/*
			初始化画板
		*/
		var canvas_svg = gm.canvas_svg = resource.factory("canvas_svg", width, height);
		/*
			初始化<defs>
		*/
		/*var defs = document.createElementNS(util.xmlns, "defs");
		defs.appendChild(resource.factory("cross"));
		canvas_svg.appendChild(defs);*/
		canvas_svg.appendChild(resource.factory("cross"))
		canvas_svg.appendChild(resource.factory("weapon_1_image"));
		canvas_svg.appendChild(resource.factory("shovel_image"));
		canvas_svg.appendChild(resource.factory("enemy_level1"));
        /*
			初始化网格
		*/
		var net = resource.factory("net", width, height, padding, dx, dy);
		canvas_svg.appendChild(net);
		/*
			初始化建造面板
		*/
		CONSTRUCTION_PANEL = new gm.optionPanel("constructionPanel"); //初始化建造面板

		let CONSTRUCTION_PANEL_DISMISSBTN = new gm.optionPanelBtn("constructionPanel-dismissBtn", 'cross_sign');
		CONSTRUCTION_PANEL_DISMISSBTN.addEventListener(CONSTRUCTION_PANEL_DISMISSBTN, "click", function(){
			CONSTRUCTION_PANEL.HIDE();
			//CONSTRUCTION_PANEL_DISMISSBTN.HIDE();
		});
		CONSTRUCTION_PANEL.appendVirtureChild(CONSTRUCTION_PANEL_DISMISSBTN, util.point(0,0));

		let CONSTRUCTION_PANEL_WEAPON_1 = new gm.optionPanelBtn("constructionPanel_weapon_1", "weapon_1_image", {stroke: "black"});
		CONSTRUCTION_PANEL_WEAPON_1.addEventListener(CONSTRUCTION_PANEL_WEAPON_1, "click", function(){
			/*let weapon_1 = new gm.weapon_1(this.parent.tempTile);
			canvas_svg.insertBefore(weapon_1.SVG_Obj, document.querySelector('svg > polyline'));
			this.parent.tempTile.construction = weapon_1;*/
			//console.log(this.parent);

			let weapon_1 = weapon.get("weapon_direct")
			weapon_1.settle_down(this.parent.tempTile);
			canvas_svg.insertBefore(weapon_1.sprite.SVG_Obj, document.querySelector('svg > polyline'));
			weapon_1.watch(canvas_svg);
			CONSTRUCTION_PANEL.HIDE();
		})
		CONSTRUCTION_PANEL.appendVirtureChild(CONSTRUCTION_PANEL_WEAPON_1, util.point(0, -60));
		CONSTRUCTION_PANEL_WEAPON_1.addEventListener(CONSTRUCTION_PANEL_WEAPON_1, "mouseover", function(){
			let tile = this.parent.tempTile,
				pos = tile.position,
				range = 1;
			for(var i = pos.x-range < 0?0: pos.x-range; i<= (pos.x+range > 9?9: pos.x+range); i++){
				for(var j = pos.y-range < 0?0: pos.y-range; j<= (pos.y+range > 9?9: pos.y+range); j++){
					gm.TILES[i][j].SVG_Obj.setAttributeNS(null, "fill","rgba(255,0,0,0.5)");
				}
			}
		})
		CONSTRUCTION_PANEL_WEAPON_1.addEventListener(CONSTRUCTION_PANEL_WEAPON_1, "mouseout", function(){
			let tile = this.parent.tempTile,
				pos = tile.position,
				range = 1;

			for(var i = pos.x-range < 0?0: pos.x-range; i<= (pos.x+range > 9?9: pos.x+range); i++){
				for(var j = pos.y-range < 0?0: pos.y-range; j<= (pos.y+range > 9?9: pos.y+range); j++){
					if(gm.TILES[i][j].routeTile)
						gm.TILES[i][j].SVG_Obj.setAttributeNS(null, "fill","rgba(255,255,255,0.3)");
					else
						gm.TILES[i][j].SVG_Obj.setAttributeNS(null, "fill","transparent");
				}
			}
		})

		/*
			初始化改造面板
		*/
		let UPGRADE_PANEL = new gm.optionPanel("updatePanel");
		let UPGRADE_PANEL_DISMISSBTN = new gm.optionPanelBtn("updatePanel-dismissBtn", 'cross_sign');
		UPGRADE_PANEL_DISMISSBTN.addEventListener(UPGRADE_PANEL_DISMISSBTN, "click", function(){
			UPGRADE_PANEL.HIDE();
		})
		UPGRADE_PANEL.appendVirtureChild(UPGRADE_PANEL_DISMISSBTN, util.point(0,0));
		let UPGRADE_PANEL_SHOVEL = new gm.optionPanelBtn("updatePanel-shovel", 'shovel_image', {stroke: "black"});
		UPGRADE_PANEL_SHOVEL.addEventListener(UPGRADE_PANEL_SHOVEL, "click", function(){
			let tile = this.parent.tempTile;
			let building = tile.construction;
			canvas_svg.removeChild(building.SVG_Obj);
			tile.construction = null;
			building = null;
			UPGRADE_PANEL.HIDE();
		})
		UPGRADE_PANEL.appendVirtureChild(UPGRADE_PANEL_SHOVEL, util.point(0, 60));


		/*
			初始化板块
		*/
		function paveTile(){
			for(var i=0;i<row;i++){
				TILES[i] = new Array();
				for(var j=0;j<col;j++){
					var temp = TILES[i][j] = game.map.tile(i, j);

					(function(tile){
						if(!tile.routeTile){
							tile.addEventListener(tile, "mouseover", function(event){
								this.SVG_Obj.setAttributeNS(null, "fill", "rgba(255,255,255,0.3)");
							});
							tile.addEventListener(tile, "mouseout", function(event){
								this.SVG_Obj.setAttributeNS (null, "fill", "transparent");
							});
							tile.addEventListener(tile, "click", function(event){
								//console.log(tile);
								if(tile.construction){
									UPGRADE_PANEL.SHOW(tile);
									CONSTRUCTION_PANEL.HIDE();
								}

								else{
									CONSTRUCTION_PANEL.SHOW(tile);
									UPGRADE_PANEL.HIDE();
								}
							});
						}
						
					})(temp)
					
					canvas_svg.insertBefore(temp.SVG_Obj, UPGRADE_PANEL.SVG_Obj);
				}
			}
		}
		
		//顺序： tiles < CONSTRUCTION_PANEL

		canvas_svg.appendChild(UPGRADE_PANEL.SVG_Obj);
		canvas_svg.appendChild(UPGRADE_PANEL_DISMISSBTN.SVG_Obj);
		canvas_svg.appendChild(UPGRADE_PANEL_SHOVEL.SVG_Obj);

		canvas_svg.appendChild(CONSTRUCTION_PANEL.SVG_Obj);
		canvas_svg.appendChild(CONSTRUCTION_PANEL_DISMISSBTN.SVG_Obj);
		canvas_svg.appendChild(CONSTRUCTION_PANEL_WEAPON_1.SVG_Obj);

		paveTile();
		document.body.insertBefore(canvas_svg, document.getElementById("informaitionLayer"));

	//	console.log(weapon);
		//weapon.get("weapon_direct").settle_down(TILES[0][0]);
		
		//怪物出没示例代码
		var monstershow = {
			LastTime: 0,
			span: 500,
			counter: 0,
			run: true
		}
		var monstersout = new util.animationEngine(function(timestamp){
			if(monstershow.LastTime + monstershow.span < timestamp){
				var enemySample = enemy.get("enemy_level1");
				gm.enemies.push(enemySample);
				canvas_svg.appendChild(enemySample.sprite.SVG_Obj);
				enemySample.move();
				monstershow.LastTime = timestamp;
				if(monstershow.counter ++ == 5)
					return false
			}
			return monstershow.run;
		}, function(){
			console.log("level monster all go out!");
		});
		//monstersout.start();
		
		var openShowProp = {
			LastTime: 0,
			span: 6000,
			counter: 0,
			run: true
		}
		var openShow = new util.animationEngine(function(timestamp){
			if(openShowProp.LastTime == 0 || openShowProp.LastTime + openShowProp.span < timestamp){
				monstershow.counter = 0;
				monstersout.start();
				openShowProp.LastTime = timestamp;
			}
			return openShowProp.run;
		}, function(){
			console.log("open show stop!");
		})
		openShow.start();
		
		document.getElementById('startBtn').onclick = function(){
			monstershow.run = false;
			openShowProp.run = false;
			Array.prototype.forEach.call(gm.enemies, function(element, index, array){
				element.health = -1000;
				element.DESTROY();
			})
			Array.prototype.forEach.call(gm.weapons, function(element, index, array){
				element.DESTROY();
			})
			Array.prototype.forEach.call(gm.TILES, function(element, index, array){
				Array.prototype.forEach.call(element, function(element){
					//console.log(element);
					element.DESTROY();
				})
			})
			gm.enemies = [];
			gm.weapons = [];
			gm.map.choice = "level1";
			paveTile();
			document.getElementById("informaitionLayer").classList.add("hide");
		}
	}
}).call(window, game, util, resource, enemy, weapon);