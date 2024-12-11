let worry_timer = 0;
let worry_max = 45;
let worry_increase = 0.5;

class Nimbus{
	constructor(){
		this.restY = windowH*1.4;
		this.openY = windowH*0.66 - windowW*0.25/2;
		this.rect = [windowW*0.8 - windowW*0.125,this.restY,windowW*0.25, windowW*0.25];

		this.state = "motivated"
		this.imgs = {
			"nod":new image("./assets/imgs/nimbus/nodding.png"),
			"motivated":new image("./assets/imgs/nimbus/motivated.png"),
			"sad":new image("./assets/imgs/nimbus/sad.png"),
			"well":new image("./assets/imgs/nimbus/well_done.png"),
		}
		this.rot = 0;
		this.anim_timer = 0;
		this.string = "";

		this.restTimer = 0;

		this.targetY = this.openY;
		let w = windowW*0.5;
		let h = windowH*0.2;
		this.textBox = new TextBox(this.string, [windowW*0.5-w/2,windowH/2-h/2, w, h], 25, "black", [25,25]);
		this.bubble = new image("./assets/imgs/ui/button.png");
	}

	update_text_box_y(){
		this.textBox.rect[1] = this.rect[1] - windowH*0.1
	}

	update(dt){
		this.anim_timer += dt;
		this.update_text_box_y();

		this.rect[1] = lerp(this.rect[1], this.targetY, 0.1);
		if(this.restTimer > 0){
			this.restTimer -= dt;
			if(this.restTimer <= 0){
				this.targetY = this.restY;
			}
		}
	}

	change_string(new_string){
		this.string = new_string;
		let w = windowW*0.5;
		let h = windowH*0.2;
		this.textBox = new TextBox(this.string, [windowW*0.5-w/2, windowH/2-h/2, w, h], 25, "black", [25,25]);
	}

	draw(){
		this.rot = math.sin(this.anim_timer*math.pi/2)*math.pi/16
		let draw_rect = [...this.rect];
		draw_rect[1] += math.cos(this.anim_timer*math.pi/2)*10
		this.imgs[this.state].drawRotatedImg(...draw_rect, 1, this.rot);

		if(this.string.length > 0){
			draw_rect = [...this.textBox.rect];
			draw_rect[1] += 25
			draw_rect[0] -= 12
			this.bubble.drawImg(...enlargeRect(draw_rect,1,1.5), 1);
			this.textBox.draw();
		}
	}
}
let nimbus = new Nimbus();

class Overlay{
	constructor(col, lifetime){
		this.col = col;
		this.lifetime = lifetime;
		this.maxlifetime = lifetime;
	}
	draw(){
		drawRect([0,0,windowW,windowH], this.col, 1, this.col, this.lifetime/2*this.maxlifetime)
	}
	update(dt){
		this.lifetime -= dt;
		if(this.lifetime <= 0){
			entities = arrayRemove(entities, this);
		}
	}
}

class Button{
	constructor(rect, image_path, string, txt_col, onAction, font="Rubik Bubbles"){
		this.rect = rect;
		this.drawing_rect = rect;
		this.img = new image(image_path);
		this.string = string;
		this.col = txt_col;
		this.font = font;
		this.onAction = onAction;

		this.hovered = false;
		this.pressed = true;
		this.disable = false;
		this.prevHover = false;

		this.override_size = 0;
	}

	update(dt){
		let w = 40;
		let h = 40;
		this.hovered = AABBCollision(this.rect, [mouse.x-w/2,mouse.y-h/2,w,h])&&!this.disable;
		if(this.hovered){
			if(!this.prevHover){
				sfx.select.play();
			}
			if(mouse.button.left && !this.pressed){
				this.onAction(this)
				this.pressed = true;
				sfx.click.play();
			}
		}
		this.prevHover = this.hovered;
		this.pressed = mouse.button.left;
	}

	get center(){
		return [this.rect[0]+this.rect[2]/2, this.rect[1]+this.rect[3]/2];
	}

	draw(){
		let drawing_rect = [...this.drawing_rect];
		if(this.hovered){
			drawing_rect = enlargeRect(drawing_rect, 1.05, 1.05);
			if(this.pressed){
				drawing_rect = enlargeRect(drawing_rect, 0.92, 0.92);
			}
		}

		this.img.drawImg(...drawing_rect, 1);

		let size = drawing_rect[3]/2
		if(this.override_size > 0){
			size = this.override_size
		}
		showText(this.string, this.center[0], this.center[1] + this.rect[3]/7, size, this.col, false, false, this.font);
	}
}

