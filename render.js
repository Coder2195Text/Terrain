import SimplexNoise from "./node_modules/simplex-noise/dist/esm/simplex-noise.js"
const data = []
const blocks = {
	bedrock: "b",
	stone: "s",
	dirt: "d",
	coal: "O",
	iron: "E",
	diamond: "8",
	air: " ",
	grass: "G",
	gold: "g",
	redstone: "r",
	lapis: "L",
	emerald: "e"
}
console.error = alert
windown.onerror = alert
const XSIZE = 1028
const YSIZE = 256
String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}
Number.prototype.between = function(a, b) {
  var min = Math.min.apply(Math, [a, b]),
    max = Math.max.apply(Math, [a, b]);
  return this > min && this < max;
};

function generate(seed){
	const noise = new SimplexNoise(seed)
	const maxPeak = 100, minDrop = 80
	for (let x = 0; x < XSIZE; x++){
		data[x] = (" ").repeat(YSIZE)
		data[x] = data[x].replaceAt(0, blocks.bedrock)
		let height = Math.round( maxPeak - (noise.noise2D(x/60, 0) * (maxPeak - minDrop)))
		for (let y = 1; y < YSIZE; y++){
			if (y <= height){
				data[x] = data[x].replaceAt(y, blocks.stone)
				if (y >= height - 4){
					data[x] = data[x].replaceAt(y, blocks.dirt)
					if (y >= height ){
					data[x] = data[x].replaceAt(y, blocks.grass)
				}
				}
			}
			if (Math.abs(noise.noise2D(x/60, y/60)).between(0, 0.1)){
				
				data[x] = data[x].replaceAt(y, blocks.air)
				
			}
			if (data[x][y] == blocks.stone){
				if (noise.noise3D(x/10, y/10, 10) > 0.70){
					data[x] = data[x].replaceAt(y, blocks.coal)
				}
				else if (noise.noise3D(x/10, y/10, 20) > 0.6 + y/300){
					data[x] = data[x].replaceAt(y, blocks.iron)
				}
				else if (noise.noise3D(x/5, y/5, 20) > 0.83 && y < 20){
					data[x] = data[x].replaceAt(y, blocks.diamond)
				}
				else if (noise.noise3D(x/10, y/10, 30) > 0.8 + y/300){
					data[x] = data[x].replaceAt(y, blocks.gold)
				}
				else if (noise.noise3D(x/10, y/10, 40) > 0.8 && y < 20){
					data[x] = data[x].replaceAt(y, blocks.redstone)
				}
				else if (noise.noise3D(x/10, y/10, 50) > 0.8 + y/300){
					data[x] = data[x].replaceAt(y, blocks.lapis)
				}
				else if (noise.noise3D(x/10, y/10, 60) > 0.92 && y < 20){
					data[x] = data[x].replaceAt(y, blocks.emerald)
				}
			}
		}
	}
}
function render(){
	generate(prompt("enter a seed"))
	//console.log(data)
	data.reverse()

	const c = document.createElement("canvas")
	c.width = XSIZE*16
	c.height = YSIZE*16
	c.style.maxHeight = "80vh"
	document.body.appendChild(c)
	const ctx = c.getContext("2d")
	for (let x = 0; x < XSIZE; x++){
		for (let y = 0; y < YSIZE; y++){
			switch (data[x].split("")[y]){
				case blocks.bedrock: ctx.fillStyle = "black";
				break;
				case blocks.stone: ctx.fillStyle = "gray";
				break;
				case blocks.air: ctx.fillStyle = "white";
				break;
				case blocks.grass: ctx.fillStyle = "green";
				break;
				case blocks.dirt: ctx.fillStyle = "brown";
				break;
				case blocks.coal: ctx.fillStyle = "#555555";
				break;
				case blocks.iron: ctx.fillStyle = "silver";
				break;
				case blocks.diamond: ctx.fillStyle = "#0088ff";
				break;
				case blocks.gold: ctx.fillStyle = "gold";
				break;
				case blocks.redstone: ctx.fillStyle = "red";
				break;
				case blocks.lapis: ctx.fillStyle = "blue";
				break;
				case blocks.emerald: ctx.fillStyle = "#88ff88";
				break;
			}
			ctx.fillRect(x*16, (YSIZE-1)*16 - y*16, 16, 16)
			// console.log(data[x][y])
		}
	}
}

render()