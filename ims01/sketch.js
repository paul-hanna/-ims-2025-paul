// BLACK OUT © 2024-01-04 by Zaron Chen is licensed under CC BY-NC-SA 3.0. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/3.0/

import { mountFlex } from "https://cdn.jsdelivr.net/npm/p5.flex@0.1.1/src/p5.flex.min.mjs"
import { vert, frag } from "./shader.js"
//shader for live pixel manipulation
mountFlex(p5)

new p5((p) => {
	const [WIDTH, HEIGHT] = [p.windowWidth, p.windowHeight]
	const PIXEL_DENSITY = 1
	const CANVAS_SIZE = [WIDTH, HEIGHT]
	const TEXEL_SIZE = [1 / (WIDTH * PIXEL_DENSITY), 1 / (HEIGHT * PIXEL_DENSITY)]
	let gfx, theShader
	let capture

	p.setup = () => {
		p.createCanvas(WIDTH, HEIGHT)
		// make p5 canvas responsive
		p.flex({ container: { padding: "20px" } })

		capture = p.createCapture({
			video: {
				optional: [{ maxFrameRate: 30 }],
			},
			audio: false,
		})
		capture.hide()

		p.pixelDensity(PIXEL_DENSITY)

		gfx = p.createGraphics(WIDTH, HEIGHT, p.WEBGL)
		theShader = p.createShader(vert, frag)

		p.noStroke()
		gfx.noStroke()
		
		p.describe(`"BLACK OUT" by Zaron Chen`)
	}

	p.draw = () => {
		p.background(255)
		gfx.background(0)

		// use shader on gfx
		gfx.shader(theShader)
		theShader.setUniform("tex0", p._renderer)
		theShader.setUniform("tex1", capture)
		theShader.setUniform("canvasSize", CANVAS_SIZE)
		theShader.setUniform("texelSize", TEXEL_SIZE)
		theShader.setUniform("mouse", [p.mouseX / WIDTH, p.mouseY / HEIGHT]) //adjust based on mouse position
		theShader.setUniform("time", p.frameCount / 60)
		gfx.quad(-1, 1, 1, 1, 1, -1, -1, -1)

		// paste gfx to canvas
		p.image(gfx, 0, 0)
		
		p.push()
	}
})
