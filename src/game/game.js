let stats, wall;
var box, PLAYER_NAME = "Kanishk";

THREE.Cache.enabled = true;

class Game{
	constructor(){
		if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

		this.modes = Object.freeze({
			NONE:   Symbol("none"),
			PRELOAD: Symbol("preload"),
			INITIALISING:  Symbol("initialising"),
			CREATING_LEVEL: Symbol("creating_level"),
			ACTIVE: Symbol("active"),
			GAMEOVER: Symbol("gameover")
		});
		this.mode = this.modes.NONE;
		
		this.container;
		this.player;
		this.cameras;
		this.camera;
		this.scene;
		this.renderer;
		this.animations = {};
		this.assetsPath = 'assets/';
		
		this.remotePlayers = [];
		this.remoteColliders = [];
		this.initialisingPlayers = [];
		this.remoteData = [];
		
		this.messages = { 
			text:[ 
			"Welcome to WoWMeet",
			"WoWExp Virtual Meet"
			],
			index:0
		}
		
		this.container = document.createElement( 'div' );
		this.container.style.height = '100%';
		document.body.appendChild( this.container );
		
		const sfxExt = SFX.supportsAudioType('mp3') ? 'mp3' : 'ogg';
        
		const game = this;
		this.anims = ['Walking', 'Walking Backwards', 'Turn', 'Running', 'Pointing', 'Talking', 'Pointing Gesture'];
		
		const options = {
			assets:[
				`${this.assetsPath}images/nx.jpg`,
				`${this.assetsPath}images/px.jpg`,
				`${this.assetsPath}images/ny.jpg`,
				`${this.assetsPath}images/py.jpg`,
				`${this.assetsPath}images/nz.jpg`,
				`${this.assetsPath}images/pz.jpg`
			],
			oncomplete: function(){
				game.init();
			}
		}
		
		this.anims.forEach( function(anim){ options.assets.push(`${game.assetsPath}fbx/anims/${anim}.fbx`)});
		options.assets.push(`${game.assetsPath}fbx/wowmeet.fbx`);
		
		this.mode = this.modes.PRELOAD;
		
		this.clock = new THREE.Clock();

		const preloader = new Preloader(options);
		
		window.onError = function(error){
			console.error(JSON.stringify(error));
		}
	}
	
	initSfx(){
		this.sfx = {};
		this.sfx.context = new (window.AudioContext || window.webkitAudioContext)();
		this.sfx.gliss = new SFX({
			context: this.sfx.context,
			src:{mp3:`${this.assetsPath}sfx/gliss.mp3`, ogg:`${this.assetsPath}sfx/gliss.ogg`},
			loop: false,
			volume: 0.3
		});
	}
	
	set activeCamera(object){
		this.cameras.active = object;
	}
	
	init() {
		this.mode = this.modes.INITIALISING;

		this.camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 10, 20000 );
		
		this.scene = new THREE.Scene();
		// this.scene.background = new THREE.Color( 0x00a0f0 );
		// this.scene.fog = new THREE.Fog(0xFFFFFF, 50, 5000);

		const ambient = new THREE.AmbientLight( 0xfcdbae, 0.5 );
        this.scene.add( ambient );

		const light1 = new THREE.SpotLight( 0xaaaaaa, 0.5, 1000, Math.PI/4, 0.5, 0.75 );
        light1.position.set( -750, 700, -700 );
        light1.target.position.set( 0, 0, 0 );
		this.scene.add(light1);
		this.scene.add(light1.target);

		// const light2 = new THREE.SpotLight( 0xaaaaaa, 1, 1000, Math.PI/4, 0.5, 0.75 );
		const light2 = new THREE.DirectionalLight( 0xfcdbae, 0.4 );
        light2.position.set( 750, 700, -700 );
        light2.target.position.set( 0, 0, 0 );
		this.scene.add(light2);
		this.scene.add(light2.target);

		// const light3 = new THREE.SpotLight( 0xaaaaaa, 1, 1000, Math.PI/4, 0.5, 0.75 );
		const light3 = new THREE.DirectionalLight( 0xfcdbae, 0.4 );
        light3.position.set(-950, 700, 1500 );
        light3.target.position.set( 0, 0, 0 );
		this.scene.add(light3);
		this.scene.add(light3.target);

		// const light4 = new THREE.SpotLight( 0xaaaaaa, 1, 1000, Math.PI/4, 0.5, 0.75 );
        const light4 = new THREE.DirectionalLight( 0xfcdbae, 0.4 );
        light4.position.set( -700, 700, -1500 );
        light4.target.position.set( 0, 0, 0 );
		this.scene.add(light4);
		this.scene.add(light4.target);

