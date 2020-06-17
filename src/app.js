const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
const likes = [];

function validateRepositoryId(request, response, next){
  const {id} = request.params;
  if(!isUuid(id)){
      return response.status(400).json({error: 'Invalid repository ID'});
  }
  return next();
}
app.use('/repositories/:id', validateRepositoryId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const repository = {id: uuid(), title , likes: 0, url, techs};
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params; 
  const {title, url, techs} = request.body;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if(repositoryIndex < 0){
    return response.status(400).json({error: "Repository not found!"});
  }
  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  }
  repositories[repositoryIndex] = repository;
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id)
  repositories.splice(repositoryIndex, 1);
  if(repositoryIndex < 0){
    return response.status(400).json({error: "Repository not found!"});
  }
  
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;
  const like = {id: uuid(), repositoryId: id}
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if(repositoryIndex < 0){
    return response.status(400).json({error: "Repository not found!"});
  }
  likes.push(like);

  const updateLikeRepository = {likes: repositories[repositoryIndex].likes + 1};
  repositories[repositoryIndex].likes = updateLikeRepository.likes;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
