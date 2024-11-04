<script lang="ts">
	import * as THREE from 'three';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
	import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
	import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
	import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
	import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
	import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
	import type { GLTF } from 'three/examples/jsm/Addons.js';
	import { onMount } from 'svelte';


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
		sceneElement.appendChild(renderer.domElement);
		
		// const planeGeometry = new THREE.PlaneGeometry(200, 200, 32, 32);
		// const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xf2f2f2 })
		// const plane = new THREE.Mesh(planeGeometry, planeMaterial);
		// plane.receiveShadow = true;
		// scene.add(plane);
	
		
		camera.position.y = -19;
		camera.position.z = 60;
		
		const composer = new EffectComposer(renderer);
		
		const renderPass = new RenderPass(scene, camera);
		composer.addPass(renderPass);
		
		const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
		outlinePass.overlayMaterial.blending = THREE.CustomBlending;
		outlinePass.selectedObjects = [gltf.scene];
		outlinePass.edgeThickness = 2;
		outlinePass.edgeStrength = 2;
		outlinePass.edgeGlow = 2;
		outlinePass.visibleEdgeColor = new THREE.Color().setHex(0x333333);
		composer.addPass(outlinePass);

		const effectFXAA = new ShaderPass(FXAAShader);
		effectFXAA.uniforms["resolution"].value.set(
			1 / sceneElement.clientWidth,
			1 / sceneElement.clientHeight,
		);
		effectFXAA.renderToScreen = true;
		composer.addPass(effectFXAA);
		
		const outputPass = new OutputPass();
		composer.addPass(outputPass);
		
		composer.render();

		window.addEventListener('resize', onWindowResize, false);
	
		function onWindowResize() {
			camera.aspect = sceneElement!.clientWidth / sceneElement!.clientHeight;
			camera.updateProjectionMatrix();
	
			renderer.setSize(sceneElement!.clientWidth, sceneElement!.clientHeight);
	
			composer.render();
		}
	}

	onMount(async () => {
		if (!sceneElement) {
			return;
		}

		const scene = new THREE.Scene();
		scene.background = new THREE.Color().setHex(0xf2f2f2);

		const directionalLight1 = new THREE.DirectionalLight(0xffffff, 4);
		directionalLight1.position.set(-12, -29, 100);
		scene.add(directionalLight1);

		const ambientLight1 = new THREE.AmbientLight(0xffffff, 2);
		scene.add(ambientLight1);

		const ambientLight2 = new THREE.AmbientLight(0xff0000, 8);
		scene.add(ambientLight2);
		
		const loader = new GLTFLoader();
		
		const gltf = await loader.loadAsync("models/vending_machine/scene.gltf");

		gltf.scene.scale.set(0.04, 0.04, 0.04);
		// gltf.scene.rotation.x = 0.75;
		gltf.scene.rotation.y = Math.PI * -0.5;
		
		gltf.scene.position.x = -12;
		gltf.scene.position.y = -29;
		gltf.scene.castShadow = true;
		gltf.scene.visible = true;
		
		scene.add(gltf.scene);

		initWithModel(gltf, scene);
		
	})
		
	</script>

<main>
	<section class="hero">
		<div class="model" bind:this={sceneElement}>

		</div>
		<div class="text">
			<h1 class="title"><span class="red-highlight">SIP</span>.<span class="red-highlight">WISE</span></h1>
			<p class="subtitle">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error est facilis officia pariatur dolorum magnam aliquam deserunt!</p>
			<a href="/sign-up" class="get-started">Get Started</a>
		</div>
	</section>
</main>

<style lang="scss">
	@use "../sass/exports.scss" as exports;

	.hero {
		--title-font-size: 8rem;
		--subtitle-font-size: 1.25rem;
		--button-font-size: 1.5rem;

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
		font-size: var(--title-font-size);
	}

	p.subtitle {
		font-size: var(--subtitle-font-size);
		color: var(--color-dark-400);
		line-height: 1.5;
	}

	.get-started {
		all: unset;
		
		@include exports.button();

		width: fit-content;
		font-size: var(--button-font-size);
	}

	.red-highlight {
		color: var(--color-primary);
	}

	@include exports.media-max(1464px) {
		.hero {
			--title-font-size: 7rem;
			--subtitle-font-size: 1.125rem;
			--button-font-size: 1.25rem;
		}

		.model {
			margin-left: 1rem;
			grid-column: 6 / -1;
			grid-row: 1 / -1;
		}

		.text {
			gap: 1rem;

			grid-column: 2 / 8;
			grid-row: 3 / 5;
		}
	}

	@include exports.media-max(1364px) {
		.hero {
			--title-font-size: 6.5rem;
		}

		.text {
			grid-column: 2 / 7;
			grid-row: 3 / 5;
		}
	}

	@include exports.media-largest() {
		.hero {
			--title-font-size: 6rem;
			--subtitle-font-size: 1rem;
			--button-font-size: 1.125rem;
		}

		.text {
			grid-column: 2 / 8;
			grid-row: 3 / 5;
		}
	}

	@include exports.media-max(864px) {
		.hero {
			--title-font-size: 5.5rem;
		}

		.text {
			grid-column: 2 / 8;
			grid-row: 3 / 5;
		}
		
		.model {
			margin-left: 3rem;
			grid-column: 5 / -1;
		}
	}

	@include exports.media-max(832px) {
		.hero {
			display: flex;
			flex-direction: column;
		}
		.model {
			margin-left: -6rem;
			grid-column: 1 / -1;
			grid-row: 1 / -1;
		}
	}
</style>