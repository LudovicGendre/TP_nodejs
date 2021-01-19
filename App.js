const http = require('http');
const route = require('url');
const qs = require('querystring');

let i = 0;
let findNumb = 0;
let count = 0
let historic = []

function handleServer (req, res){

  var path = route.parse(req.url, true);

  //Création d'un utilisateur 
  if (req.url === '/users') {
    console.log('path', req.url);
    console.log('method', req.method);
    i++;
    count = 0;
    res.write('Liste de user\n')
    res.end(`L'utilisateur: ${i} vient d'être créé\n`);
// Création d'un nb aléatoire a partir d'un Min and Max
  } else if (req.method === 'POST' && path.pathname === '/party'){
    console.log(req.method)
    let rawData = '';
    req.on('data', data => rawData += data).on('end', ()=>{
      var info = qs.parse(rawData);
      res.writeHead(200, {"Content-Type": "application/json"});
      // findNumb = Math.random() * (parseInt(info.max) - parseInt(info.min)) + parseInt(info.min)
      // findNumb = Math.floor(Math.random() * (100 - 80 +1)) + 80;
      findNumb = Math.floor(Math.random() * (parseInt(info.max) - parseInt(info.min) + 1) + parseInt(info.min))
      res.end(`Min: ${info.min} Max: ${info.max}\n`)
      console.log(findNumb)
    });
// Tentative de trouvé nb aléatoire
  } else if (req.method === 'PUT' && req.url === '/party/current') {
    let rawData = '';
    count++
    req.on('data', data => rawData += data).on('end', ()=>{
      var info = qs.parse(rawData);
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Access-Control-Allow-Origin", "*");
    if(parseInt(info.idea) === findNumb){
      historic.push({
        user: i,
        totalCount: count,
      })
      res.end(`Félicitation, le chiffre était : ${findNumb}\n`)
      // process.exit();

    } else if (parseInt(info.idea) < findNumb) {
      res.end('C\'est Plus\n')

    } else if (parseInt(info.idea) > findNumb) {
      res.end('C\'est Moins\n')
    } else {
      count--
      res.end('Veuillez entrer un nombre\n')
    }
  });
// Historique partie en cours
 } else if (req.method ==='GET' && req.url === '/party/current') {
    res.end(`Actuellement ${count} coups ont était réaliser\n`)

// Historique: Tableau d'objet [{i:user, count:nb de coût},{i:user, count:nb de coût}]
  } else if (req.method === 'GET' && req.url === '/scores') {
    historic.forEach(element => 
      res.write(`utilisateur: ${element.user} | nombre de coups: ${element.totalCount}\n`))
    res.end('\n')
// Rappel routes 
  } else if(req.method === 'GET' && req.url ==='/') {
    res.end('Routes: \n Création d\'user: /users\n Génération nombre aléatoire : /party\n Commencé le jeu: /party/current\n Historic en cours: /party/current\n Scores: /scores\n')
// Error mauvaise route
  } else {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.writeHead(404);
    res.write('Page not found');
    res.end("\n");
  }

};

http.createServer(handleServer).listen(6880);
console.log('Server is running on port 6880...')