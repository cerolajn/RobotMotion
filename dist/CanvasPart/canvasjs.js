'use strict';

/*---------------------EVENTS HANDLING----------------------*/

(function () {

  /*--------------------INITIAL POINT----------------------*/

  var initialpoint = document.getElementById('initialPoint'),
      initPoint = null,
      initText = null,
      xIntValue = null,
      yIntValue = null;

  initialpoint.addEventListener('click', function (e) {

    buttonDisabled(initialpoint);

    creatingCoordinatesNode();

    var clickedCount = 0;
    var clickedCountMax = 1;

    canvas.addEventListener('click', function (e) {
      clickedCount++;
      if (clickedCount <= clickedCountMax) {
        var _drawInitialPoint = drawInitialPoint(e, initPoint, initText, xIntValue, yIntValue),
            initialPoint = _drawInitialPoint.initialPoint,
            initialText = _drawInitialPoint.initialText,
            xInitial = _drawInitialPoint.xInitial,
            yInitial = _drawInitialPoint.yInitial;

        initPoint = initialPoint;
        initText = initialText;
        xIntValue = xInitial;
        yIntValue = yInitial;

        global_xStart = xIntValue;
        global_yStart = yIntValue;

        var elementType = 'Initial Point';
        setElementCoordinates(elementType, xInitial, yInitial);
      }
    }, false);
  }, false);
  /*---------------------TARGET POINT-----------------------*/

  var targetpoint = document.getElementById('targetPoint'),
      targPoint = null,
      targText = null,
      xTargValue = null,
      yTargValue = null;

  targetpoint.addEventListener('click', function (e) {
    mode = 'target-point';

    buttonDisabled(targetpoint);

    creatingCoordinatesNode();
    var clickedCount = 0;
    var clickedCountMax = 1;
    canvas.addEventListener('click', function (e) {
      clickedCount++;
      if (clickedCount <= clickedCountMax) {
        var _drawTargetPoint = drawTargetPoint(e, targPoint, targText, xTargValue, yTargValue),
            targetPoint = _drawTargetPoint.targetPoint,
            targetText = _drawTargetPoint.targetText,
            xTarget = _drawTargetPoint.xTarget,
            yTarget = _drawTargetPoint.yTarget;

        targPoint = targetPoint;
        targText = targetText;
        xTargValue = xTarget;
        yTargValue = yTarget;

        global_xEnd = xTargValue;
        global_yEnd = yTargValue;

        var elementType = 'Target Point';
        setElementCoordinates(elementType, xTarget, yTarget);
      }
    }, false);
  }, false);

  /*------------------------OBSTACLES------------------------*/

  var obstacles = document.getElementById('obstacles'),
      obstaclePoints = null,
      xObsValue = null,
      yObsValue = null,
      rad = null,
      inputColor = null;

  obstacles.addEventListener('click', function (e) {
    buttonDisabled(obstacles);

    var clickedCount = 0;
    var clickedCountMax = 8;

    canvas.addEventListener('click', function (e) {
      clickedCount++;
      if (clickedCount <= clickedCountMax) {
        var _drawObstacles = drawObstacles(e, obstaclePoints, xObsValue, yObsValue, rad, inputColor),
            obstacleP = _drawObstacles.obstacleP,
            xObstacle = _drawObstacles.xObstacle,
            yObstacle = _drawObstacles.yObstacle,
            setRadian = _drawObstacles.setRadian,
            setColor = _drawObstacles.setColor;

        obstaclePoints = obstacleP;
        xObsValue = xObstacle;
        yObsValue = yObstacle;
        rad = setRadian;
        inputColor = setColor;

        creatingCoordinatesNode();
        var elementType = 'Obstacles';
        setElementCoordinates(elementType, xObstacle, yObstacle, setRadian, setColor);
      } else {
        showAlertInformation();
      }
    }, false);
  }, false);

  /*------------------------CLEAR BOARD---------------------------*/
  var clear = document.getElementById('clearBoard');
  clear.onclick = clearBoard;

  /*------------------------SHOW ROUTE------------------------*/
  var routeDrawing = document.getElementById('resultClick');
  routeDrawing.onclick = performAlgorithm;
})();

