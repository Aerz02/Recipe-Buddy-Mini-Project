# Recipe-Buddy-Mini-Project
Requirements that I have completed are as followed:
* **R1: Home page**
  - R1A: Display the name of the web application.
  - R1B: Display links to other pages or a navigation bar that contains links to other pages.
  
* **R2: About page**
  - R2A: Display information about the web application including your name as the developer. Display a link to the home page or a navigation bar that contains links to other pages.
  - R3A: Display a form to users to add a new user to the database. The form should consist of the following items: first name, last name, email address, username, and password.  Display a link to the home page or a navigation bar that contains links to other pages.
  
* **R3: Register page**
  - R3B:  Collect form data to be passed to the back-end (database) and store user data in the database. Each user data consists of the following fields: first name, last name, email address, username and password. To provide security of data in storage, a hashed password should only be saved in the database, not a plain password.
  - R3C: Display a message indicating that add operation has been done.

* **R4: Login page**
  - R4A: Display a form to users to log in to the dynamic web application. The form should consist of the following items: username and password.  Display a link to the home page or a navigation bar that contains links to other pages.
  - R4B: Collect form data to be checked against data stored for each registered user in the database. Users are logged in if and only if both username and password are correct. 
  - R4C: Display a message indicating whether login is successful or not and why not successful.

* **R5: Logout**
  - There is a way to logout, a message is displayed upon successful logout.
  
* **R6: Add food page**
  - R6A: Display a form to users to add a new food item to the database.
  - R6B:  Collect form data to be passed to the back-end (database) and store food items in the database.
  - R6C: Display a message indicating that add operation has been done.
  - Going beyond by saving the username of the user who has added this food item to the database. [3 marks]
  
* **R7: Search food page**
  - R7A: Display a form to users to search for a food item in the database. 'The form should contain just one field - to input the name of the food item'. Display a link to the home page or a navigation bar that contains links to other pages.
  - R7B:  Collect form data to be passed to the back-end (database) and search the database based on the food name collected from the form. If food found, display a template file (ejs, pug, etc) including data related to the food found in the database to users. Display a message to the user, if not found.
  - R7C: Going beyond, search food items containing part of the food name as well as the whole food name. As an example, when searching for ‘bread’ display data related to ‘pitta bread’, ‘white bread’, ‘wholemeal bread’, and so on. [6 marks] 

* **R8: Update food page**
  - R8A: Display search food form. Display a link to the home page or a navigation bar that contains links to other pages.
  - R8B: If food found, display all data related to the food found in the database to users in forms so users can update each field. Display a message to the user if not found. Collect form data to be passed to the back-end (database) and store updated food items in the database. Display a message indicating the update operation has been done. 
  - You can go beyond this requirement by letting ONLY the user who created the same food item update it. [3 marks]
  - R8C: Implement a delete button to delete the whole record, when the delete button is pressed, it is good practice to ask 'Are you sure?' and then delete the food item from the database, and display a message indicating the delete has been done. 

* **R9: List food page**
  - R9A: Display all fields for all foods stored in the database. Display a link to the home page or a navigation bar that contains links to other pages.
  - R8B: You can gain more marks for your list page is organised in a tabular format instead of a simple list.
  
* **R10: API**
 - There is a basic API displayed on '/api' route listing all foods stored in the database in JSON format. i.e. food content can also be accessed as JSON via HTTP method, It should be clear how to access the API (this could include comments in code).
 
* **R11: Form Validation**
  - registered route at index.js lines: 87 - 91
  - loggedin route at index.js lines: 127 - 130
  - update-search-result route at index.js line: 224
  - foodupdated route at index.js lines: 240 - 249
  - fooddeleted route at index.js line: 286
