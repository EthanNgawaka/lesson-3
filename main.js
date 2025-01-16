const bg = new image("./assets/imgs/bg/room.png");
const grad = new image("./assets/imgs/bg/bg.png");
const rotate = new image("./assets/imgs/ui/rotate.png");
const eliza = new image("./assets/imgs/eliza/happy.png");
let bgMusicOn = true;

let intro = true;

let pool = [];
worries = {
  "VALID": [
    "What if I don’t have enough time to prepare for the test?",
    "What if my friend misunderstood something I said?",
    "What if I don’t finish my art project on time?",
    "What if I don’t know the answer to the teacher’s question?",
    "What if I feel shy and struggle to make friends at the party?",
    "What if I don’t perform as well as I’d like in the game?",
    "What if I accidentally forget to refill my pet’s water bowl?",
    "What if I make a mistake during my class presentation?",
    "What if I forget my PE uniform for class?",
    "What if I struggle to understand today’s lesson?",
    "What if I forget what to say during my presentation?",
    "What if I don’t finish my homework neatly on time?",
    "What if I forget to bring lunch and feel hungry?",
    "What if I can’t find my library book to return it?",
    "What if I have a disagreement with a close friend?",
    "What if I don’t understand the assignment and need clarification?",
    "What if I struggle to contribute my best in the group project?",
    "What if I trip and feel embarrassed for a moment?",
    "What if I miss the bus and arrive late to class?",
    "What if I spill something and need help cleaning up?",
    "What if I feel too shy to ask a question in front of the class?",
    "What if I don’t complete my homework on time?",
    "What if I feel nervous about hosting my birthday party?",
    "What if I feel too nervous to share during show-and-tell?",
    "What if my shoes feel uncomfortable during the day?",
    "What if I feel nervous about staying with the group on the trip?",
    "What if I don’t understand today’s math homework?",
    "What if I don’t play my best in today’s practice?",
    "What if I don’t do well on this quiz and need to review harder?"
  ],
  "INVALID": [
    "What if I fail the test and the teacher never forgives me?",
    "What if my friend secretly doesn’t like me anymore?",
    "What if my drawing is so bad that everyone laughs at me?",
    "What if the teacher calls on me and I freeze up completely?",
    "What if nobody talks to me at the party?",
    "What if I lose the soccer game and everyone blames me?",
    "What if my pet gets mad at me because I forgot to feed them once?",
    "What if my classmates laugh at me for trying something new?",
    "What if I’m the only one wearing the wrong clothes for school?",
    "What if my teacher thinks I’m not smart because I didn’t get a perfect grade?",
    "What if I make a small mistake and everyone remembers forever?",
    "What if my handwriting is too messy and the teacher can’t read it?",
    "What if my lunch isn’t as good as everyone else’s?",
    "What if I forget my library book and I’m banned forever?",
    "What if my friends stop inviting me to play with them?",
    "What if my teacher gets mad at me for asking too many questions?",
    "What if my team doesn’t want me to play in the group project?",
    "What if I trip and everyone in school laughs at me forever?",
    "What if I’m late for school and the teacher sends me home?",
    "What if I accidentally spill something during lunch and it becomes a huge deal?",
    "What if my question in class is the wrong one and everyone laughs?",
    "What if my homework isn’t perfect and the teacher gets disappointed?",
    "What if my birthday party isn’t as fun as everyone expects?",
    "What if my classmates don’t like the story I share during show-and-tell?",
    "What if my shoes squeak too loudly and everyone notices?",
    "What if I get lost during the school trip and can’t find anyone?",
    "What if the teacher thinks I’m bad at math because I made a mistake?",
    "What if my soccer coach thinks I’m not good enough because I missed one goal?",
    "What if I fail one quiz and it ruins my entire school year?"
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
function shuffle(array) { // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}
function switch_to_main(temp=null){
	worry_pool = {...worries}
	pool = [
		"INVALID","INVALID","INVALID","INVALID","INVALID","INVALID","INVALID","INVALID","INVALID",
		"VALID","VALID","VALID","VALID","VALID","VALID",
	];
	shuffle(pool)
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
	worry_increase = 0.3;
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
		"Worry Cloud Buster", "black", null, "Montserrat"
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
			showText((wrong+correct)+"/"+15, windowW/2-5, windowH*0.25+5, 45, "black", true)
			showText((wrong+correct)+"/"+15, windowW/2, windowH*0.25, 45, "white", true)
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

spawn_rate = 2;
spawn_timer = 0;
over = false; // debug
function update(dt){
	for(let e of entities){
		e.update(dt);
	}

	if(!menu){
		worry_timer += dt*worry_increase;

		spawn_timer += dt;
		if(spawn_timer > spawn_rate && cloud_nums < 15 && !failed){
			spawn_rate = over ? 0 : random(3.5,6);
			spawn_timer = 0;
			let type = pool[pool.length-1];
			pool.pop()
			choice = random(0,worries[type].length-1,true)
			entities.push(new Worry(worry_pool[type][choice], type));
			worry_pool[type] = arrayRemove(worry_pool[type], worry_pool[type][choice])
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

let prev_time = 0;
let imgs = [new image("./assets/intro/1.jpg"), new image("./assets/intro/2.jpg"), new image("./assets/intro/3.jpg"), new image("./assets/intro/4.jpg")];
let curr_intro_img = 0;
let prev_img_pos = [0,0];
let curr_img_pos = [0,0];
let mouse_down = false;
function main(curr_time){
	if(prev_time == 0){ prev_time = curr_time; }
	let dt = (curr_time - prev_time)/1000;
	prev_time = curr_time;

	if(intro){
		if(curr_intro_img > 0){
			imgs[curr_intro_img-1].drawImg(prev_img_pos[0],prev_img_pos[1],windowW,windowH);
		}
		imgs[curr_intro_img].drawImg(curr_img_pos[0],curr_img_pos[1],windowW,windowH);
		prev_img_pos[0] = lerp(prev_img_pos[0], -windowW, 0.1);
		curr_img_pos[0] = lerp(curr_img_pos[0], 0, 0.1);
		if(mouse.button.left && !mouse_down){
			curr_intro_img++;
			curr_img_pos[0] = windowW;
			prev_img_pos[0] = 0;
			if(curr_intro_img > 3){
				intro = false;
			}
		}
		mouse_down = mouse.button.left;
		oldKeys = {...keys};
		if(window.mobileCheck()){
			onResize();
		}
		if(window.innerHeight > window.innerWidth){
			rotate.drawImg(windowW/2 - 150/sf[0],windowH/2 - 150/sf[1],300/sf[0],300/sf[1],1);
		}
		requestAnimationFrame(main);
		return;
	}

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

