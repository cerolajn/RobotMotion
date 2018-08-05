/*---------------------EVENTS HANDLING----------------------*/

(function(){

/*--------------------INITIAL POINT----------------------*/

  let initialpoint = document.getElementById('initialPoint'),
  initPoint = null,
  initText = null,
  xIntValue = null,
  yIntValue= null;


  initialpoint.addEventListener('click',(e) => {

    buttonDisabled(initialpoint);

    creatingCoordinatesNode();

    let clickedCount = 0;
    let clickedCountMax = 1;

    canvas.addEventListener('click', (e) => {
      clickedCount++;
      if (clickedCount <= clickedCountMax) {
        let {initialPoint, initialText, xInitial, yInitial} = drawInitialPoint(e, initPoint, initText, xIntValue, yIntValue);
        initPoint = initialPoint;
        initText = initialText;
        xIntValue = xInitial;
        yIntValue = yInitial;

        global_xStart = xIntValue;
        global_yStart = yIntValue;

        let elementType = 'Initial Point';
        setElementCoordinates(elementType, xInitial, yInitial);
      }
    }, false);
  },false);
  /*---------------------TARGET POINT-----------------------*/

  let targetpoint = document.getElementById('targetPoint'),
  targPoint = null,
  targText = null,
  xTargValue= null,
  yTargValue= null;


  targetpoint.addEventListener('click', (e) => {
    mode = 'target-point';

    buttonDisabled(targetpoint);

    creatingCoordinatesNode();
    let clickedCount = 0;
    let clickedCountMax = 1;
    canvas.addEventListener('click', (e) => {
      clickedCount++;
      if (clickedCount <= clickedCountMax) {
        let {targetPoint, targetText, xTarget, yTarget} = drawTargetPoint(e, targPoint, targText, xTargValue, yTargValue);
        targPoint = targetPoint;
        targText = targetText;
        xTargValue = xTarget;
        yTargValue = yTarget;

        global_xEnd = xTargValue;
        global_yEnd = yTargValue;

        let elementType = 'Target Point';
        setElementCoordinates(elementType, xTarget, yTarget);
      }
    },false);

  },false);

  /*------------------------OBSTACLES------------------------*/

  let obstacles = document.getElementById('obstacles'),
  obstaclePoints = null,
  xObsValue= null,
  yObsValue= null,
  rad = null,
  inputColor = null;

  obstacles.addEventListener('click', (e) => {
    buttonDisabled(obstacles);

    let clickedCount = 0;
    let clickedCountMax = 8;

    canvas.addEventListener('click',(e) => {
      clickedCount ++;
      if (clickedCount <= clickedCountMax) {

        let {obstacleP, xObstacle, yObstacle, setRadian,setColor} = drawObstacles(e, obstaclePoints, xObsValue, yObsValue, rad,inputColor);
        obstaclePoints = obstacleP;
        xObsValue = xObstacle;
        yObsValue = yObstacle;
        rad = setRadian;
        inputColor = setColor;

        creatingCoordinatesNode();
        let elementType = 'Obstacles';
        setElementCoordinates(elementType, xObstacle, yObstacle,setRadian,setColor);
      } else {
        showAlertInformation();
      }
    },false);
  },false);

  /*------------------------CLEAR BOARD---------------------------*/
  let clear = document.getElementById('clearBoard');
  clear.onclick = clearBoard;

  /*------------------------SHOW ROUTE------------------------*/
  let routeDrawing = document.getElementById('resultClick');
  routeDrawing.onclick = performAlgorithm;


})();


/*----------FUNCTIONS DECLARATION------*/

//MAIN BOARD FUNCTION

//basic content declaration
  let canvas = document.getElementById('canvas');
  canvas.width = 800;
  canvas.height = 600;
  let ctx = canvas.getContext('2d');


// global variable   handling
  let global_xStart;
  let global_yStart;
  let global_xEnd;
  let global_yEnd;

/*------------------------------------------*/

//BASIC FUNCTIONS

//CREATING ADDITIONAL LIST NODES IN ORDER TO PRINT ELEMENT'S COORDINATES

function creatingCoordinatesNode(){
  let positionList = document.querySelector('.positionList');
  let positionListItem = document.createElement("li");
  positionListItem.setAttribute("class","positionItem");
  positionListItem.style.color = "#19455E";
  positionListItem.style.width = '800px';
  positionListItem.style.height = '35px';
  positionListItem.style.fontWeight = 'bold';
  positionListItem.style.fontSize = '19px';
  positionListItem.style.paddingTop = '10px';
  positionListItem.style.listStyleType = 'none';
  insertingAfter(positionListItem,positionList);
}

// ADDITIONAL FUNCTION FOR INSERTING EACH CREATED LIST ITEMS AFTER LAST ONE

function insertingAfter(newNode,parentingNode) {
  parentingNode.parentNode.insertBefore(newNode, parentingNode.nextSibling);
}

// SETTING VALUES OF COORDINATES
  let deleteButton;

function setElementCoordinates(setPointType,xValue,yValue,setRadius,givenColor){
  let selectedItem = document.querySelector('.positionItem');
  if((setRadius === undefined) &&(givenColor === undefined)) {
    selectedItem.innerHTML = `Coordinates of ${setPointType} X: ${xValue} Y: ${yValue}`;
  } else {
    selectedItem.innerHTML = `Coordinates of ${setPointType} X: ${xValue} Y: ${yValue} Radius :${setRadius}`;
    deleteButton = document.createElement("input");
    deleteButton.type = "button";
    deleteButton.value = "Delete";
    deleteButton.setAttribute("class", "deleteButton");
    selectedItem.appendChild(deleteButton);
    selectedItem.style.color = givenColor;
    let removeButton = document.querySelector('.deleteButton');
    removeButton.onclick = function(xValue,yValue,setRadius) {
      removeObstacle(this, xValue, yValue, setRadius);
    };
  }

}


