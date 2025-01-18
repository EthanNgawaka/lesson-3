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
			draw_rect[0] -= 4
			this.bubble.drawImg(...enlargeRect(draw_rect,1,1.5), 1);
			this.textBox.draw();
		}
	}
}
let nimbus = new Nimbus();

class ComicChar{
	constructor(img_src, rect, text){
		this.string = "";
		this.img = new image(img_src);
		this.rect = rect;
		this.text = text;
		this.text_timer = 0;
		this.ind = 0;
		this.bubble = new image("./assets/imgs/ui/button.png");
		this.draw_rect = [...this.rect];
		this.draw_rect[1] = windowH;
		this.bubble_bounce = 0;
		this.targ = this.rect[1]
		this.textSpeed = 1;

		this.change_string(this.string);
	}
	change_string(new_string){
		this.string = new_string;
		let w = windowW*0.3;
		let h = windowH*0.3;
		this.textBox = new TextBox(this.string, [this.rect[0]-w/1.3, this.rect[1]-h/1.3, w, h], 30*this.bubble_bounce, "black", [25,25]);
		//this.textBox.rect = [this.rect[0]-w/1.3 - this.bubble_bounce*w, this.rect[1]-h/1.3 - this.bubble_bounce*h, this.bubble_bounce*w, this.bubble_bounce*h]
	}
	close(){
		this.targ = windowH;
	}
	update(dt){
		this.text_timer += dt;
		if(this.text_timer > 0.04/this.textSpeed && this.ind < this.text.length && math.abs(this.draw_rect[1]-this.rect[1]) < 1){
			this.bubble_bounce = lerp(this.bubble_bounce, (this.targ == windowH) ? 0 : 1, 0.3);
			let w = windowW*0.3;
			let h = windowH*0.3;
			this.change_string(this.string+this.text[this.ind]);
			this.textBox.rect = [w/2+this.rect[0]-w/1.3-w*this.bubble_bounce/2, h/2-h*this.bubble_bounce/2+this.rect[1]-h/2, this.bubble_bounce*w, this.bubble_bounce*h]
			this.textBox.textSize = 30*this.bubble_bounce;
			this.ind ++;
			this.text_timer = 0;
		}
		if(mouse.button.left && !mouse_down2){
			for(let s of sfx.intro){
				s.stop();
			}
			let check = true;
			for(let char of curr_chars[index]){
				if(char.string != char.text && char.string != "woah"){
					console.log(char)
					check = false
				}
			}
			console.log(check)
			if(this.ind >= this.text.length && check){
				this.close();
				if(this.text.length > 0){
					this.change_string("woah");
					this.ind = this.text.length
				}
			}else{
				this.textSpeed *= 2;
			}
		}
		if(this.ind >= this.text.length){
			let w = windowW*0.3;
			let h = windowH*0.3;
			this.bubble_bounce = lerp(this.bubble_bounce, (this.targ == windowH) ? 0 : 1, 0.3);
			this.textBox.rect = [w/2+this.rect[0]-w/1.3-w*this.bubble_bounce/2, h/2-h*this.bubble_bounce/2+this.rect[1]-h/2, this.bubble_bounce*w, this.bubble_bounce*h]
			this.textBox.textSize = math.max(30*this.bubble_bounce, 0);
			if(math.abs(windowH - this.draw_rect[1]) < 1 && this.targ == windowH){
				return true;
			}
		}
		return false;

	}
	draw(){
		this.draw_rect[1] = lerp(this.draw_rect[1], this.targ, 0.1);
		let draw_rect = [...this.draw_rect];
		this.img.drawImg(...draw_rect, 1);
		if(this.string.length > 0){
			draw_rect = [...this.textBox.rect];
			draw_rect[1] += 10
			draw_rect[0] -= 4
			this.bubble.drawImg(...draw_rect, 1);
			this.textBox.draw();
		}
	}
}

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
	constructor(rect, image_path, string, txt_col, onAction, font="Komika"){
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
		console.log(text, type);
		this.text = text;
		this.type = type; // valid or invalid -> string

		let w = 15 * this.text.length;
		this.rect = [random(windowW*0.1, windowW - w), windowH, w, windowW*0.1];
		this.targetY = random(windowH*0.25, windowH*0.6);
		this.targetX = this.rect[0];

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
		this.vel = [0,0]
		this.done_trans = false
	}

	validate(choice){
		if(choice == this.type){
			entities.push(new Overlay("green", 1));
			worry_increase *= 0.5;
			nimbus.state = "well";
			correct += 1;
			sfx.correct.play();
		}else{
			entities.push(new Overlay("red", 1));
			worry_increase += 0.6;
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
		if(cloud_nums >= 15 && no_clouds){
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
		this.rect[1] += this.vel[1]
		this.rect[0] += this.vel[0]
		let off = math.sin(this.timer*math.pi/2)*25

		let distx = (this.targetX - this.rect[0])
		let disty = (this.targetY+off - this.rect[1])

		if(this.held){
			this.rect[0] = this.targetX
			this.rect[1] = this.targetY
			this.vel = [0,0]
		}else{
			this.vel[0] += 0.005*(distx)
			this.vel[1] += 0.005*(disty)
			this.vel[1] = this.vel[1]*0.9
		}
		if(!this.done_trans){
			if(math.abs(this.targetY - this.rect[1]) < 1){
				this.done_trans = true;
			}
		}else{
			this.targetY = this.rect[1]
			if(this.targetY < 0 || this.targetY > windowH){
				this.done_trans = false;
				this.targetY = windowH/2
			}
		}



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
				//this.rect[0] = lerp(this.rect[0], this.start_positions[0][0] + mouse.x - this.start_positions[1][0], 0.2);
				//this.rect[1] = lerp(this.rect[1], this.start_positions[0][1] + mouse.y - this.start_positions[1][1], 0.2);
				this.targetX = this.start_positions[0][0] + mouse.x - this.start_positions[1][0];
				this.targetY = this.start_positions[0][1] + mouse.y - this.start_positions[1][1];

			}

		}
		if(this.rect[0]+this.rect[2]*0.20 < 0 || this.rect[0]+this.rect[2]*0.80 > windowW){
			if(this.rect[0] < windowW/3){
				this.swiped = 0 - this.rect[2]*2;
			}else{
				this.swiped = windowW + this.rect[2];
			}
			sfx.woosh.play()
			this.held = false;
		}

		if(!mouse.button.left && this.pressed){
			this.held = false;
			// released
			this.vel[0] = -(this.old_rect[0] - this.rect[0])
			this.vel[1] = -(this.old_rect[1] - this.rect[1])*2
		}
		if(!this.held){
			this.targetX = this.rect[0]
		}

		if(this.swiped){
			this.rect[0] = lerp(this.rect[0], this.swiped, 0.1);
		}

		if(this.rect[0] < -this.rect[2]){ // swiped left
			entities = arrayRemove(entities, this);
			sfx.woosh.play()
			this.validate("VALID")
			return;
		}
		if(this.rect[0] > windowW){ // swiped left
			entities = arrayRemove(entities, this);
		sfx.woosh.play()
			this.validate("INVALID")
			return;
		}

		this.pressed = mouse.button.left;
		this.old_rect = [...this.rect];
	}

	draw(){
		let drawing_rect = [...this.rect];
		let off = 1;
		let not_held = true;
		for(let e of entities){
			if(e instanceof Worry && e != this){
				if(e.held){
					not_held = false;
					break;
				}
			}
		}
		if((this.hovered&&not_held) || this.held){
			drawing_rect = enlargeRect(drawing_rect,1.1,1.1);
			off = 1.1;
		}
		//drawRect(drawing_rect, "black")
		this.img.drawImg(...drawing_rect, 1)
		showText(this.text, drawing_rect[0] + drawing_rect[2]/2, drawing_rect[1] + drawing_rect[3]*0.53, 20 * off);
	}
}