		const light5 = new THREE.DirectionalLight( 0xfcdbae, 0.4 );
        light5.position.set(950, 700, 1500 );
        light5.target.position.set( 0, 0, 0 );
		this.scene.add(light5);
		this.scene.add(light5.target);

        const light = new THREE.DirectionalLight( 0xaaaaaa, 0.8 );
        light.position.set( -1000, 1000, 500 );
        light.target.position.set( 0, 0, 0 );
        light.castShadow = true;
		const lightSize = 2500;
        light.shadow.camera.near = 500;
        light.shadow.camera.far = 5000;
		light.shadow.camera.left = light.shadow.camera.bottom = -lightSize;
		light.shadow.camera.right = light.shadow.camera.top = lightSize;
        light.shadow.bias = 0.0039;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
		this.sun = light;
		this.scene.add(light);
		this.scene.add(light.target);

		// let helper = new THREE.SpotLightHelper(light4);
		// let helper = new THREE.DirectionalLightHelper(light, 500);
		// light4.add(helper);

		// model
		const loader = new THREE.FBXLoader();
		const game = this;
		
		this.player = new PlayerLocal(this);
		
		this.loadEnvironment(loader);
		
		this.speechBubble = new SpeechBubble(this, "", 150);
		this.speechBubble.mesh.position.set(0, 350, 0);
		this.speechBubble.mesh.material.opacity = 0;

		this.nameBubble = new NameBubble(this, "", 150);
		this.nameBubble.mesh.position.set(0, 500, -50);
		this.nameBubble.mesh.material.opacity = 0;;
		
		this.joystick = new JoyStick({
			onMove: this.playerControl,
			game: this
		});
		