/*----------FUNCTIONS DECLARATION------*/

//MAIN BOARD FUNCTION

//basic content declaration
var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
var ctx = canvas.getContext('2d');

// global variable   handling
var global_xStart = void 0;
var global_yStart = void 0;
var global_xEnd = void 0;
var global_yEnd = void 0;

/*------------------------------------------*/

//BASIC FUNCTIONS

//CREATING ADDITIONAL LIST NODES IN ORDER TO PRINT ELEMENT'S COORDINATES

function creatingCoordinatesNode() {
  var positionList = document.querySelector('.positionList');
  var positionListItem = document.createElement("li");
  positionListItem.setAttribute("class", "positionItem");
  positionListItem.style.color = "#19455E";
  positionListItem.style.width = '800px';
  positionListItem.style.height = '35px';
  positionListItem.style.fontWeight = 'bold';
  positionListItem.style.fontSize = '19px';
  positionListItem.style.paddingTop = '10px';
  positionListItem.style.listStyleType = 'none';
  insertingAfter(positionListItem, positionList);
}

// ADDITIONAL FUNCTION FOR INSERTING EACH CREATED LIST ITEMS AFTER LAST ONE

function insertingAfter(newNode, parentingNode) {
  parentingNode.parentNode.insertBefore(newNode, parentingNode.nextSibling);
}

// SETTING VALUES OF COORDINATES
var deleteButton = void 0;

function setElementCoordinates(setPointType, xValue, yValue, setRadius, givenColor) {
  var selectedItem = document.querySelector('.positionItem');
  if (setRadius === undefined && givenColor === undefined) {
    selectedItem.innerHTML = 'Coordinates of ' + setPointType + ' X: ' + xValue + ' Y: ' + yValue;
  } else {
    selectedItem.innerHTML = 'Coordinates of ' + setPointType + ' X: ' + xValue + ' Y: ' + yValue + ' Radius :' + setRadius;
    deleteButton = document.createElement("input");
    deleteButton.type = "button";
    deleteButton.value = "Delete";
    deleteButton.setAttribute("class", "deleteButton");
    selectedItem.appendChild(deleteButton);
    selectedItem.style.color = givenColor;
    var removeButton = document.querySelector('.deleteButton');
    removeButton.onclick = function (xValue, yValue, setRadius) {
      removeObstacle(this, xValue, yValue, setRadius);
    };
  }
}

// REMOVING OBSTACLES DYNAMICALlY
function removeObstacle(deletingButton, x, y, setR) {

  var item = deletingButton.parentNode;
  var parentList = item.parentNode;

  item.removeChild(deletingButton);
  parentList.removeChild(item);
  ctx.clearRect(setR, setR, x, y);
}

// DISABLE BUTTON AFTER ONE CLICK
function buttonDisabled(setButton) {
  setButton.disabled = true;
  setButton.style.background = "#909090";
  setButton.style.borderColor = "#909090";
}

//ALERT ABOUT UNLIMITED INITIAL, GOAL POINTS
function showAlertInformation(e) {

  var infoList = document.querySelector('.alertInfoList');
  var infoListItem = document.createElement("li");

  infoListItem.innerHTML = 'Maximum quantity of obstacles were added on board!';
  infoListItem.style.color = '#C35244';
  infoListItem.style.width = '200px';
  infoListItem.style.height = '100px';
  infoListItem.style.marginLeft = '30px';
  infoListItem.style.fontWeight = 'bold';

  infoList.appendChild(infoListItem);
}