// REMOVING OBSTACLES DYNAMICALlY
function removeObstacle(deletingButton,x,y,setR){

  let item = deletingButton.parentNode;
  let parentList = item.parentNode;

  item.removeChild(deletingButton);
  parentList.removeChild(item);
  ctx.clearRect(setR,setR,x,y);
}

// DISABLE BUTTON AFTER ONE CLICK
function buttonDisabled(setButton){
  setButton.disabled = true;
  setButton.style.background = "#909090";
  setButton.style.borderColor = "#909090";
}



//ALERT ABOUT UNLIMITED INITIAL, GOAL POINTS
function showAlertInformation(e){

  let infoList = document.querySelector('.alertInfoList');
  let infoListItem = document.createElement("li");

  infoListItem.innerHTML = 'Maximum quantity of obstacles were added on board!';
  infoListItem.style.color = '#C35244';
  infoListItem.style.width = '200px';
  infoListItem.style.height = '100px';
  infoListItem.style.marginLeft = '30px';
  infoListItem.style.fontWeight = 'bold';

  infoList.appendChild(infoListItem);
}


//INITIAL POINT DECLARATION
function drawInitialPoint(event,initialPoint,initialText,xInitial,yInitial) {

  let canvas = document.getElementById('canvas');
  let ctx = canvas.getContext('2d');

  let drawingBoard = canvas.getBoundingClientRect();

  let xInitialCoordinates;
  let yInitialCoordinates;
  xInitialCoordinates = event.clientX - drawingBoard.left;
  yInitialCoordinates = event.clientY - drawingBoard.top;

  xInitial = xInitialCoordinates.toFixed(2);
  yInitial = yInitialCoordinates.toFixed(2);


  if (initialPoint === null ) {
    //ctx.clearRect(10,10,xInitial,yInitial);
    ctx.fillStyle = "#66AF7F";
    ctx.beginPath();
    ctx.arc(xInitial, yInitial, 10, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
  }
  if (initialText === null ) {
    ctx.font = "15px Arial";
    ctx.fillStyle = "#66AF7F";
    ctx.fillText("Initial Point", xInitialCoordinates + 10, yInitialCoordinates + 10);

    return {initialPoint, initialText, xInitial, yInitial};
  }
}


//TARGET POINT DECLARATION
function drawTargetPoint(event,targetPoint,targetText,xTarget,yTarget) {

  let canvas = document.getElementById('canvas');
  let ctx = canvas.getContext('2d');

  let drawingBoard = canvas.getBoundingClientRect();

  let xTargetCoordinates;
  let yTargetCoordinates;
  xTargetCoordinates = event.clientX - drawingBoard.left;
  yTargetCoordinates = event.clientY - drawingBoard.top;


  xTarget = xTargetCoordinates.toFixed(2);
  yTarget = yTargetCoordinates.toFixed(2);


  if (targetPoint === null ) {
    //ctx.clearRect(10,10,xTarget,yTarget);
    ctx.fillStyle = "#C35244";
    ctx.beginPath();
    ctx.arc(xTarget, yTarget, 10, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
  }
  if (targetText === null ) {
    ctx.font = "15px Arial";
    ctx.fillStyle = "#C35244";
    ctx.fillText("Target Point", xTargetCoordinates + 10, yTargetCoordinates + 10);
  }
  return {targetPoint, targetText, xTarget, yTarget};
}

//OBSTACLES DECLARATION

  let setValue = document.getElementById('obstacleScaling');
  let setTypeColor= document.getElementById('selectingColor');

function drawObstacles(event,obstacleP,xObstacle,yObstacle,setRadian,setColor) {
  let canvas = document.getElementById('canvas');
  let ctx = canvas.getContext('2d');

  let drawingBoard = canvas.getBoundingClientRect();

  let xObsCoordinates;
  let yObsCoordinates;
  xObsCoordinates = event.clientX - drawingBoard.left;
  yObsCoordinates = event.clientY - drawingBoard.top;


  xObstacle= xObsCoordinates.toFixed(2);
  yObstacle= yObsCoordinates.toFixed(2);

  setColor = setTypeColor.value;
  setRadian = setValue.value;
  ctx.fillStyle = setColor;
  ctx.beginPath();
  ctx.arc(xObsCoordinates,yObsCoordinates,setRadian, 0, Math.PI * 2, true);
  ctx.fill();

  return {obstacleP, xObstacle, yObstacle,setRadian,setColor};
}

// CHECKS IF ALGORITHM HAS GOT ALL NECESSARY VARIABLES

function performAlgorithm(){
  if((global_xStart !== undefined) && (global_yStart !== undefined) &&
    (global_xEnd !== undefined) && (global_yEnd !== undefined)){
    let finalResult;
    finalResult = Algorithm(global_xStart,global_yStart,global_xEnd,global_yEnd);
    pathDrawing(finalResult);
  }
}
// CLEAR BOARD
function clearBoard(){
  window.location.reload();
}

/*-------------PATH DRAWING--------------------*/

function pathDrawing(resultConverted){

  ctx.beginPath();
  ctx.lineWidth="1";
  ctx.strokeStyle="#011A33";
  ctx.moveTo(resultConverted[0][0],resultConverted[0][1]);

  for (let i=0 ; i<resultConverted.length; ++i){
    ctx.fillRect(resultConverted[i][0],resultConverted[i][1],2,2);
    ctx.lineTo(resultConverted[i][0],resultConverted[i][1]);
  }
  ctx.stroke();
}