class Worry{
	constructor(text, type){
		this.text = text;
		this.type = type; // valid or invalid -> string

		let w = 15 * this.text.length;
		this.rect = [random(windowW*0.1, windowW - w), windowH, w, windowW*0.1];
		this.targetY = random(windowH*0.25, windowH*0.6);

		this.offY = 0;
		this.timer = 0;
		this.pressed = false;
		this.old_rect = [...this.rect];

		this.start_positions = [[0,0,0,0], [0,0]];
		this.move_thresh = 1;
		this.held = false;

		this.swiped = false;
		this.img = new image("./assets/imgs/ui/cloud.png");

		this.nimbus_timer = 0;
	}

	validate(choice){
		if(choice == this.type){
			entities.push(new Overlay("green", 1));
			worry_increase *= 0.9;
			nimbus.state = "well";
			correct += 1;
			sfx.correct.play();
		}else{
			entities.push(new Overlay("red", 1));
			worry_increase += 1;
			nimbus.state = "sad";
			wrong += 1;
			sfx.wrong.play();
		}
		nimbus.restTimer = 2;
		nimbus.change_string("");
		nimbus.targetY = nimbus.openY;

		let no_clouds = true;
		for(let e of entities){
			if(e instanceof Worry && e != this){
				no_clouds = false;
				break;
			}
		}
		if(cloud_nums >= 10 && no_clouds){
			sfx.pop.play();
			end = true;
			nimbus.change_string("Great job! You've helped Eliza calm her mind! Try again for an even higher score!");
			nimbus.restTimer = 0;
			nimbus.targetY = nimbus.openY;
			nimbus.state = "motivated";
			worry_increase = 0;
			entities.push(new Button(
				[windowW/2-150,windowH/2+100,300,100],"./assets/imgs/ui/green_button01.png",
				"RETRY", "white", switch_to_main 
			));
			entities.push(new Button(
				[windowW/2-150,windowH/2+100+150,300,100],"./assets/imgs/ui/green_button01.png",
				"MENU", "white", switch_to_menu 
			));
		}
	}

	update(dt){
		this.rect[1] = lerp(this.rect[1], this.targetY + math.sin(this.timer*math.pi)*25, 0.05);
		this.timer += dt

		let w = 40;
		let h = 40;
		this.hovered = AABBCollision(this.rect, [mouse.x-w/2,mouse.y-h/2,w,h]);
		let not_held = true;
		for(let e of entities){
			if(e instanceof Worry && e != this){
				if(e.held){
					not_held = false;
					break;
				}
			}
		}
		if(((this.hovered && mouse.button.left) || this.held ) && not_held){
			if(!this.pressed){
				this.start_positions = [[...this.rect], [mouse.x, mouse.y]]
				this.held = true;
				sfx.click.play();
			}

			if(!this.pressed || this.held){
				this.rect[0] = lerp(this.rect[0], this.start_positions[0][0] + mouse.x - this.start_positions[1][0], 0.2);
				this.rect[1] = lerp(this.rect[1], this.start_positions[0][1] + mouse.y - this.start_positions[1][1], 0.2);
				this.targetY = this.rect[1];

				if(this.rect[0]+this.rect[2]*0.10 < 0 || this.rect[0]+this.rect[2]*0.90 > windowW){
					console.log(this.rect[0], windowW/2)
					if(this.rect[0] < windowW/3){
						this.swiped = 0 - this.rect[2]*2;
					}else{
						this.swiped = windowW + this.rect[2];
					}
					sfx.woosh.play()
					this.held = false;
				}
			}
		}

		if(!mouse.button.left && this.pressed){
			this.held = false;
		}

		if(this.swiped){
			this.rect[0] = lerp(this.rect[0], this.swiped, 0.1);
		}

		if(this.rect[0] < -this.rect[2]){ // swiped left
			entities = arrayRemove(entities, this);
			this.validate("VALID")
			return;
		}
		if(this.rect[0] > windowW){ // swiped left
			entities = arrayRemove(entities, this);
			this.validate("INVALID")
			return;
		}

		this.pressed = mouse.button.left;
		this.old_rect = [...this.rect];
	}

	draw(){
		let drawing_rect = [...this.rect];
		let off = 1;
		if(this.hovered || this.held){
			drawing_rect = enlargeRect(drawing_rect,1.1,1.1);
			off = 1.1;
		}
		//drawRect(drawing_rect, "black")
		this.img.drawImg(...drawing_rect, 1)
		showText(this.text, drawing_rect[0] + drawing_rect[2]/2, drawing_rect[1] + drawing_rect[3]*0.53, 20 * off);
	}
}

