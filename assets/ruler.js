var hRulerCanvas
var hRulerContext
var vRulerCanvas
var vRulerContext
let devicePixelRatio

function setupRulers() {
  devicePixelRatio = window.devicePixelRatio || 1;

  hRulerCanvas = document.getElementById('ruler-horizontal');
  hRulerContext = hRulerCanvas.getContext('2d', { alpha: true });
  
  hRulerCanvas.width = hRulerCanvas.offsetWidth * devicePixelRatio;
  hRulerCanvas.height = hRulerCanvas.offsetHeight * devicePixelRatio;
  
  hRulerContext.scale(devicePixelRatio, devicePixelRatio);
  
  vRulerCanvas = document.getElementById('ruler-vertical');
  vRulerContext = vRulerCanvas.getContext('2d', { alpha: true });
  
  vRulerCanvas.width = vRulerCanvas.offsetWidth * devicePixelRatio;
  vRulerCanvas.height = vRulerCanvas.offsetHeight * devicePixelRatio;
  
  vRulerContext.scale(devicePixelRatio, devicePixelRatio);

	p5rulersize = vRulerCanvas.offsetWidth
  
  drawHorizontalRuler();
  drawVerticalRuler();
	updateMousePosition(0, 0);
  
  window.addEventListener('resize', updateWindowSize);
	document.getElementById('p5canvas').addEventListener('mousemove', updateRulers);
	document.getElementById('p5canvas').addEventListener('mouseenter', showMousePosition);
	document.getElementById('p5canvas').addEventListener('mouseleave', hideMousePosition);
}

window.addEventListener('load', setupRulers)

function updateWindowSize() {
  hRulerCanvas.width = hRulerCanvas.offsetWidth
  hRulerCanvas.height = hRulerCanvas.offsetHeight

  vRulerCanvas.width = vRulerCanvas.offsetWidth
  vRulerCanvas.height = vRulerCanvas.offsetHeight

  drawHorizontalRuler()
  drawVerticalRuler()
}

function drawHorizontalRuler() {
	hRulerContext.clearRect(0, 0, hRulerCanvas.width, hRulerCanvas.height);

  const ctx = hRulerContext
	const height = p5rulersize
	
	function getCenter() {
		const offset = 1
		return height / 2 + offset
	}

  ctx.fillStyle = '#ffffff80'
  ctx.font = '0.54rem monospace'
  ctx.textBaseline = 'middle'
	ctx.textAlign = 'center'

  for (var x = 0; x < hRulerCanvas.width; x += 100) {
    if (x > 0) {
			ctx.save()
      ctx.translate(x - 1.4, getCenter())
      ctx.fillText(x.toFixed(0), 0, 0)
			ctx.restore()
    }
  }
}

function drawVerticalRuler() {
	vRulerContext.clearRect(0, 0, vRulerCanvas.width, vRulerCanvas.height);

  const ctx = vRulerContext
	const width = p5rulersize
	
	function getCenter() {
		const offset = 1
		return width / 2 + offset
	}

  ctx.fillStyle = '#ffffff80'
  ctx.font = '0.54rem monospace'
  ctx.textBaseline = 'middle'
	ctx.textAlign = 'center'

  for (var y = 0; y < vRulerCanvas.height - p5rulersize; y += 100) {
    if (y > 0) {
      ctx.save()
      ctx.translate(getCenter(), y + p5rulersize - 1.4)
      ctx.rotate(-Math.PI / 2)
      ctx.fillText((y).toFixed(0), 0, 0)
      ctx.restore()
    } else {
			ctx.save()
      ctx.translate(getCenter(), getCenter())
      ctx.fillText(0, 0, 0)
      ctx.restore()
		}
  }
}

function hideMousePosition() {
	document.getElementById('mouse-position').style.display = `none`
}

function showMousePosition() {
	document.getElementById('mouse-position').style.display = `block`
}

function updateMousePosition(x, y) {
	document.getElementById('mouse-position').style.top = `${y}px`
	document.getElementById('mouse-position').style.left = `${x}px`
	document.getElementById('mouse-position').textContent = `${(x - p5rulersize).toFixed(0)}x,${(y - p5rulersize).toFixed(0)}y`
}

function updateRulers(event) {
  drawHorizontalRuler()

  // let hRulerCanvasRect = hRulerCanvas.getBoundingClientRect()
	
  // hRulerContext.strokeStyle = '#FF0000'
  // hRulerContext.beginPath()
  // hRulerContext.moveTo(event.pageX - hRulerCanvasRect.left - 0.5, 0)
  // hRulerContext.lineTo(event.pageX - hRulerCanvasRect.left - 0.5, p5rulersize)
  // hRulerContext.stroke()

  drawVerticalRuler()

  // vRulerContext.strokeStyle = '#FF0000'
  // vRulerContext.beginPath()
  // vRulerContext.moveTo(0, event.pageY - 0.5)
  // vRulerContext.lineTo(p5rulersize, event.pageY - 0.5)
  // vRulerContext.stroke()

  updateMousePosition(event.pageX, event.pageY)
}
