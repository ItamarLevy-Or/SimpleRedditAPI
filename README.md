# SimpleRedditAPI
This is a simple RESTFUL reddit api.

you can locally deploy the project by typing either

"node server.js"
 
 or

"npm start"

into the commandline while in the main directory.

This project was built using the Node Express Framework, and used the bodyparser tool
to make it easier to interpret HTTP requests. I also used the axios library to handle
the client side of http requests sent to reddit.

the express framework is fantastic as it does almost all of the work for you, removing
the need for alot of boilerplate code. I chose to use the axios library because it was
very easy to use, and from what I read allows for good scaling through its use of promises.
That said there are many options that would have worked similarly to axios for the purpose
of this application.

The application works as followes:

Express listens for requests at the specified port (determined by the environment). when
a request is received Express invokes the middleware. In this app the middleware doesn't
do much other than log that "something is happening" to the commandline. This was usefull
for debugging purposes, but a more intricate app could have used this capability in much
more powerful ways. after the middleware is invoced Express checks to see if the HTTP
request matches any of the handlers I defined. If it does not HTTP will send back a
message to the user informing them that the particular request made is not supported
by the API. This capability is particularly nice for my application because we only
support GET requests. All of the data is retrieved from reddit so there is no reason
to use POST PUT or DELETE requests. Once one of my handlers is called I retrieve the
desired information from reddit. To do this I make an HTTP request to the reddit API
using axios. The reddit API provides much more information than what I want to provide my
users, so I wrote a function to extract only the information I deamed relevant from the posts
(title, content, links, author, over_18, num_comments, score, gilded). Once I constructed the
response object I sent it back to the user as json.

USAGE:

The api accepts the following requests:

GET [url]/api/reddit
returns the top 25 posts on the front page of reddit

GET [url]/api/reddit/[subreddit]
GET [url]/api/reddit/r/[subreddit]
get the top 25 posts on the specified subreddit

additionally the numbers 1-25 can be added to the
end of any request so that only the top n posts will
be shown

e.g.

GET [url]/api/reddit/10

will only return the top 10 posts on reddit.
I chose not to allow more than 25 posts since that 
would require checking the next page of reddit.

json format:
I formated the json according to the jsend convention:
http://labs.omniti.com/labs/jsend

if the request is succesful the data should look like this

'''
{
    status: success,
    data: {
        subreddit: ""// if data from the front page is retrieved the subreddit will be 
                     // called "-front-page-" this purposefully is not a valid subreddit name
        posts:
            [
                "title": "",
                "selftext": "",
                "url": "",
                "author": "",
                "over_18": bool,
                "num_comments": num,
                "score": num,
                "gilded": num
            ]
        
    }
}
'''

if an invalid is provided the message will look like the following:

{
    "status": "fail",
    "message": "provided invalid limit, limit must be a natural between 1 and 25."
}

and if the reddit API fails for whatever reason the following message will be received

{
    "status": "error",
    "message": "ERROR, view error property for detais",
    "error": [status number from reddit]
}

I have not done much web development before this. When working on group projects
in the past I usually worked on the modal and not with the webapp. This project was
very informative and taught me alot about how a web API works. I used the https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4 tutorial
as a jumping off point.

Note that to my knowledge the
https://scotch.io/tutorials/creating-a-single-page-todo-app-with-node-and-angular
tutorial is no longer correct. I beleive the problem stems with how Express 
interacts with Angular. It is also possilbe however that I did not correctly follow
the afformentioned tutorial. If the tutorial is indead broken I am sure it could
be fixed with a little more fiddling than what I attempted.