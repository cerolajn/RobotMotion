/*---------------------EVENTS HANDLING----------------------*/
(function(){
  /*--------------------INITIAL POINT----------------------*/
  let initialpoint = document.getElementById('initialPoint'),
  initPoint = null
  initText = null
  xIntValue = null
  yIntValue= null


  initialpoint.addEventListener('click', (e) => {

    buttonDisabled(initialpoint)

    creatingCoordinatesNode()

    //drawing.click(null);
    let clickedCount = 0
    let clickedCountMax = 1
    drawing.click((e) => {
      clickedCount ++
      if (clickedCount <= clickedCountMax){
        let {initialPoint, initialText, xInitial, yInitial} = drawInitialPoint(e, initPoint, initText, xIntValue, yIntValue);
        initPoint = initialPoint;
        initText = initialText;
        xIntValue= xInitial;
        yIntValue = yInitial;
        let elementType = 'Initial Point';
        setElementCoordinates(elementType,xInitial,yInitial);

        global_xStart = xIntValue;
        global_yStart = yIntValue;
        }

    });
  },false)

  /*---------------------TARGET POINT-----------------------*/

  let targetpoint = document.getElementById('targetPoint'),
  targPoint = null
  targText = null
  xTargValue= null
  yTargValue= null


  targetpoint.addEventListener('click', (e) => {
    mode = 'target-point';

    buttonDisabled(targetpoint)

    creatingCoordinatesNode()

    //drawing.click(null);
    let clickedCount = 0
    let clickedCountMax = 1

    drawing.click((e) => {
      clickedCount ++
      if (clickedCount <= clickedCountMax){
        let {targetPoint, targetText, xTarget, yTarget} = drawTargetPoint(e, targPoint, targText, xTargValue, yTargValue);
        targPoint = targetPoint;
        targText = targetText;
        xTargValue = xTarget;
        yTargValue = yTarget;

        global_xEnd = xTargValue;
        global_yEnd = yTargValue;

        let elementType = 'Target Point';
        setElementCoordinates(elementType,xTarget,yTarget);
        }
    });

  },false)

  /*------------------------OBSTACLES------------------------*/

  let obstacles = document.getElementById('obstacles'),
  obstaclePoints = null,
  xObsValue= null,
  yObsValue= null,
  rad = null,
  inputColor = null;

  obstacles.addEventListener('click', (e) => {

    buttonDisabled(obstacles)

    let clickedCount = 0
    let clickedCountMax = 8

    drawing.click((e) => {
      clickedCount ++
      if (clickedCount <= clickedCountMax) {
        let {obstacleP, xObstacle, yObstacle, setRadian,setColor} = drawObstacles(e, obstaclePoints, xObsValue, yObsValue, rad,inputColor);
        obstaclePoints = obstacleP;
        xObsValue = xObstacle
        yObsValue = yObstacle
        rad = setRadian
        inputColor = setColor

        creatingCoordinatesNode()
        let elementType = 'Obstacles';
        setElementCoordinates(elementType, xObstacle, yObstacle,setRadian,setColor,obstacleP);
      } else {
        showAlertInformation()
      }
    });
  },false)

  /*------------------------CLEAR BOARD---------------------------*/

  let clear = document.getElementById('clearBoard');
  clear.onclick = clearBoard;

  /*------------------------SHOW ROUTE------------------------*/
  let routeDrawing = document.getElementById('resultClick');
  routeDrawing.onclick = performAlgorithm;

})();

/*-----------------------FUNCTIONS DECLARATION------------------------------*/

//BACKGROUND DECLARATION
  let drawing = SVG('svgContainer').size('100%','100%')


  let drawContainer = drawing.group()
  drawContainer.rect(800,600).fill('#C3D1DE')

//GLOBAL VARIABLE HANDLING
  let global_xStart
  let global_yStart
  let global_xEnd
  let global_yEnd

/*------------------------------------------*/

//BASIC FUNCTIONS

//CREATING ADDITIONAL LIST NODES IN ORDER TO PRINT ELEMENT'S COORDINATES

function creatingCoordinatesNode(){
  let positionList = document.querySelector('.positionList')
  let positionListItem = document.createElement("li")
  positionListItem.setAttribute("class", "positionItem");
  positionListItem.style.color = "#19455E"
  positionListItem.style.width = '800px'
  positionListItem.style.height = '35px'
  positionListItem.style.fontWeight = 'bold'
  positionListItem.style.fontSize = '19px'
  positionListItem.style.paddingTop = '20px'
  positionListItem.style.listStyleType = 'none'
  insertingAfter(positionListItem, positionList)
}

// ADDITIONAL FUNCTION FOR INSERTING EACH CREATED LIST ITEMS AFTER LAST ONE

function insertingAfter(newNode,parentingNode) {
  parentingNode.parentNode.insertBefore(newNode, parentingNode.nextSibling);
}

