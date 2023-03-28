import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import{ RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { ARButton } from 'three/addons/webxr/ARButton.js';




const camera = new THREE.PerspectiveCamera(45, window.innerWidth /window.innerHeight, 0.1, 100)
camera.position.set(5,2,8);
const container = document.getElementById('container');
   
let mixer;



const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
//web xr
renderer.xr.enabled = true;
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
//Room ENvironment
const pmremGenerator = new THREE.PMREMGenerator(renderer);
scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

document.body.appendChild( ARButton.createButton( renderer ) );

//Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0,1,0);
controls.update();
controls.enablePan = false;
controls.enableDamPing = true;
controls.enableZoom = false

//Add 3d Model
const loader = new GLTFLoader();
loader.load('/dist/assets/hand.glb',function(glb){

    const model = glb.scene;
    scene.add(model);
    model.position.set(0,0.5,-5);
    


    const clips = glb.animations;
    mixer = new THREE.AnimationMixer(model);
    


    const rotateAction= THREE.AnimationClip.findByName(clips, 'handmove');
    const rotateMove = mixer.clipAction(rotateAction);
    rotateMove.play();
    rotateMove.loop = THREE.LoopOnce;

    const armatureAction= THREE.AnimationClip.findByName(clips, 'Armaturemove');
    const armatureMove = mixer.clipAction(armatureAction);
    armatureMove.play();
    armatureMove.loop = THREE.LoopOnce;

    
    animate();
}, undefined, function(e){
    console.error(e);

});

const clock = new THREE.Clock();
window.onresize = function(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate(){
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    mixer.update(delta);
    controls.update();
    renderer.render(scene, camera);
}




