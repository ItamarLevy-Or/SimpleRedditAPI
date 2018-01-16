
// call desired packages
const axios     = require('axios');
// var Reddit      = require('./app/models/bear');
var express     = require('express');
var app         = express();
var bodyParser = require('body-parser');
const reddit = 'http://www.reddit.com/';
//-front-page- is an invalid subreddit name preventing conflicts
const front_page = "-front-page-"

//function we will use to do all interaction with reddit api
//we will be using axios since to interact with the reddit api, since it is simple to use

function sanitize_post_data(post){
    var sanitary = {}
    sanitary.title        = post.data.title;
    sanitary.selftext     = post.data.selftext;
    sanitary.url          = post.data.url;
    sanitary.author       = post.data.author;
    sanitary.over_18      = post.data.over_18;
    sanitary.num_comments = post.data.num_comments;
    sanitary.score        = post.data.score;
    sanitary.gilded       = post.data.gilded;
    return sanitary;
}

function get_red_obj(subreddit, reddit_url, res){
  sanitary = {};
  axios.get(reddit_url)
  .then(response => {
    sanitary.status = "success";
    sanitary.data = {};
    sanitary.data.subreddit = subreddit;
    sanitary.data.posts = response.data.data.children.map(sanitize_post_data);
    res.json(sanitary);
  })
  .catch(error => {
    console.log("error, bad request: " + error.response.status);
    sanitary.status  = "error";
    sanitary.message = "ERROR, view error property for detais"
    sanitary.error   = error.response.status;
    res.json(sanitary);
  });
//   return sanitary;
}

function is_valid_limit(limit){
    lim = +limit
    return (lim != NaN && lim >= 1 && lim <= 25 && Number.isInteger(lim))
}

function limit_handler(limit, subreddit, res){
    if(is_valid_limit(limit)){
        url = "";
        if (subreddit == front_page){
            url = reddit + ".json?limit=" + limit
        } else {
            url = reddit + 'r/' + subreddit + ".json?limit=" + limit
        }
        get_red_obj(subreddit, url, res); 
    } else{
        ret         = {};
        ret.status  = "fail";
        ret.message = "provided invalid limit, limit must be a natural between 1 and 25."
        res.json(ret);
    }
}

// configure app to use body-parser
// lets us get data from post
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

//ROUTES FOR API

var router = express.Router();

//middleware for all requests
router.use(function(req, res, next){
    //do logging
    console.log('something is happening');
    next();//make sure we go to the next routes
})

//routes that end in /reddit

router.route('/reddit')
    .get(function(req, res) {
        get_red_obj(front_page, reddit + ".json", res)
    });

//There should be a way to replace the need for both of these with a simple regular expression.
//Since there are only a few cases here and this is a small example app I wont worry about it here.
router.route('/reddit/r/:subreddit')
    .get(function(req, res) {
        var sub = req.params.subreddit
        get_red_obj(sub, reddit + 'r/' + sub + ".json", res)
    });

router.route('/reddit/:subreddit')
    .get(function(req, res) {
        var sub = req.params.subreddit;
        //numbers are not valid subreddits so if a subreddit is a valid 
        //limit we can safely assume the user is not actually requesting a subreddit
        if(is_valid_limit(sub)){
            limit_handler(sub, front_page, res);
        } else{
            get_red_obj(sub, reddit + 'r/' + sub + ".json", res)
        }
    });

// router.route('/reddit/:limit')
//     .get(function(req, res) {
//         limit_handler(req.params.limit, front_page, res);
//     });

router.route('/reddit/r/:subreddit/:limit')
    .get(function(req, res) {
        limit_handler(req.params.limit, req.params.subreddit, res);
    });

router.route('/reddit/:subreddit/:limit')
    .get(function(req, res) {
        limit_handler(req.params.limit, req.params.subreddit, res);
    });
    
//Register routes
//all routes will be prefixed with /api
app.use('/api', router);


//abandoned UI attempt since Express did not play well with angular.
//Other people with similar issues said that the the scripts wouldn't be called by the sendFile
//command. Instead only what was written would be exactly displayed.
//index.html file can still be found if interested.
// app.get('*', function(req, res) {
//     res.sendFile('public/index.html' , { root : __dirname}); // load the single view file (angular will handle the page changes on the front-end)
// });

//start server
app.listen(port);
console.log('Magic happens on port: ' + port);