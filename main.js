const bg = new image("./assets/imgs/bg/room.png");
const grad = new image("./assets/imgs/bg/bg.png");
const rotate = new image("./assets/imgs/ui/rotate.png");
const eliza = new image("./assets/imgs/eliza/happy.png");
let bgMusicOn = true;
worries = {
  "INVALID": [
    "What if a dragon shows up during the tournament?",
    "What if my pet secretly dislikes me?",
    "What if the moon falls from the sky tonight?",
    "What if everyone at school forgets my name?",
    "What if my pencil decides to stop working during homework?",
    "What if my sneakers run away on their own?",
    "What if my lunchbox gets jealous of my backpack?",
    "What if aliens steal my homework?",
    "What if a bird carries me off while I’m playing outside?",
    "What if clouds fall down and block the roads?",
    "What if the internet decides to take a nap?",
    "What if my water bottle grows legs and runs away?",
    "What if all books suddenly become blank?",
    "What if my chair decides it doesn’t want me to sit anymore?",
    "What if squirrels take over the neighborhood?",
    "What if my bike starts talking and refuses to be ridden?",
    "What if trees start moving like people?",
    "What if all doors in the world disappear?",
    "What if my pet learns to talk and tells all my secrets?",
    "What if my school backpack grows wings and flies away?",
    "What if my shadow starts acting on its own?",
    "What if snow starts falling in the middle of summer?",
    "What if my favorite snack runs out forever?",
    "What if my bed decides it doesn’t like me anymore?",
    "What if gravity stops working for just me?",
    "What if my homework disappears into another dimension?",
    "What if the sun decides not to rise tomorrow?",
    "What if my pet suddenly becomes a superhero and forgets about me?"
  ],
  "VALID": [
    "What if I forget my kungfu moves during the match?",
    "What if I trip and fall in front of everyone?",
    "What if I don’t do well on my math test?",
    "What if I don’t remember my lines in the school play?",
    "What if I can’t finish my homework on time?",
    "What if my friend gets upset with me for something I said?",
    "What if my science project doesn’t work as planned?",
    "What if I feel too nervous to present in front of the class?",
    "What if I lose my favorite toy at the park?",
    "What if I forget to bring my lunch to school?",
    "What if I’m not ready for the big game?",
    "What if I don’t get picked for the team?",
    "What if I’m late for school and miss the bus?",
    "What if I spill something during lunch and everyone laughs?",
    "What if my drawing doesn’t turn out the way I want?",
    "What if I forget my lines in the talent show?",
    "What if my bike gets a flat tire on the way to school?",
    "What if I shrink to the size of an ant during class?",
    "What if my pet gets sick and needs to see a vet?",
    "What if I lose my library book and can’t find it?",
    "What if I don’t do well in my swimming lesson?",
    "What if I forget my instrument on band practice day?",
    "What if I don’t know anyone at the birthday party?",
    "What if I miss a step in my dance routine?",
    "What if I can’t figure out a puzzle during the competition?",
    "What if I feel too shy to answer a question in class?",
    "What if I don’t have enough time to finish my test?",
    "What if I lose the soccer ball during the game?",
    "What if I forget to pack something important for my trip?"
  ]
};


let shakeTimer = 0;
let lastShake = 0;
let transitionRectW = 0;
let isTransitioned = true;
let transSpeed = 0.1;

//mobile formatting//
function onResize(){
	canvas.style.width = "92.5vw"
	canvas.style.height = "90vh"
	sf[0] = window.innerWidth/windowW;
	sf[1] = window.innerHeight/windowH;
}

let failed = false;
function fail(){
	failed = true;
	sfx.fail.play();
	worry_increase = 0;
	for(let e of entities){
		if(e instanceof Worry){
			entities = arrayRemove(entities, e);
		}
	}
	shakeTimer = 1;
	nimbus.rect[1] = nimbus.restY;
	nimbus.change_string("Too many worries! Let’s try again to clear your mind.");
	nimbus.targetY = nimbus.openY;
	entities.push(new Button(
		[windowW/2-150,windowH/2+100,300,100],"./assets/imgs/ui/green_button01.png",
		"RETRY", "white", switch_to_main 
	));
	entities.push(new Button(
		[windowW/2-150,windowH/2+100+150,300,100],"./assets/imgs/ui/green_button01.png",
		"MENU", "white", switch_to_menu 
	));

}

function transition(){
	isTransitioned = false;
}

if(window.mobileCheck()){
	document.addEventListener('orientationchange', onResize);
	onResize();
}
//================//

let menu = false;
function switch_to_main(temp=null){
	failed = false;
	menu = false;
	transition();
	entities = [];
	nimbus.targetY = nimbus.restY;
	nimbus.rect[1] = nimbus.targetY;
	cloud_nums = 0;
	end = false;
	correct = 0;
	wrong = 0;
	worry_timer = 0;
	worry_increase = 0.5;
}

function unmute(btn){
	bgMusicOn = true;
	btn.img = new image("./assets/imgs/ui/audioOn.png");
	btn.onAction = mute;
	if(bgMusicOn){
		sfx.bg_music.volume(0.2);
	}else{
		sfx.bg_music.volume(0);
	}
}
function mute(btn){
	bgMusicOn = false;
	btn.img = new image("./assets/imgs/ui/audioOff.png");
	btn.onAction = unmute;
	if(bgMusicOn){
		sfx.bg_music.volume(0.2);
	}else{
		sfx.bg_music.volume(0);
	}
}

