const express = require("express");
const cors = require("cors");
//const {uuid} = require('uuid')

const {uuid, isUuid } = require('uuidV4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function logRequests(request, response, next) {
  const {method, url} = request

  const logLabel = `[${method.toUpperCase()}] ${url}`

  console.time(logLabel); 
  const resp = next();
  console.timeEnd(logLabel);
  return resp;
}

function validateId(request, response, next) {
  const {id} = request.params

  if (!isUuid(id)) {
    return response.status(400).json({error: 'Invalid repository ID.'})
  }

  return next()
}

app.use(logRequests)

app.get("/repositories", (request, response) => {
  return response.json(repositories)

});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body

  const newRepositorie = {
    'id': uuid(),
    'title':title,
    'url': url,
    'techs': techs,
    'likes': 0
  }

  repositories.push(newRepositorie)
  return response.json(newRepositorie)

});

app.put("/repositories/:id", validateId,  (request, response) => {
  const {id} = request.params
  const {title, url, techs} = request.body;
  repositoryIndex = repositories.findIndex(repositorie => repositorie.id === id);

  const newRepository = repositories[repositoryIndex]
  if(repositoryIndex < 0) {
    return response.status(400).json({error:'Repository not found'})
  }

  newRepository.title = title;
  newRepository.url = url;
  newRepository.techs = techs;
      
  repositories[repositoryIndex] = newRepository

  return response.json( newRepository )

});

app.delete("/repositories/:id", validateId, (request, response) => {
  
  const {id} = request.params;
  repositoryIndex = repositories.findIndex(repositorie => repositorie.id === id);
  
  if(repositoryIndex < 0) {
    return response.status(400).json({error:'Repository not found'})
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params
  
  const repositoryIndex = repositories.findIndex(repositorie=>repositorie.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({error:'Repository not found'})
  }

  const newRespository = repositories[repositoryIndex];

  newRespository.likes += 1;

  repositories[repositoryIndex] = newRespository;

  return response.json({likes:newRespository.likes});

});

module.exports = app;
