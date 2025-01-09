g**How to run ENG:**
First split the terminal or open a second terminal window.
The files are split in a client side and a server side, to run both (so you can start the application correctly):
- Type "cd server" in the first console window
- Type "cd client" in the second console window

Secondly, make sure NodeJS is installed in both folders (skip this step if it is already installed).
Enter this in both the terminal/CMD windows:
- Type "npm install" in the 'server' window
- Type "npm install" in the 'client' window 

To start and run the database, (skip this step if you already did this)
1. install the program called XAMPP through the following link: https://www.apachefriends.org/download.html
2. After installation run the program
3. When running click on the button that says "start" behind 'Apache'
4. After that, click on "start" behind 'MySQL'
5. Then click on "Admin" behind 'MySQL'
After it takes you to 'phpMyAdmin' you'll see a button called "new" on the left side of the screen, 
6. When you click the button it will ask you for a name, type in "thebestseller" and click on create
In the phpMyAdmin you will see that the database you just named "thebestseller" is now standing at the bottom of a row of some other automatically created databases
7. Click on the new database and on the almost top of your screen you will see some options, one of them is called import, click on it
8. Pick one of the .csv questionsets you want to import from you project folder. They are located at: server/database/questions
9. After you get to the import screen, click on 'choose file' and select the .CSV file
10. scroll down to the bottom of the import screen and you'll see a switch with the text "first line ..." switch this box to on 
IMPORTANT: do not click other buttons or switches in the import screen unless you know what you are doing!
11. At the bottom of the page you will see a button called "import" click it and your database is ready
IMPORTANT for anyone wanting to change the database, if the database is not started with the correct configurations (read database.js) the server will not start

Lastly, you should start both sides (client and server) of the project:
- Type "npm start" in the 'server' window
- Type "npm start" in the 'client' window


IMPORTANT NOTE:
Everytime your pc is restarted or if you did not correctly end running the program (ctrl + y in terminals to stop running), you will need to do the following things again to start the project:
Database:
1. Startup XAMPP
2. Start Apache
3. Start MySQL
Server:
4. Split terminal/cmd or open a second window
5. On one of those windows type "cd server" to select the server directory
6. Type "npm start" to activate the server
Client: 
7. Select the second terminal/cmd window
8. On the second window type "cd client"
9. Type "npm start" to run the application

POTENTIAL PROBLEM:
MySql is not starting: you see red text in the XAMPP control panel. Make sure with taskmanager if it is not already running,
if it is running, end it and start it again.

IMPORTANT when pushing codes, the following file and folder must not be pushed:
- 'package-lock.json' (file in server and client)
- 'node_modules' (folder in server and client)

DEPENDENCIES VERSIONS:
- NodeJS: v20.17.0
- npm: 10.8.2
- XAMPP: 3.3.0 (windows) 8.2.4 (mac)

