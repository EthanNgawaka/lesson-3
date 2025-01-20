const bg = new image("./assets/imgs/bg/room.png");
const intro_bg = new image("./assets/imgs/bg/intro_bg.png");
const grad = new image("./assets/imgs/bg/bg.png");
const rotate = new image("./assets/imgs/ui/rotate.png");
const eliza = new image("./assets/imgs/eliza/happy.png");
let bgMusicOn = true;
let mouse_down2 = true;
let hard_mode = false;
let timeouts = [];

let intro = true;

let pool = [];
worries = {
  "VALID": [
    "My friend is being mean to others and I don't know if I should tell a teacher",
    "I forgot my homework and the assignment is due today",
    "My parents are arguing more than usual lately",
    "Someone keeps pushing me during recess",
    "I'm having trouble understanding math and falling behind",
    "My best friend started hanging out with other kids and leaving me out",
    "I lost my lunch money and don't know what to do",
    "My little sister crossed the street without looking both ways",
    "Someone is sending mean messages to my friend online",
    "I'm not feeling well but have an important test today",
    "A group of kids is pressuring me to break school rules",
    "My friend shared a secret that makes me worried about their safety",
    "I saw someone take something from another student's backpack",
    "My stomach really hurts and it's not getting better",
    "Someone I don't know tried talking to me on my way home",
    "I witnessed bullying in the bathroom and don't know what to do",
    "My friend is climbing something dangerous at the playground",
    "There's a strange car following our school bus",
    "I found inappropriate content on my tablet",
    "My younger sibling is about to touch something hot",
    "Someone brought something dangerous to school",
    "I'm being pressured to share my password with others",
    "A friend is planning to run away from home",
    "I saw someone being cruel to an animal near school",
    "My friend fainted during gym class",
    "There's an emergency at school and I can't find my teacher",
    "Someone keeps touching me in ways that make me uncomfortable",
    "I found pills that look like candy where little kids can reach",
    "My friend is stealing from the school store",
    "I'm lost in the mall and can't find my family",
    "Someone is threatening to hurt my pet",
    "The substitute teacher isn't following our safety procedures",
    "I saw older kids smoking behind the school",
    "My friend is copying answers during tests",
    "Someone keeps following me around at recess",
    "I saw a student with a weapon in their backpack",
    "My friend is sharing personal information with strangers online",
    "There's ice on the playground equipment that could hurt someone",
    "A bigger kid is demanding money from younger students",
    "I saw someone climbing through a window at school",
    "My friend hit their head really hard during sports and passed out",
    "Someone brought peanuts to class despite allergies",
    "I'm having trouble breathing during PE",
    "There's a fight happening in the cafeteria",
    "Someone is taking pictures of kids at the playground",
    "My friend ate something they're allergic to",
    "I saw someone breaking into a car in the school parking lot",
    "The emergency exit is blocked at school",
    "Someone brought medicine to school to share",
    "I found a dangerous tool in the art room"
  ],
  "INVALID": [
    "Everyone will hate me if I get the wrong answer in class",
    "My friends are probably talking about me behind my back",
    "If I don't get perfect grades, I'll never get into college",
    "My teacher probably thinks I'm stupid because I asked a question",
    "Everyone is staring at my new haircut and thinking it's ugly",
    "If I'm not the best at sports, no one will want me on their team",
    "My friends will stop liking me if I wear these clothes",
    "I must have said something wrong because someone laughed",
    "If I don't finish all my homework perfectly, I'll fail the grade",
    "Everyone will remember that time I tripped forever",
    "My best friend didn't sit with me once, they must hate me now",
    "If I'm not invited to one party, I'll never be invited anywhere again",
    "The presentation has to be perfect or everyone will laugh",
    "My art project isn't as good as others, so I'm not creative at all",
    "If I don't understand something immediately, I never will",
    "Everyone else finds this easy, I must be doing something wrong",
    "If I get nervous during my speech, my life will be ruined",
    "My friend didn't text back right away, they're mad at me",
    "If I don't make the team, everyone will think I'm a failure",
    "People will think I'm weird if I bring this lunch to school",
    "If I get one bad grade, I'll never get into a good college",
    "My teacher will be disappointed in me forever if I miss one assignment",
    "Everyone else has more friends than me",
    "If I make one mistake in the game, everyone will blame me",
    "My parents will be upset forever if I don't get an A",
    "No one probably wants to work with me on group projects",
    "If I wear the wrong thing on picture day, the photo will be awful forever",
    "Everyone else understands this except me",
    "If I don't get picked first, it means I'm not good at anything",
    "My friends will forget about me over summer break",
    "If I don't say the right thing, people will think I'm boring",
    "Everyone else is better at making friends than me",
    "If I get nervous during the test, I'll forget everything I studied",
    "My teacher will never like me if I make one mistake",
    "If I'm not good at sports, no one will want to play with me",
    "People are judging me whenever I eat lunch",
    "If I don't know the answer immediately, I must be dumb",
    "Everyone else has nicer clothes/shoes/supplies than me",
    "If I mess up in the school play, everyone will remember forever",
    "My friend group will replace me if I miss one hangout",
    "If I don't finish reading as fast as others, I'm falling behind",
    "People will think I'm weird if I share my real interests",
    "If I get nervous at the party, no one will invite me again",
    "Everyone else finds it easier to make conversation",
    "If I raise my hand and I'm wrong, everyone will laugh",
    "My friends only hang out with me because they feel sorry for me",
    "If I don't do everything perfectly, I'm letting everyone down",
    "People will think I'm strange if I bring my favorite toy to school",
    "If I don't get chosen for the special project, it means I'm not smart",
    "Everyone else has their future figured out except me"
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
function easy(btn){
	hard_mode = false;
	outline.rect[0] = ((windowW * (hard_mode ? 0.6 : 0.4))-66)
}
function hard(btn){
	hard_mode = true;
	outline.rect[0] = (windowW * (hard_mode ? 0.6 : 0.4))-66
}

let outline = null;
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
		[windowW*0.5-50,windowH/2+250,100,100],
		bgMusicOn ? "./assets/imgs/ui/audioOn.png":"./assets/imgs/ui/audioOff.png",
		"", "white", bgMusicOn ? mute : unmute
	));

	outline = new Button(
		enlargeRect([(windowW * (hard_mode ? 0.6 : 0.4))-60,windowH/2+250,120,100], 1.1, 1.1),"./assets/imgs/ui/outline.png",
		"", "white", function(){} 
	);
	entities.push(outline);
	entities.push(new Button(
		[windowW*0.4-60,windowH/2+250,120,100],
		"./assets/imgs/ui/green_button01.png",
		"EASY", "white", easy
	));
	entities.push(new Button(
		[windowW*0.6-60,windowH/2+250,120,100],
		"./assets/imgs/ui/red_button04.png",
		"HARD", "white", hard
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
let loading = true;
if(over){
	//spawn_rate = 0;
	loading = false;
	intro = false;
}
function update(dt){
	for(let e of entities){
		e.update(dt);
	}

	if(!menu){
		let mult = 1;
		if(!hard_mode){
			mult = 0.5;
		}
		worry_timer += dt*worry_increase*mult;

		spawn_timer += dt*mult;
		if(spawn_timer > spawn_rate && cloud_nums < 15 && !failed){
			spawn_rate = over ? 0 : random(3.5,6);
			spawn_timer = 0;
			let type = pool[pool.length-1];
			pool.pop()
			choice = random(0,worry_pool[type].length-1,true)
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
let mouse_down = false;
let t = 0;

let index = 0;
let change = false;
let play_start =true;
let curr_chars = [
	[
		new ComicChar("./assets/imgs/intro/eliza1.png",
			[windowW*0.3, windowH*0.2, windowH*0.8, windowH*0.8],
			"Woah! Seems like Wu Lee was really worrying about something that's completely unreliable..."),
		new ComicChar("./assets/imgs/intro/wuli.png",
			[0, 0, windowW*1, windowH*1],
			""),
	],
	[
		new ComicChar("./assets/imgs/intro/bear.png",
			[windowW*0.5, windowH*0.2, windowW*0.5, windowH*0.7],
			""),
		new ComicChar("./assets/imgs/intro/wuli.png",
			[0,0, windowW, windowH],
			""),
		new ComicChar("./assets/imgs/intro/eliza2.png",
			[windowW*0.25, windowH*0.25, windowH*0.75, windowH*0.75],
			"I mean... the black bear doesn't even exist!"),
	],
	[
		new ComicChar("./assets/imgs/intro/eliza3.png",
			[windowW*0.3, windowH*0.2, windowH*0.8, windowH*0.8],
			"Come to think of it... I've had same experiences in the past..."),
	],
	[
		new ComicChar("./assets/imgs/intro/eliza4.png",
			[windowW*0.3, windowH*0.3, windowW*0.7, windowH*0.7],
			"Let's try and sort some of my past worries into reliable or unreliable!"),
	]
];

function main(curr_time){
	if(prev_time == 0){ prev_time = curr_time; }
	let dt = (curr_time - prev_time)/1000;
	prev_time = curr_time;

	if(loading){
		drawRect([0,0,windowW,windowH], "black");
		console.log(total_images, loaded_images);
		if(total_images == loaded_images){
			showText("Click to continue...",windowW/2, windowH/2, 40, "white")
			if(mouse.button.left){
				loading=false;
				mouse_down =true;
			}
			if(window.mobileCheck()){
				onResize();
			}
			if(window.innerHeight > window.innerWidth){
				rotate.drawImg(windowW/2 - 150/sf[0],windowH/2 - 150/sf[1],300/sf[0],300/sf[1],1);
			}
			requestAnimationFrame(main);
			return;
		}
		t += dt;
		let r = 100
		for(let i = 1; i < 6; i++){
			drawCircle([windowW/2 + math.sin((i*math.pi/6 + t*math.pi))*r, windowH/2 + r*math.cos((i*math.pi/6 + t*math.pi))], 10, "white");
		}
		showText("Loading...",windowW/2, windowH/2 + 150, 20, "white")
		showText(loaded_images+"/"+total_images,windowW/2, windowH/2 + 200, 20, "white");
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

	if(intro){
		if(play_start){
			timeouts.push(setTimeout(()=>{                         
				sfx.intro[index].play()}, (1000)));
			play_start = false;
		}
		intro_bg.drawImg(0,0,windowW,windowH,1);
		let check = true;
		for(let char of curr_chars[index]){
			if(!char.update(dt)){
				check = false;
			}
			char.draw();
		}
		if(check){
			index++;
			for(let s of sfx.intro){
				s.stop();
			}
			if(index >= curr_chars.length){
				intro = false;
			}else{
				timeouts.push(setTimeout(()=>{                         
					sfx.intro[index].play()}, (1000)));
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
		mouse_down2 = mouse.button.left
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
	console.log(hard_mode);
	requestAnimationFrame(main);
}

requestAnimationFrame(main);

