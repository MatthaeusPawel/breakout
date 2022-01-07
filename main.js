export const speed = 2;
// Paddle
export const widthPaddle = 75;
export const heightPaddle = 10;

// Learning
export const gamma = 0.999;
export const movePunishment = -0.01;
export const failPunishment = -20;
export const reward = 10;
export const learningRate = 0.1;
export let prob = 1;
let hitBoundary = false;
let movingExplorationTime = 2000000;
export let stationaryExplorationTime = 20;
export let trainingphase = true;



export const actionSpace = [0, -1, +1];
 

// Quantify-Constants
export const xPaddleQuantSize = 10;
export const xBallQuantSize = xPaddleQuantSize;
export const yBallQuantSize = 3;
export const angleQuantSize = 8;
export const actionQuantSize = actionSpace.length;


export function getActionIndex(action){
  return getIndex(action, actionSpace);
}
export function getIndex(action, arr){
  return arr.reduce( (prev, _, i, arr) => arr[i] == action? i: prev, 0);
}

export let actionstate = initializeArray([xPaddleQuantSize, xBallQuantSize, yBallQuantSize, angleQuantSize, actionQuantSize]);

export function initializeArray(dimensions) {
  let prevArray = [];

  if (dimensions.length===1)
    for(let i=0; i<dimensions[0]; ++i)
      prevArray[i] = 0;
  else
    for(let i=0; i<dimensions[0]; ++i)
      prevArray[i] = initializeArray(dimensions.slice(1));

  return prevArray;
}

function computeNewDirection(_dy){
  const scaling = Math.sqrt(6.0/16);
  let dx = Math.random()-.5;
  let dy = -Math.sign(_dy)*Math.sqrt(scaling*scaling - dx*dx)
  
  return {dx: speed*dx, dy: speed*dy};
}
export function argmax(arr){
  if (arr.length === 0) 
    return undefined;
  let index = arr.reduce( (pre, _,  i, arr) => arr[i] > arr[pre]? i : pre, 0)
  return index;
}

export function getBestAction(arr){
  return actionSpace[argmax(arr)];
}

export function isUndefined(x){
  return typeof x == "undefined"? true: false;
}

function updateProb(prob){
  return 0;
  return Math.max(0.01, prob *0.9 )
}


export function boundedRange(x, xmin, xmax){
  if (x < xmin)
    return xmin;
  if (x > xmax)
    return xmax;
  return x;
}


export function getAction(actionScores, prevAction, currentStationaryExplorationTime){
  if (movingExplorationTime-- > 0){
      if (currentStationaryExplorationTime-- > 0)
        return 0;
    return getExplorationAction(prevAction);
  }
  
  trainingphase = false;

  if (Math.random() < prob)
    return getRandomAction();
  return getBestAction(actionScores);
}

function getRandomAction(){
  return actionSpace[quantize(Math.random(), 0, 1, 3)];
}
function getExplorationAction(prevAction){
  return hitBoundary? (-1)*prevAction: prevAction;
}
//export function getRandomActionUnitTest(x){
  //return actionSpace[quantize(x, 0, 1, 3)];
//}
// Check 
export function computeAngle(dx,dy){
    if (dx>0){
      if (dy>=0)
        return Math.atan(dy/dx);
      else
        return 2*Math.PI + Math.atan(dy/dx);
    }
    if (dx < 0){
      if (dy>=0)
        return Math.PI + Math.atan(dy/dx);
      else
        return Math.PI + Math.atan(dy/dx);
    }
    if (dx === 0.0){
      if (dy >= 0)
        return 3*Math.PI/2;
      else
        return Math.PI/2;
    }
}
export function quantize(x, xmin, xmax, count){
  if (x == xmax)
    return count-1;
  return Math.floor(count*(x - xmin)/(xmax - xmin));
}

export function recoverRange(quant, xmin, xmax, count){
  let width = (xmax - xmin)/count;
  let ymin = quant*width + xmin;
  let ymax = ymin + width; 
  
  return [ymin, ymax];
}
  
export function recoverRangeAngle(quant, xmin, xmax, count){
  
}
  
export function updatePaddle(xPaddle, dx, score){
  if ( (xPaddle + dx < 0 ) || (xPaddle + dx + widthPaddle > 480))
    hitBoundary = true;
  else 
    hitBoundary = false;
  xPaddle = boundedRange(xPaddle+dx, 0, 480-widthPaddle);
 
  score += score > 100? (Math.abs(dx) * movePunishment): 0;
  score = 100*Math.round(score)/100;

  return {xPaddle: xPaddle, newScore: score}
}

export function updateDirections(x, y, width, height, dx, dy, r, score, xPaddle, yPaddle){
  if (( x - r <= 0 && dx < 0) || ( x + r >= width && dx > 0))
    dx *= -1;
  if (( y- r <= 0 && dy < 0) || ( y + r >= height && dy > 0)){
    if (dy > 0) {
      score += failPunishment;
    }
    if (trainingphase)
      ({dx, dy} = computeNewDirection(dy));
    else dy *= -1;
  }
 
  if ( y + r < height && y + r > yPaddle && x >= xPaddle && x <= xPaddle + widthPaddle && dy > 0){
    ({dx, dy} = computeNewDirection(dy));
    score += reward;
    prob = updateProb(prob);
  }
    
  return { dxBall: dx, dyBall: dy, newScore: score};
}
