let canvas=document.getElementById('canvas'),
    context=canvas.getContext('2d'),
    offscreenCanvas=document.createElement('canvas'),
    offscreenContext=offscreenCanvas.getContext('2d');


const ANIMATION_DURATION=3900,
    PUSH_ANIMATION_DURATION = 800,
    RIGHT = 1,
    LEFT = 2,
    GRAVITY_FORCE=500.81, //9.81
    TAP_FORCE=160,
    TAP_VELOCITY= (-350),
    PLATFORM_HEIGHT_IN_METERS=10,
    BALL_RADIUS  = 25;
   

export {
    canvas,context,
    offscreenCanvas,
    offscreenContext,
    ANIMATION_DURATION,
    PUSH_ANIMATION_DURATION,
    RIGHT,
    LEFT,
    BALL_RADIUS,
    GRAVITY_FORCE,
    TAP_FORCE,
    TAP_VELOCITY,
    PLATFORM_HEIGHT_IN_METERS,

};