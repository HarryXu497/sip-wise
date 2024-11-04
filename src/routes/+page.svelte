<script lang="ts">
	import * as THREE from 'three';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
	import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
	import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
	import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
	import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
	import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
	import type { GLTF } from 'three/examples/jsm/Addons.js';


	let sceneElement = $state<HTMLElement>();

	function initWithModel(gltf: GLTF, scene: THREE.Scene) {
		if (!sceneElement) {
			return;
		}
		
		const camera = new THREE.PerspectiveCamera(50, sceneElement.clientWidth / sceneElement.clientHeight, 10, 1000);
		
		const renderer = new THREE.WebGLRenderer();
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
		renderer.setSize(sceneElement.clientWidth, sceneElement.clientHeight);
		sceneElement.appendChild( renderer.domElement );
		
		// const planeGeometry = new THREE.PlaneGeometry( 200, 200, 32, 32 );
		// const planeMaterial = new THREE.MeshStandardMaterial( { color: 0xf2f2f2 } )
		// const plane = new THREE.Mesh( planeGeometry, planeMaterial );
		// plane.receiveShadow = true;
		// scene.add( plane );
	
		
		camera.position.y = -19;
		camera.position.z = 60;
		
		const composer = new EffectComposer( renderer );
		
		const renderPass = new RenderPass( scene, camera );
		composer.addPass( renderPass );
		
		const outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera );
		outlinePass.overlayMaterial.blending = THREE.CustomBlending;
		outlinePass.selectedObjects = [gltf.scene];
		outlinePass.edgeThickness = 2;
		outlinePass.edgeGlow = 2;
		outlinePass.visibleEdgeColor = new THREE.Color().setHex(0x111111);
		composer.addPass( outlinePass );
		
		const outputPass = new OutputPass();
		composer.addPass( outputPass );
		
		composer.render();
	}

	$effect(() => {
		if (!sceneElement) {
			return;
		}



		const scene = new THREE.Scene();
		scene.background = new THREE.Color().setHex(0xf2f2f2);

		const directionalLight1 = new THREE.DirectionalLight(0xffffff, 2);
		directionalLight1.position.set(-12, -29, 100);
		scene.add(directionalLight1);

		const ambientLight = new THREE.AmbientLight(0xffffff, 2);
		scene.add(ambientLight);
		
		const loader = new GLTFLoader();
		
		loader.load("models/vending_machine/scene.gltf", (gltf) => {
			gltf.scene.scale.set(0.04, 0.04, 0.04);
			// gltf.scene.rotation.x = 0.75;
			gltf.scene.rotation.y = Math.PI * -0.5;
			
			gltf.scene.position.x = -12;
			gltf.scene.position.y = -29;
			gltf.scene.castShadow = true;
			gltf.scene.visible = true;
			
			scene.add(gltf.scene);

			initWithModel(gltf, scene);
		}, undefined, function ( error ) {
			
			console.error( error );
		} );
	
	})
		
	</script>

<main>
	<section class="hero">
		<div class="model" bind:this={sceneElement}>

		</div>
		<div class="text">
			<h1 class="title"><span class="red-highlight">SIP</span>.<span class="red-highlight">WISE</span></h1>
			<p class="subtitle">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error est facilis officia pariatur dolorum magnam aliquam deserunt omnis totam dicta dolor animi nesciunt ipsa ab, minus, maiores rerum voluptates iure!</p>
			<a href="/sign-in" class="get-started">Get Started</a>
		</div>
	</section>
</main>

<style lang="scss">
	@use "../sass/exports.scss" as exports;

	.hero {
		height: calc(100lvh - 2rem);
		display: grid;
		grid-template-columns: repeat(12, 1fr);
		grid-template-rows: repeat(12, 1fr);
	}

	.model {
		grid-column: 5 / -1;
		grid-row: 1 / -1;
	}

	.text {
		grid-column: 2 / 7;
		grid-row: 3 / 5;

		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	h1.title {
		font-size: 8rem;
	}

	p.subtitle {
		font-size: 1.25rem;
		color: var(--color-dark-400);
		line-height: 1.5;
	}

	.get-started {
		all: unset;
		
		@include exports.button();

		width: fit-content;
		font-size: 1.5rem;
	}

	.red-highlight {
		color: var(--color-primary);
	}
</style>