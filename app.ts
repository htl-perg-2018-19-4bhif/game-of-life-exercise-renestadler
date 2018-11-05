window.onload = () => { //With the Gun I get usually about 60 FPS (after startup; between 55 and 65 fps)
  const enableGun = true; //Should the gun be enabled?
  const boardSize = 800;  //Size of the board in the browser
  const entitySize = 4;   //Size of one entity
  const initPercent = 3;  //Initial Percent of Allive Cells -> 5 works out better
  let entities = new Array(boardSize / entitySize); //Array for Cells
  let surroundings = new Array(boardSize / entitySize); //Arrays for Number of neighbour cells
  const canvas = <HTMLCanvasElement>document.getElementById('canvas');
  canvas.width = canvas.height = boardSize;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgba(0, 0, 0, 1)';
  ctx.clearRect(0, 0, boardSize, boardSize);
  initArr();
  //Start Drawing of the field
  window.requestAnimationFrame(drawField);
  function initArr() {
    for (let i = 0; i < entities.length; i++) {
      entities[i] = new Array(boardSize / entitySize);
      surroundings[i] = new Array(boardSize / entitySize);
      for (let j = 0; j < boardSize / entitySize; j++) {
        entities[i][j] = 0; //init entities
        surroundings[i][j] = 0; //set every cell to 0 neighbours
      }
    }
    if (enableGun) {
      //Gun Data
      entities[1][5] = 3;
      changeCount(1, 5, 1);
      entities[1][6] = 3;
      changeCount(1, 6, 1);
      entities[2][5] = 3;
      changeCount(2, 5, 1);
      entities[2][6] = 3;
      changeCount(2, 6, 1);
      entities[11][5] = 3;
      changeCount(11, 5, 1);
      entities[11][6] = 3;
      changeCount(11, 6, 1);
      entities[11][7] = 3;
      changeCount(11, 7, 1);
      entities[12][4] = 3;
      changeCount(12, 4, 1);
      entities[12][8] = 3;
      changeCount(12, 8, 1);
      entities[13][3] = 3;
      changeCount(13, 3, 1);
      entities[13][9] = 3;
      changeCount(13, 9, 1);
      entities[14][3] = 3;
      changeCount(14, 3, 1);
      entities[14][9] = 3;
      changeCount(14, 9, 1);
      entities[15][6] = 3;
      changeCount(15, 6, 1);
      entities[16][4] = 3;
      changeCount(16, 4, 1);
      entities[16][8] = 3;
      changeCount(16, 8, 1);
      entities[17][5] = 3;
      changeCount(17, 5, 1);
      entities[17][6] = 3;
      changeCount(17, 6, 1);
      entities[17][7] = 3;
      changeCount(17, 7, 1);
      entities[18][6] = 3;
      changeCount(18, 6, 1);
      entities[21][3] = 3;
      changeCount(21, 3, 1);
      entities[21][4] = 3;
      changeCount(21, 4, 1);
      entities[21][5] = 3;
      changeCount(21, 5, 1);
      entities[22][3] = 3;
      changeCount(22, 3, 1);
      entities[22][4] = 3;
      changeCount(22, 4, 1);
      entities[22][5] = 3;
      changeCount(22, 5, 1);
      entities[23][2] = 3;
      changeCount(23, 2, 1);
      entities[23][6] = 3;
      changeCount(23, 6, 1);
      entities[25][1] = 3;
      changeCount(25, 1, 1);
      entities[25][2] = 3;
      changeCount(25, 2, 1);
      entities[25][6] = 3;
      changeCount(25, 6, 1);
      entities[25][7] = 3;
      changeCount(25, 7, 1);
      entities[35][3] = 3;
      changeCount(35, 3, 1);
      entities[35][4] = 3;
      changeCount(35, 4, 1);
      entities[36][3] = 3;
      changeCount(36, 3, 1);
      entities[36][4] = 3;
      changeCount(36, 4, 1);
    } else {
      generateBoard();
    }
  }
  function generateBoard() {
    for (let i = 0; i < entities.length * entities[0].length / 100 * initPercent; i++) {
      let x = Math.floor(Math.random() * boardSize / entitySize), y = Math.floor(Math.random() * boardSize / entitySize);
      if (entities[x][y] !== 3) {
        entities[x][y] = 3;
        changeCount(x, y, 1);
      } else {
        i--;
        continue;
      }
    }
  }
  function changeCount(x: number, y: number, type: number) {
    if (x > 0) {
      if (y > 0) {
        surroundings[x - 1][y - 1] += type;
      }
      surroundings[x - 1][y] += type;
      if (y < entities[x].length - 1) {
        surroundings[x - 1][y + 1] += type;
      }
    }
    if (x < entities[x].length - 1) {
      if (y > 0) {
        surroundings[x + 1][y - 1] += type;
      }
      surroundings[x + 1][y] += type;
      if (y < entities[x].length - 1) {
        surroundings[x + 1][y + 1] += type;
      }
    }
    if (y > 0) {
      surroundings[x][y - 1] += type;
    }
    if (y < entities[x].length - 1) {
      surroundings[x][y + 1] += type;
    }
  }
  function generateTurn() {
    //Array for changes, which are to do
    let change = new Array();
    for (let i = 0; i < entities.length; i++) {
      for (let j = 0; j < entities[i].length; j++) {
        if (entities[i][j] === 1 && (surroundings[i][j] !== 2 && surroundings[i][j] !== 3)) {
          change.push({ x: i, y: j, type: -1 });
        } else if (entities[i][j] === 0 && (surroundings[i][j] === 3)) {
          change.push({ x: i, y: j, type: 1 });
        }
      }
    }
    for (const object of change) {
      changeCount(object.x, object.y, object.type);
      if (object.type === -1) {
        entities[object.x][object.y] = 2;
      } else {
        entities[object.x][object.y] = 3;
      }
    }
  }
  function drawField() {
    //Fill changed rects
    for (let i = 0; i < entities.length; i++) {
      for (let j = 0; j < entities[i].length; j++) {
        if (entities[i][j] === 3) {
          ctx.fillRect(i * entitySize, j * entitySize, entitySize, entitySize);
          entities[i][j] = 1;
        }
        if (entities[i][j] === 2) {
          ctx.clearRect(i * entitySize, j * entitySize, entitySize, entitySize);
          entities[i][j] = 0;
        }
      }
    }
    //Generate next Turn
    generateTurn();
    window.requestAnimationFrame(drawField);
  }
};