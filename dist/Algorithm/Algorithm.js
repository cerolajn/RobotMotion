"use strict";

/*INITIAL INPUTS*/
//ObjectiveFunction
//Number of iterations
//Number of population(size)
//Search space - dimension,2 unknown variables : x and y
//Inertia
//w =1 (inertia weight)
//wdamp = 0.98 (dumping inertia )
//Coefficients
//c1=1.5 (Personal Acceleration Coefficient )
//c2=1.5 (Social Acceleration Coefficient)
/*-----------------------------------------------------------*/

/*ALGORITHM STEPS ( source- theory part of final project and references)
1) Basic and beginning initialization  with random values of position and velocity each member of the swarm.
2) Fitness function. is evaluated through all particles in swarm.
3) The value obtained from the fitness function from particle i  is compare with the value of Pibest. In case that Pibest has got worse value thank evaluated value of fitness function. New value of fitness function  takes the place of Pibest.
4) If the value in Pibest is better than Pgbest, then Pgbest = Pibest.
5) Updating and modification velocity and position of the particles using equations.
6) In case of not-reaching maximum value of iteration or particular condition was not fulfilled, the algorithm comes back to the point 2.
*/
/*---------------- FUNCTION DECLARATION----------------------*/

function Algorithm(xStartPoint, yStartPoint, xEndPoint, yEndPoint) {
  var populationN = 15;
  // space dimension
  var searchSpace = 2;
  // the greatest position from all sample elements
  var bGroupPosition = [];
  // the greatest value of fitness in al sample elements
  var bGroupFitValue = null;
  // quantity of iteration
  var loopNValue = 4;
  // value of inertia
  var finalIValue = 0.98;
  // coefficient personal
  var pC1 = 1.5;
  // coefficient social
  var sC2 = 1.5;
  // array which holds obtained position
  var positionResultsArray = [];
  // declaration of array with elements
  var group_member = [];
  // creating N group members
  for (var nComp = 0; nComp < populationN; nComp++) {
    group_member.push({
      // member position
      mPCoordinates: [],
      //member best position
      mBPCoordinates: [],
      //member velocity
      mVCoordinates: [],
      //member fit value
      mFitValue: null,
      //member best fit value
      mBFitValue: null
    });
    // initialization random coordinates of position, velocity and best value of position for each member of group
    for (var spaceComp = 0; spaceComp < searchSpace; spaceComp++) {
      group_member[nComp].mPCoordinates.push(Math.random());
      group_member[nComp].mVCoordinates.push(Math.random());
      group_member[nComp].mBPCoordinates.push(group_member[nComp].mPCoordinates[spaceComp]);
    }
    // first setting fit value according to fitness function
    group_member[nComp].mFitValue = FitnessFunction(group_member[nComp].mPCoordinates);
    // checking conditions of fit value and assigning best group position
    if (group_member[nComp].mFitValue < bGroupFitValue || bGroupFitValue == null) {
      bGroupFitValue = group_member[nComp].mFitValue;
      bGroupPosition = [];
      for (var gComp = 0; gComp < group_member[nComp].mPCoordinates.length; gComp++) {
        bGroupPosition.push(group_member[nComp].mPCoordinates[gComp]);
      }
    }
  }
  // main algorithm loop
  for (var loopIter = 0; loopIter < loopNValue; loopIter++) {
    for (var _nComp = 0; _nComp < group_member.length; _nComp++) {
      for (var vComp = 0; vComp < group_member[_nComp].mVCoordinates.length; vComp++) {
        // assigning velocity of each group member according to formula
        group_member[_nComp].mVCoordinates[vComp] = Math.max(0, Math.min(1, finalIValue * group_member[_nComp].mVCoordinates[vComp] + pC1 * Math.random() * (group_member[_nComp].mBPCoordinates[vComp] - group_member[_nComp].mPCoordinates[vComp]) + sC2 * Math.random() * (bGroupPosition[vComp] - group_member[_nComp].mPCoordinates[vComp])));
        // assigning position of each group member according to formula
        group_member[_nComp].mPCoordinates[vComp] = Math.max(0, Math.min(1, group_member[_nComp].mPCoordinates[vComp] + group_member[_nComp].mVCoordinates[vComp]));
      }
      // updating fitness value
      group_member[_nComp].mFitValue = FitnessFunction(group_member[_nComp].mPCoordinates);
      //assigning  best member of group position after fulfilling proper conditions
      if (group_member[_nComp].mFitValue < group_member[_nComp].mBFitValue) {
        group_member[_nComp].mBFitValue = group_member[_nComp].mFitValue;
        group_member[_nComp].mBPCoordinates = [];
        for (var _gComp = 0; _gComp < group_member[_nComp].mPCoordinates.length; _gComp++) {
          group_member[_nComp].mBPCoordinates.push(group_member[_nComp].mPCoordinates[_gComp]);
        }
      }
      //assigning  best group position after fulfilling proper conditions
      if (group_member[_nComp].mFitValue < bGroupFitValue) {
        bGroupFitValue = group_member[_nComp].mFitValue;
        bGroupPosition = [];
        for (var _gComp2 = 0; _gComp2 < group_member[_nComp].mPCoordinates.length; _gComp2++) {
          bGroupPosition.push(group_member[_nComp].mPCoordinates[_gComp2]);
        }
      }
    }
    positionResultsArray.push(group_member[loopIter].mBPCoordinates);
  }
  var resultConverted = void 0;
  resultConverted = PointToPixelConverter(positionResultsArray);

  var convertedInitPoint = [];
  convertedInitPoint.push(xStartPoint, yStartPoint);
  resultConverted.unshift(convertedInitPoint);

  var convertedTargPoint = [];
  convertedTargPoint.push(xEndPoint, yEndPoint);
  resultConverted.push(convertedTargPoint);

  return resultConverted;
}

/**
 * @return {number}
 */
function FitnessFunction(current_pCoordinates) {
  return current_pCoordinates[0] * current_pCoordinates[0] + current_pCoordinates[1] * current_pCoordinates[1];
}

function getArrayColumn(setArray, Column) {
  return setArray.map(function (x) {
    return x[Column];
  });
}

function PointToPixelConverter(positionArray) {
  var convertedArray = [];
  //calculating distance between all x coordinates in array
  var xColumn = getArrayColumn(positionArray, 0);
  var xMin = void 0;
  xMin = Math.min.apply(null, xColumn);
  var xMax = void 0;
  xMax = Math.max.apply(null, xColumn);
  //width
  var xDistance = void 0;
  xDistance = xMax - xMin;
  //Calculating distance between all y coordinates in array
  var yColumn = getArrayColumn(positionArray, 1);
  var yMin = void 0;
  yMin = Math.min.apply(null, yColumn);
  var yMax = void 0;
  yMax = Math.max.apply(null, yColumn);
  //height
  var yDistance = void 0;
  yDistance = yMax - yMin;
  // Changing points to pixel
  for (var i = 0; i < positionArray.length; ++i) {

    positionArray[i][0] = (positionArray[i][0] - xMin) / xDistance * 800;
    positionArray[i][0] = parseFloat(positionArray[i][0].toFixed());
    positionArray[i][1] = (positionArray[i][1] - yMin) / yDistance * 600;
    positionArray[i][1] = parseFloat(positionArray[i][1].toFixed());
    convertedArray.push([positionArray[i][0], positionArray[i][1]]);
  }
  return convertedArray;
}
//# sourceMappingURL=Algorithm.js.map