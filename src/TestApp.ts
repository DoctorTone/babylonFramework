import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { MeshBuilder } from "@babylonjs/core";
import { StandardMaterial } from "@babylonjs/core/Materials";
import { Color3 } from "@babylonjs/core/Maths";
import { Mesh } from "@babylonjs/core/Meshes";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { Texture } from "@babylonjs/core/Materials";

import "@babylonjs/loaders/glTF";

const rotateAxis = new Vector3(0, 1, 0);
const ROTATION_RATE = 0.0025;

export class TestApp {
	engine: Engine;
	scene: Scene;
	currentModel: TransformNode | undefined;

	constructor(readonly canvas: HTMLCanvasElement) {
		this.engine = new Engine(canvas);
		this.canvas = canvas;
		window.addEventListener("resize", () => {
			this.engine.resize();
		});
		this.scene = this.createScene();
		this.loadModels();
	}

	createScene = () => {
		// This creates a basic Babylon Scene object (non-mesh)
		var scene = new Scene(this.engine);

		// This creates and positions a free camera (non-mesh)
		var camera = new ArcRotateCamera(
			"camera",
			Math.PI / 2,
			Math.PI / 3,
			10,
			Vector3.Zero(),
			scene
		);

		// This targets the camera to scene origin
		camera.setTarget(Vector3.Zero());

		// This attaches the camera to the canvas
		camera.attachControl(this.canvas, true);
		camera.wheelDeltaPercentage = 0.1;
		// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
		var light = new HemisphericLight("light", new Vector3(-3, 1, 0), scene);

		// Default intensity is 1. Let's dim the light a small amount
		light.intensity = 0.7;

		// Our built-in 'ground' shape.
		var ground = MeshBuilder.CreateGround(
			"ground",
			{ width: 6, height: 6 },
			scene
		);

		const groundMat = new StandardMaterial("ground");
		groundMat.diffuseTexture = new Texture("./textures/lightning.jpg");
		ground.material = groundMat;

		return scene;
	};

	loadModels = async () => {
		const model = await SceneLoader.ImportMeshAsync(
			"",
			"./models/",
			"pumpkin.glb",
			this.scene,
			undefined,
			".glb"
		);

		this.currentModel = model.transformNodes[0];
		console.log("Twin = ", model);
	};

	run() {
		this.engine.runRenderLoop(() => {
			const delta = this.engine.getDeltaTime();
			this.currentModel &&
				this.currentModel.rotate(rotateAxis, delta * ROTATION_RATE);
			this.scene.render();
		});
	}
}