//INITIAL POINT DECLARATION
function drawInitialPoint(event, initialPoint, initialText, xInitial, yInitial) {

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  var drawingBoard = canvas.getBoundingClientRect();

  var xInitialCoordinates = void 0;
  var yInitialCoordinates = void 0;
  xInitialCoordinates = event.clientX - drawingBoard.left;
  yInitialCoordinates = event.clientY - drawingBoard.top;

  xInitial = xInitialCoordinates.toFixed(2);
  yInitial = yInitialCoordinates.toFixed(2);

  if (initialPoint === null) {
    //ctx.clearRect(10,10,xInitial,yInitial);
    ctx.fillStyle = "#66AF7F";
    ctx.beginPath();
    ctx.arc(xInitial, yInitial, 10, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
  }
  if (initialText === null) {
    ctx.font = "15px Arial";
    ctx.fillStyle = "#66AF7F";
    ctx.fillText("Initial Point", xInitialCoordinates + 10, yInitialCoordinates + 10);

    return { initialPoint: initialPoint, initialText: initialText, xInitial: xInitial, yInitial: yInitial };
  }
}

//TARGET POINT DECLARATION
function drawTargetPoint(event, targetPoint, targetText, xTarget, yTarget) {

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  var drawingBoard = canvas.getBoundingClientRect();

  var xTargetCoordinates = void 0;
  var yTargetCoordinates = void 0;
  xTargetCoordinates = event.clientX - drawingBoard.left;
  yTargetCoordinates = event.clientY - drawingBoard.top;

  xTarget = xTargetCoordinates.toFixed(2);
  yTarget = yTargetCoordinates.toFixed(2);

  if (targetPoint === null) {
    //ctx.clearRect(10,10,xTarget,yTarget);
    ctx.fillStyle = "#C35244";
    ctx.beginPath();
    ctx.arc(xTarget, yTarget, 10, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
  }
  if (targetText === null) {
    ctx.font = "15px Arial";
    ctx.fillStyle = "#C35244";
    ctx.fillText("Target Point", xTargetCoordinates + 10, yTargetCoordinates + 10);
  }
  return { targetPoint: targetPoint, targetText: targetText, xTarget: xTarget, yTarget: yTarget };
}

//OBSTACLES DECLARATION

var setValue = document.getElementById('obstacleScaling');
var setTypeColor = document.getElementById('selectingColor');

function drawObstacles(event, obstacleP, xObstacle, yObstacle, setRadian, setColor) {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  var drawingBoard = canvas.getBoundingClientRect();

  var xObsCoordinates = void 0;
  var yObsCoordinates = void 0;
  xObsCoordinates = event.clientX - drawingBoard.left;
  yObsCoordinates = event.clientY - drawingBoard.top;

  xObstacle = xObsCoordinates.toFixed(2);
  yObstacle = yObsCoordinates.toFixed(2);

  setColor = setTypeColor.value;
  setRadian = setValue.value;
  ctx.fillStyle = setColor;
  ctx.beginPath();
  ctx.arc(xObsCoordinates, yObsCoordinates, setRadian, 0, Math.PI * 2, true);
  ctx.fill();

  return { obstacleP: obstacleP, xObstacle: xObstacle, yObstacle: yObstacle, setRadian: setRadian, setColor: setColor };
}

// CHECKS IF ALGORITHM HAS GOT ALL NECESSARY VARIABLES

function performAlgorithm() {
  if (global_xStart !== undefined && global_yStart !== undefined && global_xEnd !== undefined && global_yEnd !== undefined) {
    var finalResult = void 0;
    finalResult = Algorithm(global_xStart, global_yStart, global_xEnd, global_yEnd);
    pathDrawing(finalResult);
  }
}
// CLEAR BOARD
function clearBoard() {
  window.location.reload();
}

/*-------------PATH DRAWING--------------------*/

function pathDrawing(resultConverted) {

  ctx.beginPath();
  ctx.lineWidth = "1";
  ctx.strokeStyle = "#011A33";
  ctx.moveTo(resultConverted[0][0], resultConverted[0][1]);

  for (var i = 0; i < resultConverted.length; ++i) {
    ctx.fillRect(resultConverted[i][0], resultConverted[i][1], 2, 2);
    ctx.lineTo(resultConverted[i][0], resultConverted[i][1]);
  }
  ctx.stroke();
}
//# sourceMappingURL=canvasjs.js.map