		this.renderer = new THREE.WebGLRenderer( { antialias: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.renderer.physicallyCorrectLights = false;
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.container.appendChild( this.renderer.domElement );
		
		if ('ontouchstart' in window){
			window.addEventListener( 'touchdown', (event) => game.onMouseDown(event), false );
		}else{
			window.addEventListener( 'mousedown', (event) => game.onMouseDown(event), false );	
		}
		
		window.addEventListener( 'resize', () => game.onWindowResize(), false );

		// stats = Stats();
    	// document.body.appendChild(stats.dom);
	}
	
	loadEnvironment(loader){
		const game = this;
		loader.load(`${this.assetsPath}fbx/wowmeet.fbx`, function(object){
			game.environment = object;
			game.colliders = [];
			object.scale.set(32, 32, 32);
			object.position.set(0, 0, 400);
			game.scene.add(object);

			// box = new THREE.Box3();
			// box.setFromObject(object);

			object.traverse( function ( child ) {
				if ( child.isMesh ) {
						game.colliders.push(child);
						child.material.visible = true;
						// child.castShadow = true;
						child.receiveShadow = true;
					}
			} );
			// game.colliders.push(game.camera);
			// console.log(game.colliders);

			// const floor = game.scene.getObjectByName("floor2");
			// // console.log(floor);
			// floor.receiveShadow = true;

			let chairs = game.scene.getObjectByName("chairs");
			for(let x=0; x<chairs.children.length; x++){
				chairs.children[x].castShadow =true;
				// chairs.children[x].material = new THREE.MeshPhongMaterial( {
				// 	roughness: 0.5,
				// 	color: 0x5A5A5A,
				// 	metalness: 0.25,
				// 	bumpScale: 0.005
				// } );
				// chairs.children[x].material.metalness = 1;
				// chairs.children[x].material.roughness = 0.005;
				// console.log(chairs.children[x].material.roughness);
				// const chairMesh = new THREE.Mesh( chairs.children[x], chairs.children[x].material );
				// game.scene.add( chairMesh );
			}

			// floor
			// wall = game.scene.getObjectByName("wall");
			// // console.log(wall.material[2]);
			// wall.material[2].metalness = 0.5;
			// wall.material[2].roughness = 0.05;
			// wall.material[2].bumpScale = 0.05;
			// wall.material[2].transparent = true;
			// wall.material[2].needsUpdate = true;
			// console.log(wall.material[2]);

			let table = game.scene.getObjectByName("table");
			table.castShadow = true;
			// let tableMat = table.material[0];
			// console.log(table.material[0]);
			// let newTableMat = new THREE.MeshStandardMaterial( {
			// 	roughness: 0.05,
			// 	// color: 0xffffff,
			// 	metalness: 0.25,
			// 	bumpScale: 0.005
			// } );
			// const tabletextureLoader = new THREE.TextureLoader();
			// tabletextureLoader.load( "textures/hardwood2_diffuse.webp", function ( map ) {
			
			// 	map.wrapS = THREE.RepeatWrapping;
			// 	map.wrapT = THREE.RepeatWrapping;
			// 	map.anisotropy = 4;
			// 	map.repeat.set( 30, 72 );
			// 	map.encoding = THREE.sRGBEncoding;
			// 	tableMat.map = map;
			// 	tableMat.needsUpdate = true;
			
			// } );
			// tabletextureLoader.load( "textures/hardwood2_bump.webp", function ( map ) {
			
			// 	map.wrapS = THREE.RepeatWrapping;
			// 	map.wrapT = THREE.RepeatWrapping;
			// 	map.anisotropy = 4;
			// 	map.repeat.set( 30, 72 );
			// 	tableMat.bumpMap = map;
			// 	tableMat.needsUpdate = true;
			
			// } );
			// tabletextureLoader.load( "textures/hardwood2_roughness.webp", function ( map ) {
			
			// 	map.wrapS = THREE.RepeatWrapping;
			// 	map.wrapT = THREE.RepeatWrapping;
			// 	map.anisotropy = 4;
			// 	map.repeat.set( 30, 72 );
			// 	tableMat.roughnessMap = map;
			// 	tableMat.needsUpdate = true;
			
			// } );
			// const tableGeometry = new THREE.PlaneGeometry( 120, 120 );
			// const tableMesh = new THREE.Mesh( table.geometry, newTableMat );
			// // tableMesh.receiveShadow = true;
			// // tableMesh.rotation.x = - Math.PI / 2.0;
			// // tableMesh.position.y = -1;
			// scene.add( tableMesh );
			
			// const tloader = new THREE.CubeTextureLoader();
			// tloader.setPath( `${game.assetsPath}/images/` );

			// var textureCube = tloader.load( [
			// 	'px.jpg', 'nx.jpg',
			// 	'py.jpg', 'ny.jpg',
			// 	'pz.jpg', 'nz.jpg'
			// ] );

			// game.scene.background = textureCube;
			
			game.loadNextAnim(loader);
		})
	}

	loadNextAnim(loader){
		let anim = this.anims.pop();
		const game = this;
		loader.load( `${this.assetsPath}fbx/anims/${anim}.fbx`, function( object ){
			game.player.animations[anim] = object.animations[0];
			if (game.anims.length>0){
				game.loadNextAnim(loader);
			}else{
				delete game.anims;
				game.action = "Idle";
				game.mode = game.modes.ACTIVE;
				game.animate();
			}
		});	
	}
	
	playerControl(forward, turn){
		turn = -turn;
		
		if (forward>0.3){
			if (this.player.action!='Walking' && this.player.action!='Running') this.player.action = 'Walking';
		}else if (forward<-0.3){
			if (this.player.action!='Walking Backwards') this.player.action = 'Walking Backwards';
		}else{
			forward = 0;
			if (Math.abs(turn)>0.1){
				if (this.player.action != 'Turn') this.player.action = 'Turn';
			}else if (this.player.action!="Idle"){
				this.player.action = 'Idle';
			}
		}
		
		if (forward==0 && turn==0){
			delete this.player.motion;
		}else{
			this.player.motion = { forward, turn };
		}
		
		this.player.updateSocket();
	}
	
	createCameras(){
		const offset = new THREE.Vector3(0, 0, 0);
		const front = new THREE.Object3D();
		front.position.set(112, 400, 700);
		front.parent = this.player.object;
		const back = new THREE.Object3D();
		back.position.set(0, 400, -600);
		back.parent = this.player.object;
		const chat = new THREE.Object3D();
		chat.position.set(0, 200, -450);
		chat.parent = this.player.object;
		const wide = new THREE.Object3D();
		wide.position.set(178, 139, 1665);
		wide.parent = this.player.object;
		const overhead = new THREE.Object3D();
		overhead.position.set(0, 700, 0);
		overhead.parent = this.player.object;
		const collect = new THREE.Object3D();
		collect.position.set(40, 82, 94);
		collect.parent = this.player.object;
		this.cameras = { front, back, wide, overhead, collect, chat };
		this.activeCamera = this.cameras.back;	
	}
	
	showMessage(msg, fontSize=20, onOK=null){
		const txt = document.getElementById('message_text');
		txt.innerHTML = msg;
		txt.style.fontSize = fontSize + 'px';
		const btn = document.getElementById('message_ok');
		const panel = document.getElementById('message');
		const game = this;
		if (onOK!=null){
			btn.onclick = function(){ 
				panel.style.display = 'none';
				onOK.call(game); 
			}
		}else{
			btn.onclick = function(){
				panel.style.display = 'none';
			}
		}
		panel.style.display = 'flex';
	}
	
	onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize( window.innerWidth, window.innerHeight );

	}
	
