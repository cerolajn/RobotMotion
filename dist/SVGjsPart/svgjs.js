'use strict';

/*---------------------EVENTS HANDLING----------------------*/
(function () {
  /*--------------------INITIAL POINT----------------------*/
  var initialpoint = document.getElementById('initialPoint'),
      initPoint = null;
  initText = null;
  xIntValue = null;
  yIntValue = null;

  initialpoint.addEventListener('click', function (e) {

    buttonDisabled(initialpoint);

    creatingCoordinatesNode();

    //drawing.click(null);
    var clickedCount = 0;
    var clickedCountMax = 1;
    drawing.click(function (e) {
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
        var elementType = 'Initial Point';
        setElementCoordinates(elementType, xInitial, yInitial);

        global_xStart = xIntValue;
        global_yStart = yIntValue;
      }
    });
  }, false);

  /*---------------------TARGET POINT-----------------------*/

  var targetpoint = document.getElementById('targetPoint'),
      targPoint = null;
  targText = null;
  xTargValue = null;
  yTargValue = null;

  targetpoint.addEventListener('click', function (e) {
    mode = 'target-point';

    buttonDisabled(targetpoint);

    creatingCoordinatesNode();

    //drawing.click(null);
    var clickedCount = 0;
    var clickedCountMax = 1;

    drawing.click(function (e) {
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
    });
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

    drawing.click(function (e) {
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
        setElementCoordinates(elementType, xObstacle, yObstacle, setRadian, setColor, obstacleP);
      } else {
        showAlertInformation();
      }
    });
  }, false);

  /*------------------------CLEAR BOARD---------------------------*/

  var clear = document.getElementById('clearBoard');
  clear.onclick = clearBoard;

  /*------------------------SHOW ROUTE------------------------*/
  var routeDrawing = document.getElementById('resultClick');
  routeDrawing.onclick = performAlgorithm;
})();

/*-----------------------FUNCTIONS DECLARATION------------------------------*/

//BACKGROUND DECLARATION
var drawing = SVG('svgContainer').size('100%', '100%');

var drawContainer = drawing.group();
drawContainer.rect(800, 600).fill('#C3D1DE');

//GLOBAL VARIABLE HANDLING
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
  positionListItem.style.paddingTop = '20px';
  positionListItem.style.listStyleType = 'none';
  insertingAfter(positionListItem, positionList);
}

// ADDITIONAL FUNCTION FOR INSERTING EACH CREATED LIST ITEMS AFTER LAST ONE

function insertingAfter(newNode, parentingNode) {
  parentingNode.parentNode.insertBefore(newNode, parentingNode.nextSibling);
}

// SETTING VALUES OF COORDINATES
var deleteButton = void 0;

function setElementCoordinates(setPointType, xValue, yValue, setRadius, givenColor, eRemove) {
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
    removeButton.onclick = function () {
      removeObstacle(this, eRemove);
    };
  }
}

// REMOVING OBSTACLES DYNAMICALlY

function removeObstacle(deletingButton, elementToRemove) {

  var item = deletingButton.parentNode;
  var parentList = item.parentNode;

  item.removeChild(deletingButton);
  parentList.removeChild(item);
  elementToRemove.remove();
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

// INITIAL POINT FUNCTION DECLARATION

function drawInitialPoint(event, initialPoint, initialText, xInitial, yInitial) {

  var offSetting = drawContainer.node.getBoundingClientRect();

  var xInitialCoordinates = void 0;
  var yInitialCoordinates = void 0;

  xInitialCoordinates = event.clientX - offSetting.left;
  yInitialCoordinates = event.clientY - offSetting.top;

  xInitial = xInitialCoordinates.toFixed(2);
  yInitial = yInitialCoordinates.toFixed(2);

  if (initialPoint === null) initialPoint = drawing.circle(25);
  initialPoint.center(xInitialCoordinates, yInitialCoordinates).fill('#66AF7F');

  if (initialText === null) initialText = drawing.text('Initial Point');
  initialText.move(xInitialCoordinates + 10, yInitialCoordinates + 10).font({
    fill: '#66AF7F',
    family: 'Arial',
    size: '15px'
  });

  return { initialPoint: initialPoint, initialText: initialText, xInitial: xInitial, yInitial: yInitial };
}

//TARGET POINT DECLARATION

function drawTargetPoint(event, targetPoint, targetText, xTarget, yTarget) {

  var offSetting = drawContainer.node.getBoundingClientRect();
  var xTargetCoordinates = void 0;
  var yTargetCoordinates = void 0;

  xTargetCoordinates = event.clientX - offSetting.left;
  yTargetCoordinates = event.clientY - offSetting.top;

  xTarget = xTargetCoordinates.toFixed(2);
  yTarget = yTargetCoordinates.toFixed(2);

  if (targetPoint === null) targetPoint = drawing.circle(25);
  targetPoint.center(xTargetCoordinates, yTargetCoordinates).fill('#C35244');

  if (targetText === null) targetText = drawing.text('Goal Point');
  targetText.move(xTargetCoordinates + 10, yTargetCoordinates + 10).font({
    fill: '#C35244',
    family: 'Arial',
    size: '15px'
  });

  return { targetPoint: targetPoint, targetText: targetText, xTarget: xTarget, yTarget: yTarget };
}

//OBSTACLES DECLARATION

var setValue = document.getElementById('obstacleScaling');
var setTypeColor = document.getElementById('selectingColor');

function drawObstacles(event, obstacleP, xObstacle, yObstacle, setRadian, setColor) {

  var offSetting = drawContainer.node.getBoundingClientRect();

  var xObsCoordinates = void 0;
  var yObsCoordinates = void 0;
  xObsCoordinates = event.clientX - offSetting.left;
  yObsCoordinates = event.clientY - offSetting.top;

  xObstacle = xObsCoordinates.toFixed(2);
  yObstacle = yObsCoordinates.toFixed(2);

  setColor = setTypeColor.value;
  setRadian = setValue.value;
  obstacleP = drawing.circle(setRadian);
  obstacleP.center(xObsCoordinates, yObsCoordinates).fill(setColor);

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

  var drawing = SVG('svgContainer').size('100%', '100%').size(800, 600).path().attr({
    fill: 'none',
    stroke: '#011A33',
    'stroke-width': 2
  });

  drawing.M(resultConverted[0][0], resultConverted[0][1]);
  for (var i = 0; i < resultConverted.length; ++i) {
    drawing.L(resultConverted[i][0], resultConverted[i][1]);
  }
}
//# sourceMappingURL=svgjs.js.map