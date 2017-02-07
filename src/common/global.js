var canvas=document.getElementById('canvas'),
    context=canvas.getContext('2d'),
    offscreenCanvas=document.createElement('canvas'),
    offscreenContext=offscreenCanvas.getContext('2d');

export {
	canvas,context,
	offscreenCanvas,
	offscreenContext
};