	updateRemotePlayers(dt){
		if (this.remoteData===undefined || this.remoteData.length == 0 || this.player===undefined || this.player.id===undefined) return;
		
		const newPlayers = [];
		const game = this;
		//Get all remotePlayers from remoteData array
		const remotePlayers = [];
		const remoteColliders = [];
		
		this.remoteData.forEach( function(data){
			if (game.player.id != data.id){
				//Is this player being initialised?
				let iplayer;
				game.initialisingPlayers.forEach( function(player){
					if (player.id == data.id) iplayer = player;
					game.nameBubble.updateName(PLAYER_NAME);
				});
				//If not being initialised check the remotePlayers array
				if (iplayer===undefined){
					let rplayer;
					game.remotePlayers.forEach( function(player){
						if (player.id == data.id) rplayer = player;
					});
					if (rplayer===undefined){
						//Initialise player
						game.initialisingPlayers.push( new Player( game, data ));
					}else{
						//Player exists
						remotePlayers.push(rplayer);
						remoteColliders.push(rplayer.collider);
					}
				}
			}
		});
		
		this.scene.children.forEach( function(object){
			if (object.userData.remotePlayer && game.getRemotePlayerById(object.userData.id)==undefined){
				game.scene.remove(object);
			}	
		});
		
		this.remotePlayers = remotePlayers;
		this.remoteColliders = remoteColliders;
		this.remotePlayers.forEach(function(player){ 
			player.update( dt ); 
			// game.nameBubble.mesh.position.copy(player.position);
			// console.log(this.game.nameBubble.mesh.position);
		});	
	}
	
	onMouseDown( event ) {
		if (this.remoteColliders===undefined || this.remoteColliders.length==0 || this.speechBubble===undefined || this.speechBubble.mesh===undefined) return;
		
		// mouse position in normalized device coordinates
		// (-1 to +1) for both components
		const mouse = new THREE.Vector2();
		mouse.x = ( event.clientX / this.renderer.domElement.clientWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / this.renderer.domElement.clientHeight ) * 2 + 1;

		const raycaster = new THREE.Raycaster();
		raycaster.setFromCamera( mouse, this.camera );
		
		const intersects = raycaster.intersectObjects( this.remoteColliders );
		const chat = document.getElementById('chat');
		
		if (intersects.length>0){
			const object = intersects[0].object;
			const players = this.remotePlayers.filter( function(player){
				if (player.collider!==undefined && player.collider==object){
					return true;
				}
			});
			if (players.length>0){
				const player = players[0];
				console.log(`onMouseDown: player ${player.id}`);

				this.speechBubble.player = player;
				this.speechBubble.update('');
				this.scene.add(this.speechBubble.mesh);
				this.speechBubble.mesh.material.opacity = 1;

				this.nameBubble.player = player;
				this.nameBubble.updateName('');
				this.scene.add(this.nameBubble.mesh);

				this.chatSocketId = player.id;
				chat.style.bottom = '0px';
				this.activeCamera = this.cameras.chat;
			}
		}else{
			//Is the chat panel visible?
			if (chat.style.bottom=='0px' && (window.innerHeight - event.clientY)>40){
				console.log("onMouseDown: No player found");
				if (this.speechBubble.mesh.parent!==null) this.speechBubble.mesh.parent.remove(this.speechBubble.mesh);
				delete this.speechBubble.player;
				delete this.chatSocketId;
				chat.style.bottom = '-50px';
				this.activeCamera = this.cameras.back;
			}else{
				console.log("onMouseDown: typing");
			}
		}
	}
	
	getRemotePlayerById(id){
		if (this.remotePlayers===undefined || this.remotePlayers.length==0) return;
		
		const players = this.remotePlayers.filter(function(player){
			if (player.id == id) return true;
		});	
		
		if (players.length==0) return;
		
		return players[0];
	}
	
