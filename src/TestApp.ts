import * as BABYLON from "babylonjs";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import "@babylonjs/loaders/glTF";

export class TestApp {
	engine: BABYLON.Engine;
	scene: BABYLON.Scene;

	constructor(readonly canvas: HTMLCanvasElement) {
		this.engine = new BABYLON.Engine(canvas);
		this.canvas = canvas;
		window.addEventListener("resize", () => {
			this.engine.resize();
		});
		this.scene = this.createScene();
		this.loadModels();
	}

	createScene = () => {
		// This creates a basic Babylon Scene object (non-mesh)
		var scene = new BABYLON.Scene(this.engine);

		// This creates and positions a free camera (non-mesh)
		var camera = new BABYLON.ArcRotateCamera(
			"camera",
			BABYLON.Tools.ToRadians(90),
			BABYLON.Tools.ToRadians(60),
			10,
			BABYLON.Vector3.Zero(),
			scene
		);

		// This targets the camera to scene origin
		camera.setTarget(BABYLON.Vector3.Zero());

		// This attaches the camera to the canvas
		camera.attachControl(this.canvas, true);

		// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
		var light = new BABYLON.HemisphericLight(
			"light",
			new BABYLON.Vector3(0, 1, 0),
			scene
		);

		// Default intensity is 1. Let's dim the light a small amount
		light.intensity = 0.7;

		// Our built-in 'ground' shape.
		var ground = BABYLON.MeshBuilder.CreateGround(
			"ground",
			{ width: 6, height: 6 },
			scene
		);

		return scene;
	};

	loadModels = async () => {
		const model = await SceneLoader.ImportMeshAsync(
			"",
			"./models/",
			"pumpkin.glb",
			this.scene
		);
	};

	run() {
		this.engine.runRenderLoop(() => {
			this.scene.render();
		});
	}
}