function switch_to_menu(){
	isEnd = false;
	transition();
	menu = true;
	entities = [];
	end = false;
	nimbus.change_string("Help Eliza manage her worries! Swipe right to dismiss unreliable worries and swipe left to keep valid concerns. Clear all the clouds before the Worry Bar fills up!");
	// start button
	entities.push(new Button(
		[windowW/2-150,windowH/2+100,300,100],"./assets/imgs/ui/green_button01.png",
		"START", "white", switch_to_main 
	));
	entities.push(new Button(
		[windowW/2-50,windowH/2+250,100,100],
		bgMusicOn ? "./assets/imgs/ui/audioOn.png":"./assets/imgs/ui/audioOff.png",
		"", "white", bgMusicOn ? mute : unmute
	));
	let tag = new Button(
		[windowW*(0.5 - 0.8/2),windowH*0.1,windowW*0.8,windowH*0.2],
		"./assets/imgs/ui/cloud.png",
		"The Worry Cloud Challenge", "black", null,
	);
	tag.override_size = windowH*0.06
	tag.disable = true;
	entities.push(tag);
}


// this inits the whole thing
switch_to_menu();
//
let jiggle_timer = 0;
function draw(){
	bg.drawImg(0,0,windowW,windowH, 1);
	if(!menu && isTransitioned){
		let w = windowW*0.8+10;
		let h = windowH*0.1+10;
		drawRect([(windowW-w)/2, (windowH*0.15-h)/2, w, h]);
		w -= 10;
		h -= 10;
		drawRect([(windowW-w)/2, (windowH*0.15-h)/2, w*(worry_timer/worry_max), h], "lightgrey");
	}
	if(menu){
		let jiggle = math.sin(jiggle_timer*math.pi/4)*10
		let y = windowH+10- windowW*0.38/1.6 + jiggle
		eliza.drawImg(0,y, windowW*0.38, windowW*0.38/1.6);
	}

	for(let e of entities){
		e.draw();
	}

	if(!menu && isTransitioned){
		grad.drawImg(0,0,windowW,windowH, 1);
		if(!end){
			showText((wrong+correct)+"/"+10, windowW/2-5, windowH*0.25+5, 45, "black", true)
			showText((wrong+correct)+"/"+10, windowW/2, windowH*0.25, 45, "white", true)
		}
	}

	if(end){
		let score = correct*100;
		if(wrong == 0){
			score += 50;
		}
		if(worry_timer <= worry_max/2){
			score += 50;
		}
		showText("FINAL SCORE: ", windowW/2-5, windowH*0.25+5, 35, "black", true)
		showText("FINAL SCORE: ", windowW/2, windowH*0.25, 35, "white", true)
		showText(score, windowW/2-5, windowH*0.3+5, 35, "black", true)
		showText(score, windowW/2, windowH*0.3, 35, "white", true)
	}

	nimbus.draw();
}

let rand_vec = [0,0];
function update_camera(dt){
	shakeTimer -= dt;
	if(shakeTimer > 0){
		if(Math.abs(lastShake - shakeTimer) < 0.1 || lastShake <= 0.1){
			rand_vec = [random(-5,5), random(-5,5)];
			lastShake = shakeTimer;
		}
		Camera.position = lerpArray(Camera.position, add(Camera.position, rand_vec), 1);
	}else{
		Camera.position = lerpArray(Camera.position, [0,0], 0.1);
	}
}

spawn_rate = 1;
spawn_timer = 0;
over = false; // debug
function update(dt){
	for(let e of entities){
		e.update(dt);
	}

	if(!menu){
		worry_timer += dt*worry_increase;

		spawn_timer += dt;
		if(spawn_timer > spawn_rate && cloud_nums < 10 && !failed){
			spawn_rate = over ? 0 : random(1.5,5);
			spawn_timer = 0;
			let type = random(0,1)>0.5 ? "INVALID" : "VALID";
			entities.push(new Worry(worries[type][random(0,worries[type].length-1,true)], type));
			sfx.woosh.play();
			cloud_nums += 1;
		}
	}else{
		jiggle_timer += dt;
	}

	if(worry_timer >= worry_max && !failed){
		fail();
	}
	if(failed){
		nimbus.targetY = nimbus.openY;
	}

	nimbus.update(dt);
	update_camera(dt);
}

let prev_time = 0
function main(curr_time){
	if(prev_time == 0){ prev_time = curr_time; }
	let dt = (curr_time - prev_time)/1000;
	prev_time = curr_time;

	if(isTransitioned){
		draw();
		update(dt);
		drawRect([0,0,transitionRectW,windowH])
		if(transitionRectW > 0){
			transitionRectW = lerp(transitionRectW, 0, transSpeed);
		}
	}else{
		drawRect([0,0,transitionRectW+5,windowH])
		transitionRectW = lerp(transitionRectW, windowW, transSpeed);
	}
	if(math.abs(transitionRectW - windowW) < 5){
		isTransitioned = true;
		transitionRectW = windowW
	}
	if(transitionRectW < 1){
		transitionRectW = 0
	}

	oldKeys = {...keys};
	if(window.mobileCheck()){
		onResize();
	}
	if(window.innerHeight > window.innerWidth){
		rotate.drawImg(windowW/2 - 150/sf[0],windowH/2 - 150/sf[1],300/sf[0],300/sf[1],1);
	}
	requestAnimationFrame(main);
}

requestAnimationFrame(main);