	animate() {
		const game = this;
		const dt = this.clock.getDelta();
		
		requestAnimationFrame( function(){ game.animate(); } );
		
		this.updateRemotePlayers(dt);
		
		if (this.player.mixer!=undefined && this.mode==this.modes.ACTIVE) this.player.mixer.update(dt);
		
		if (this.player.action=='Walking'){
			const elapsedTime = Date.now() - this.player.actionTime;
			if (elapsedTime>1000 && this.player.motion.forward>0){
				this.player.action = 'Running';
			}
		}
		
		if (this.player.motion !== undefined) this.player.move(dt);
		
		if (this.cameras!=undefined && this.cameras.active!=undefined && this.player!==undefined && this.player.object!==undefined){
			this.camera.position.lerp(this.cameras.active.getWorldPosition(new THREE.Vector3()), 0.05);
			const pos = this.player.object.position.clone();
			if (this.cameras.active==this.cameras.chat){
				pos.y += 200;
			}else{
				pos.y += 300;
			}
			this.camera.lookAt(pos);
		}
		
		// if (this.sun !== undefined){
		// 	this.sun.position.copy( this.camera.position );
		// 	this.sun.position.y += 1500;
		// }

		game.nameBubble.mesh.position.copy(this.player.object.position);
		game.nameBubble.mesh.position.y += 400;
		game.nameBubble.mesh.rotation.y = Math.PI;
		
		if (this.speechBubble!==undefined) this.speechBubble.show(this.camera.position);
		if (this.nameBubble!==undefined) this.nameBubble.show(this.camera.position);

		// wall.material[2].needsUpdate = true;
		
		// // camera constraints update
		// if(this.camera.position.x > box.max.x){
		// 	this.camera.position.x = box.max.x;
		// }
		
		// if(this.camera.position.x < box.min.x){
		// 	this.camera.position.x = box.max.x;
		// }
		
		// if(this.camera.position.z > box.max.z){
		// 	this.camera.position.z = box.max.z;
		// }
		
		// if(this.camera.position.z < box.min.z){
		// 	this.camera.position.z = box.max.z;
		// }

		// console.log(this.camera.position.x);
		// console.log(this.camera.position.z);
		// console.log("max x = "+box.max.x);
		// console.log("max z = "+box.max.z);
		
		// game.nameBubble.mesh.position.copy(this.player.object.position);
		// game.nameBubble.mesh.position.y += 400;
		// game.nameBubble.mesh.rotation.y = Math.PI;
		// console.log(this.player.object.position);
		// console.log(game.nameBubble.mesh.position);

		this.renderer.render( this.scene, this.camera );

		// stats.update();
	}
}

class Player{
	constructor(game, options){
		this.local = true;
		let model, colour;
		
		const colours = ['Black', 'Brown', 'White'];
		colour = colours[Math.floor(Math.random()*colours.length)];
									
		if (options===undefined){
			const people = ['BusinessMan', 'Doctor', 'FireFighter', 'Housewife', 'Policeman', 'Punk', 'RiotCop', 'Roadworker', 'Sheriff', 'Streetman'];
			model = people[Math.floor(Math.random()*people.length)];
		}else if (typeof options =='object'){
			this.local = false;
			this.options = options;
			this.id = options.id;
			model = options.model;
			colour = options.colour;
		}else{
			model = options;
		}
		this.model = model;
		this.colour = colour;
		this.game = game;
		this.animations = this.game.animations;
		
		const loader = new THREE.FBXLoader();
		const player = this;
		
		loader.load( `${game.assetsPath}fbx/people/${model}.fbx`, function ( object ) {

			object.mixer = new THREE.AnimationMixer( object );
			player.root = object;
			player.mixer = object.mixer;
			
			object.name = "Person";
					
			object.traverse( function ( child ) {
				if ( child.isMesh ) {
					child.castShadow = true;
					// child.receiveShadow = true;		
				}
			} );
			
			const textureLoader = new THREE.TextureLoader();
			
			textureLoader.load(`${game.assetsPath}images/SimplePeople_${model}_${colour}.png`, function(texture){
				object.traverse( function ( child ) {
					if ( child.isMesh ){
						child.material.map = texture;
					}
				} );
			});
			
			player.object = new THREE.Object3D();
			player.object.position.set(-650, 0, -550);
			player.object.rotation.set(0, 0.45, 0);
			
			player.object.add(object);
			if (player.deleted===undefined) game.scene.add(player.object);
			
			if (player.local){
				game.createCameras();
				game.sun.target = game.player.object;
				game.animations.Idle = object.animations[0];
				if (player.initSocket!==undefined) player.initSocket();
			}else{
				const geometry = new THREE.BoxGeometry(200,500,200);
				const material = new THREE.MeshBasicMaterial({visible:false});
				const box = new THREE.Mesh(geometry, material);
				box.name = "Collider";
				box.position.set(0, 150, 0);
				player.object.add(box);
				player.collider = box;
				player.object.userData.id = player.id;
				player.object.userData.remotePlayer = true;
				const players = game.initialisingPlayers.splice(game.initialisingPlayers.indexOf(this), 1);
				game.remotePlayers.push(players[0]);
			}
			
			if (game.animations.Idle!==undefined) player.action = "Idle";
		} );
	}
	
