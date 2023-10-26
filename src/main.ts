import "./css/testStyles.css";
import { TestApp } from "./TestApp";

window.addEventListener("DOMContentLoaded", () => {
	let canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
	let app = new TestApp(canvas);
	app.run();
});
