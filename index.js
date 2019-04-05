const bodyParser = require('body-parser')
const express = require('express')
const logger = require('morgan')
const app = express()
const {
  fallbackHandler,
  notFoundHandler,
  genericErrorHandler,
  poweredByHandler
} = require('./handlers.js')

// For deployment to Heroku, the port needs to be set using ENV, so
// we check for the port number in process.env
app.set('port', (process.env.PORT || 9001))

app.enable('verbose errors')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(poweredByHandler)

// --- SNAKE LOGIC GOES BELOW THIS LINE ---

// Handle POST request to '/start'
app.post('/start', (request, response) => {
  // NOTE: Do something here to start the game

  // Response data
  const data = {
    color: '#DFFF00',
  }

  return response.json(data)
})

// Handle POST request to '/move'
app.post('/move', (request, response) => {
  // NOTE: Do something here to generate your move
  const board = request.body.board;
  const {
    height,
    width
  } = board;
  const myBody = request.body.you.body;
  const data = {};

  // go in circles
  data.move = avoidWall(myBody, height, width);
  const food = eatFood(myBody, board);
  const self = avoidSelf(board);
  if (food) {
    data.move = food;
  }
  if (self) {
    data.move = self;
  }


  return response.json(data)
})

app.post('/end', (request, response) => {
  // NOTE: Any cleanup when a game is complete.
  return response.json({})
})

app.post('/ping', (request, response) => {
  // Used for checking if this snake is still alive.
  return response.json({});
})

function avoidWall(myBody, height, width) {
  switch (myBody[0].x) {
    case 0:
      if (myBody[0].y === 0)
        return 'right';
      else
        return 'up';
      break;
    case width - 1:
      if (myBody[0].y === height - 1)
        return 'left';
      else
        return 'down';
      break;
    default:
      if (myBody[0].y === 0)
        return 'right';
      else return 'left';
      break;
  }
}

function eatFood(myBody, board) {
  const nearestFood = foodNearMe(myBody, board.food);

  if (nearestFood) {
    switch (nearestFood) {
      case x > myBody[0].x:
        return 'right';
      case x < myBody[0].x:
        return 'left';
      case y > myBody[0].y:
        return 'down';
      case y < myBody[0].y:
        return 'up';
    }
  }
  return '';
}

function foodNearMe(myBody, foods) {
  foods.forEach(food => {
    if (Math.abs(myBody.x - food.x) <= 1) {
      if (y = Math.abs(myBody.y - food.y) <= 1) {
        return {
          x: food.x,
          y: food.y,
        };
      }
    }
  });
}

function avoidSelf(board) {

  return '';
}

// --- SNAKE LOGIC GOES ABOVE THIS LINE ---

app.use('*', fallbackHandler)
app.use(notFoundHandler)
app.use(genericErrorHandler)

app.listen(app.get('port'), () => {
  console.log('Server listening on port %s', app.get('port'))
})