	set action(name){
		// a copy of the clip if this is a remote player
		if (this.actionName == name) return;
		const clip = (this.local) ? this.animations[name] : THREE.AnimationClip.parse(THREE.AnimationClip.toJSON(this.animations[name])); 
		const action = this.mixer.clipAction( clip );
        action.time = 0;
		this.mixer.stopAllAction();
		this.actionName = name;
		this.actionTime = Date.now();
		
		action.fadeIn(0.5);
		action.play();
	}
	
	get action(){
		return this.actionName;
	}
	
	update(dt){
		this.mixer.update(dt);
		
		if (this.game.remoteData.length>0){
			let found = false;
			for(let data of this.game.remoteData){
				if (data.id != this.id) continue;
				//Found the player
				this.object.position.set( data.x, data.y, data.z );
				// this.game.nameBubble.mesh.position.copy(this.object.position);
				// console.log(this.game.nameBubble.mesh.position);
				const euler = new THREE.Euler(data.pb, data.heading, data.pb);
				this.object.quaternion.setFromEuler( euler );
				this.action = data.action;
				found = true;
			}
			if (!found) this.game.removePlayer(this);
		}
	}
}

class PlayerLocal extends Player{
	constructor(game, model){
		super(game, model);
		
		const player = this;
		const socket = io.connect();
		socket.on('setId', function(data){
			player.id = data.id;
		});
		socket.on('remoteData', function(data){
			game.remoteData = data;
		});
		socket.on('deletePlayer', function(data){
			const players = game.remotePlayers.filter(function(player){
				if (player.id == data.id){
					return player;
				}
			});
			if (players.length>0){
				let index = game.remotePlayers.indexOf(players[0]);
				if (index!=-1){
					game.remotePlayers.splice( index, 1 );
					game.scene.remove(players[0].object);
				}
            }else{
                let index = game.initialisingPlayers.indexOf(data.id);
                if (index!=-1){
                    const player = game.initialisingPlayers[index];
                    player.deleted = true;
                    game.initialisingPlayers.splice(index, 1);
                }
			}
		});
        
		socket.on('chat message', function(data){
			document.getElementById('chat').style.bottom = '0px';
			const player = game.getRemotePlayerById(data.id);
			game.speechBubble.player = player;
			// game.nameBubble.player = player;
			game.chatSocketId = player.id;
			game.activeCamera = game.cameras.chat;
			game.speechBubble.update(data.message);
			// game.nameBubble.updateName("KANISHK");
		});
        
		$('#msg-form').submit(function(e){
			socket.emit('chat message', { id:game.chatSocketId, message:$('#m').val() });
			$('#m').val('');
			return false;
		});
		
		this.socket = socket;
	}
	
	initSocket(){
		joinStream();
		// fetchMeeting();
		//console.log("PlayerLocal.initSocket");
		this.socket.emit('init', { 
			model:this.model, 
			colour: this.colour,
			x: this.object.position.x,
			y: this.object.position.y,
			z: this.object.position.z,
			h: this.object.rotation.y,
			pb: this.object.rotation.x,
			name: PLAYER_NAME
		});
		// game.nameBubble.update(PLAYER_NAME);

		// const joinAudio = new Audio();
		// joinAudio.src = "./assets/audio/join_audio.mp3";
		// joinAudio.play();
	}
	
	updateSocket(){
		if (this.socket !== undefined){
			//console.log(`PlayerLocal.updateSocket - rotation(${this.object.rotation.x.toFixed(1)},${this.object.rotation.y.toFixed(1)},${this.object.rotation.z.toFixed(1)})`);
			this.socket.emit('update', {
				x: this.object.position.x,
				y: this.object.position.y,
				z: this.object.position.z,
				h: this.object.rotation.y,
				pb: this.object.rotation.x,
				action: this.action
			})
		}
	}
	