// SETTING VALUES OF COORDINATES
let deleteButton;

function setElementCoordinates(setPointType,xValue,yValue,setRadius,givenColor,eRemove){
  let selectedItem = document.querySelector('.positionItem');
  if((setRadius === undefined) &&(givenColor === undefined)) {
    selectedItem.innerHTML = `Coordinates of ${setPointType} X: ${xValue} Y: ${yValue}`;
  } else {
    selectedItem.innerHTML = `Coordinates of ${setPointType} X: ${xValue} Y: ${yValue} Radius :${setRadius}`;
    deleteButton = document.createElement("input")
    deleteButton.type = "button"
    deleteButton.value = "Delete"
    deleteButton.setAttribute("class", "deleteButton")
    selectedItem.appendChild(deleteButton)
    selectedItem.style.color = givenColor;
    let removeButton = document.querySelector('.deleteButton');
    removeButton.onclick = function() {
      removeObstacle(this, eRemove);
    };
  }
}

// REMOVING OBSTACLES DYNAMICALlY

function removeObstacle(deletingButton,elementToRemove){

  let item = deletingButton.parentNode;
  let parentList = item.parentNode;

  item.removeChild(deletingButton)
  parentList.removeChild(item)
  elementToRemove.remove();
}

// DISABLE BUTTON AFTER ONE CLICK

function buttonDisabled(setButton){
  setButton.disabled = true;
  setButton.style.background = "#909090"
  setButton.style.borderColor = "#909090"
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

// INITIAL POINT FUNCTION DECLARATION

function drawInitialPoint(event,initialPoint,initialText,xInitial,yInitial) {

  let offSetting = drawContainer.node.getBoundingClientRect()

  let xInitialCoordinates;
  let yInitialCoordinates;

  xInitialCoordinates = event.clientX - offSetting.left;
  yInitialCoordinates = event.clientY - offSetting.top;

  xInitial = xInitialCoordinates.toFixed(2);
  yInitial = yInitialCoordinates.toFixed(2);

  if (initialPoint === null )

    initialPoint = drawing.circle(25)
  initialPoint.center(xInitialCoordinates, yInitialCoordinates).fill('#66AF7F')


  if (initialText === null )
    initialText = drawing.text('Initial Point')
  initialText.move(xInitialCoordinates + 10, yInitialCoordinates + 10).font({
    fill: '#66AF7F',
    family: 'Arial',
    size: '15px'
  })

  return {initialPoint, initialText, xInitial, yInitial};

}

//TARGET POINT DECLARATION

function drawTargetPoint(event,targetPoint,targetText,xTarget,yTarget) {

  let offSetting = drawContainer.node.getBoundingClientRect()
  let xTargetCoordinates;
  let yTargetCoordinates;

  xTargetCoordinates = event.clientX - offSetting.left
  yTargetCoordinates = event.clientY - offSetting.top;


  xTarget = xTargetCoordinates.toFixed(2);
  yTarget = yTargetCoordinates.toFixed(2);

  if (targetPoint === null )
    targetPoint = drawing.circle(25)
  targetPoint.center(xTargetCoordinates, yTargetCoordinates).fill('#C35244')

  if (targetText === null )
    targetText = drawing.text('Goal Point')
  targetText.move(xTargetCoordinates + 10, yTargetCoordinates + 10).font({
    fill: '#C35244',
    family: 'Arial',
    size: '15px'
  })


  return {targetPoint, targetText, xTarget, yTarget};
}

//OBSTACLES DECLARATION

let setValue = document.getElementById('obstacleScaling');
let setTypeColor= document.getElementById('selectingColor');

function drawObstacles(event,obstacleP,xObstacle,yObstacle,setRadian,setColor) {

  let offSetting = drawContainer.node.getBoundingClientRect()

  let xObsCoordinates
  let yObsCoordinates
  xObsCoordinates = event.clientX - offSetting.left
  yObsCoordinates = event.clientY - offSetting.top


  xObstacle = xObsCoordinates.toFixed(2);
  yObstacle = yObsCoordinates.toFixed(2);

  setColor = setTypeColor.value
  setRadian= setValue.value
  obstacleP = drawing.circle(setRadian)
  obstacleP.center(xObsCoordinates, yObsCoordinates).fill(setColor)

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
  window.location.reload()
}

/*-------------PATH DRAWING--------------------*/
function pathDrawing(resultConverted) {

  let drawing = SVG('svgContainer').size('100%','100%')
    .size(800, 600)
    .path()
    .attr({
      fill: 'none',
      stroke: '#011A33',
      'stroke-width': 2,
    })

  drawing.M(resultConverted[0][0], resultConverted[0][1])
  for (let i = 0; i < resultConverted.length; ++i) {
    drawing.L(resultConverted[i][0], resultConverted[i][1])
  }
}