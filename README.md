#WindBot Chat
WindBot Chat is powered by [socket.io](http://socket.io/) for the real-time engine, [Redis](http://redis.io) for the back-end database and [React](http://facebook.github.io/react/) for the web page view.

##Requirements
 - [Node.js](https://nodejs.org/download/) or [io.js](https://iojs.org/) installed
 - A working [MySQL Server](https://dev.mysql.com/downloads/mysql/)
 - A working [Redis Server](http://redis.io/topics/quickstart)

##Init the Test DB
Create a _forum_db_ database in your MySQL server and then import the backup database included in the root of this project.

`mysql -u root -p[root_password] forum_db < forum_db.sql`

This database will come with a few vBulletin test users:

| UserId | Username      | Password      | Usergroup  | NumPosts |
| ------ | ------------- | ------------- |:----------:|:--------:|
| 1      | Admin         | admin         | Admin      | 1        |
| 2      | Moderator     | mod           | Moderator  | 0        |
| 3      | User1         | user1         | Registered | 300      |
| 4      | User2         | user2         | Registered | 200      |

If you need to login with any of those users just access: [http://localhost:3001/login](http://localhost:3001/login)

##Setup
You are gonna need [gulp](http://gulpjs.com/) to build the [React](http://facebook.github.io/react/) front-end. I also recommend using [nodemon](https://github.com/remy/nodemon) to automatically restart whenever you make changes to the back-end.

`npm install -g gulp nodemon`

After setting up everything and initializing the database you must install the project dependencies:

`npm install`

##Start Server
You can start the Socket.io server by starting up 'bin/www'

`nodemon ./bin/www`

Then you can open up it in your browser:

[http://localhost:3001](http://localhost:3001)

##Start React Building System
You can start the React building system by starting up gulp.

`gulp`

The compiled content goes to the 'build' folder. 