	move(dt){
		const pos = this.object.position.clone();
		pos.y += 60;
		let dir = new THREE.Vector3();
		this.object.getWorldDirection(dir);
		if (this.motion.forward<0) dir.negate();
		let raycaster = new THREE.Raycaster(pos, dir);
		let blocked = false;
		const colliders = this.game.colliders;
	
		if (colliders!==undefined){ 
			const intersect = raycaster.intersectObjects(colliders);
			if (intersect.length>0){
				if (intersect[0].distance<400) blocked = true;
			}
		}
		
		if (!blocked){
			if (this.motion.forward>0){
				const speed = (this.action=='Running') ? 400 : 150;
				this.object.translateZ(dt*speed);
			}else{
				this.object.translateZ(-dt*30);
			}
		}
		
		if (colliders!==undefined){
			//cast left
			dir.set(-1,0,0);
			dir.applyMatrix4(this.object.matrix);
			dir.normalize();
			raycaster = new THREE.Raycaster(pos, dir);

			let intersect = raycaster.intersectObjects(colliders);
			if (intersect.length>0){
				if (intersect[0].distance<100) this.object.translateX(100-intersect[0].distance);
			}
			
			//cast right
			dir.set(1,0,0);
			dir.applyMatrix4(this.object.matrix);
			dir.normalize();
			raycaster = new THREE.Raycaster(pos, dir);

			intersect = raycaster.intersectObjects(colliders);
			if (intersect.length>0){
				if (intersect[0].distance<100) this.object.translateX(intersect[0].distance-100);
			}
			
			//cast down
			dir.set(0,-1,0);
			pos.y += 200;
			raycaster = new THREE.Raycaster(pos, dir);
			const gravity = 30;

			intersect = raycaster.intersectObjects(colliders);
			if (intersect.length>0){
				const targetY = pos.y - intersect[0].distance;
				if (targetY > this.object.position.y){
					//Going up
					this.object.position.y = 0.8 * this.object.position.y + 0.2 * targetY;
					this.velocityY = 0;
				}else if (targetY < this.object.position.y){
					//Falling
					if (this.velocityY==undefined) this.velocityY = 0;
					this.velocityY += dt * gravity;
					this.object.position.y -= this.velocityY;
					if (this.object.position.y < targetY){
						this.velocityY = 0;
						this.object.position.y = targetY;
					}
				}
			}
		}
		
		this.object.rotateY(this.motion.turn*dt);
		
		this.updateSocket();
	}
}

class SpeechBubble{
	constructor(game, msg, size=1){
		this.config = { font:'Calibri', size:24, padding:10, colour:'#222', width:256, height:256 };
		
		const planeGeometry = new THREE.PlaneGeometry(size, size);
		const planeMaterial = new THREE.MeshBasicMaterial()
		this.mesh = new THREE.Mesh(planeGeometry, planeMaterial);
		game.scene.add(this.mesh);

		// var geometry = new THREE.PlaneGeometry(size, size);
		
		
		const self = this;
		const loader = new THREE.TextureLoader();
		loader.load(
			// resource URL
			`${game.assetsPath}images/speech.png`,

			// onLoad callback
			function ( texture ) {
				// create the material when the texture is loaded
				self.img = texture.image;
				self.mesh.material.map = texture;
				self.mesh.material.transparent = true;
				self.mesh.material.needsUpdate = true;
				if (msg!==undefined) self.update(msg);
			},

			// onProgress callback currently not supported
			undefined,

			// onError callback
			function ( err ) {
				console.error( 'An error happened.' );
			}
		);
	}
	
	update(msg){
		if (this.mesh===undefined) return;
		
		let context = this.context;
		
		if (this.mesh.userData.context===undefined){
			const canvas = this.createOffscreenCanvas(this.config.width, this.config.height);
			this.context = canvas.getContext('2d');
			context = this.context;
			context.font = `${this.config.size}pt ${this.config.font}`;
			context.fillStyle = this.config.colour;
			context.textAlign = 'center';
			this.mesh.material.map = new THREE.CanvasTexture(canvas);
		}
		
		const bg = this.img;
		context.clearRect(0, 0, this.config.width, this.config.height);
		context.drawImage(bg, 0, 0, bg.width, bg.height, 0, 0, this.config.width, this.config.height);
		this.wrapText(msg, context);
		
		this.mesh.material.map.needsUpdate = true;
	}

	// update name on top of each avatar
	// updateName(username){
	// 	if (this.mesh===undefined) return;
		
	// 	let context = this.context;
		
	// 	if (this.mesh.userData.context===undefined){
	// 		const canvas = this.createOffscreenCanvas(this.config.width, this.config.height);
	// 		this.context = canvas.getContext('2d');
	// 		context = this.context;
	// 		context.font = `${this.config.size}pt ${this.config.font}`;
	// 		context.fillStyle = this.config.colour;
	// 		context.textAlign = 'center';
	// 		this.mesh.material.map = new THREE.CanvasTexture(canvas);
	// 	}
		
	// 	const bg = this.img;
	// 	context.clearRect(0, 0, this.config.width, this.config.height);
	// 	context.drawImage(bg, 0, 0, bg.width, bg.height, 0, 0, this.config.width, this.config.height);
	// 	this.wrapText(username, context);
		
	// 	this.mesh.material.map.needsUpdate = true;
	// }
	
	createOffscreenCanvas(w, h) {
		const canvas = document.createElement('canvas');
		canvas.width = w;
		canvas.height = h;
		return canvas;
	}
	
	wrapText(text, context){
		const words = text.split(' ');
        let line = '';
		const lines = [];
		const maxWidth = this.config.width - 2*this.config.padding;
		const lineHeight = this.config.size + 8;
		
		words.forEach( function(word){
			const testLine = `${line}${word} `;
        	const metrics = context.measureText(testLine);
        	const testWidth = metrics.width;
			if (testWidth > maxWidth) {
				lines.push(line);
				line = `${word} `;
			}else {
				line = testLine;
			}
		});
		
		if (line != '') lines.push(line);
		
		let y = (this.config.height - lines.length * lineHeight)/2;
		
		lines.forEach( function(line){
			context.fillText(line, 128, y);
			y += lineHeight;
		});
	}
	
	show(pos){
		if (this.mesh!==undefined && this.player!==undefined){
			this.mesh.position.set(this.player.object.position.x, this.player.object.position.y + 380, this.player.object.position.z);
			this.mesh.lookAt(pos);
		}
	}
}

class NameBubble{
	constructor(game, username, size=1){
		this.config = { font:'Calibri', size:24, padding:10, colour:'#222', width:256, height:256 };
		
		const planeGeometry = new THREE.PlaneGeometry(size, size);
		const planeMaterial = new THREE.MeshBasicMaterial()
		// this.mesh = new THREE.Mesh(planeGeometry, planeMaterial);
		// game.scene.add(this.mesh);

		var planeGeometry2 = planeGeometry.clone();
		planeGeometry2.applyMatrix( new THREE.Matrix4().makeRotationY( Math.PI ) );
		THREE.GeometryUtils.merge( planeGeometry, planeGeometry2, 1 );

		this.mesh = new THREE.Mesh(planeGeometry, planeMaterial);
		this.mesh2 = new THREE.Mesh(planeGeometry2, planeMaterial);
		game.scene.add(this.mesh);
		// game.scene.add(this.mesh2);
		
		const self = this;
		const loader = new THREE.TextureLoader();
		loader.load(
			// resource URL
			`${game.assetsPath}images/speech.png`,

			// onLoad callback
			function ( texture ) {
				// create the material when the texture is loaded
				self.img = texture.image;
				self.mesh.material.map = texture;
				self.mesh.material.transparent = true;
				self.mesh.material.needsUpdate = true;
				if (username!==undefined) self.updateName(username);
			},

			// onProgress callback currently not supported
			undefined,

			// onError callback
			function ( err ) {
				console.error( 'An error happened.' );
			}
		);
	}

	// update name on top of each avatar
	updateName(username){
		if (this.mesh===undefined) return;
		
		let context = this.context;
		
		if (this.mesh.userData.context===undefined){
			const canvas = this.createOffscreenCanvas(this.config.width, this.config.height);
			this.context = canvas.getContext('2d');
			context = this.context;
			context.font = `${this.config.size}pt ${this.config.font}`;
			context.fillStyle = this.config.colour;
			context.textAlign = 'center';
			this.mesh.material.map = new THREE.CanvasTexture(canvas);
		}
		
		const bg = this.img;
		context.clearRect(0, 0, this.config.width, this.config.height);
		context.drawImage(bg, 0, 0, bg.width, bg.height, 0, 0, this.config.width, this.config.height);
		this.wrapText(username, context);
		
		this.mesh.material.map.needsUpdate = true;
	}
	
	createOffscreenCanvas(w, h) {
		const canvas = document.createElement('canvas');
		canvas.width = w;
		canvas.height = h;
		return canvas;
	}
	
	wrapText(text, context){
		const words = text.split(' ');
        let line = '';
		const lines = [];
		const maxWidth = this.config.width - 2*this.config.padding;
		const lineHeight = this.config.size + 8;
		
		words.forEach( function(word){
			const testLine = `${line}${word} `;
        	const metrics = context.measureText(testLine);
        	const testWidth = metrics.width;
			if (testWidth > maxWidth) {
				lines.push(line);
				line = `${word} `;
			}else {
				line = testLine;
			}
		});
		
		if (line != '') lines.push(line);
		
		let y = (this.config.height - lines.length * lineHeight)/2;
		
		lines.forEach( function(line){
			context.fillText(line, 128, y);
			y += lineHeight;
		});
	}
	
	show(pos){
		if (this.mesh!==undefined && this.player!==undefined){
			this.mesh.position.set(this.player.object.position.x, this.player.object.position.y + 380, this.player.object.position.z);
			this.mesh.lookAt(pos);
		}
	}
}