# Berkley's API for the Lender Tool Kit Node.js & Express Skills Test

This API is Berkley Olmstead's submission for the LTK Node.js & Express Skills Test. API documentation, along with the Assessment's instructions are included in this Readme.

# Table of Contents

1. [How to Run the Project](#Run-Project)
2. [Loan Routes](#Loan-Routes)
3. [Borrower Routes](#Borrower-Routes)
4. [Instructions](#Instructions)
5. [Contact](#Contact)

<a name="Run-Project"></a>

# How to Run the Project

### Clone the Repo

This API requires [Node.JS](https://nodejs.org/) v18.17+ to run. To get a local copy up and running follow these steps:

1. Clone the backend repo to a separate directory by entering the following in a CLI:
   ```sh
   git clone https://github.com/Bolmstead/MockAPILab.git
   ```
2. Install the libraries in the backend directory

   ```sh
   npm install
   ```

### Create a MondoDB Cluster

3. Create a [MongoDB](https://www.mongodb.com/) account and create your own cluster.
4. Create a MONGO_URI environment variable in your backend repository using your cluster's connection string as the value.

### Start your project

5. Run your local server in your backend repository:

   ```sh
   npm start
   ```

# API DOCUMENTATION

<a name="Loan-Routes"></a>

## Loan Routes

### Create Loan

Creates a new loan and assigns new borrowers to the loan.
`POST /loans/create`

#### Request Body:

     [
        {
            "firstName": "Barbra",
            "lastName": "Johnson",
            "phone": "208-999-9799"
        },
            {
            "firstName": "Bob",
            "lastName": "Smith",
            "phone": "208-555-5555"
        }
    ]

### Response:

    {
        "loanId": "123",
        "borrowers": [ {borrower}, {borrower} ]
    }

## Get All Loans

Returns all loans created along with their borrowers.
`GET /loans/all`

### Response:

    [
        {
            "loanId": "123",
            "borrowers": [ {borrower}, {borrower} ]
        },
        {
            "loanId": "456",
            "borrowers": [ {borrower}, {borrower} ]
        },
    ]

## Get Loan Details

Returns loan details of a specific loan
`GET /loans/details/:loanId`

### Response:

    {
        "loanId": "123",
        "borrowers": [ {borrower}, {borrower} ]
    }

## Delete Loan

Deletes a loan when provided a loanId
`DELETE /loans/delete/:loanId`

### Response:

    {
        "status": "success"
    }

## Delete All Loans

Deletes all created Loans
`DELETE /loans/delete-all`

### Response:

    {
        "status": "success"
    }

<a name="Borrower-Routes"></a>

# Borrower Routes

### Edit Borrower's Information

Updates a borrower's firstName, lastName, or phone if provided in body of request. loanId and pairId need to be provided as URL parameters
`PATCH /borrowers/:loanId/:pairId`

#### Request Body:

    {
        "firstName": "James",
        "lastName": "Person",
        "phone": "222-999-2222"
    }

#### Response:

    {
        "firstName": "James",
        "lastName": "Person",
        "phone": "222-999-2222"
    }

### Delete a Borrower

Deletes a borrower and removes them from the loan when provided a loanId and pairId in URL parameters
`DELETE /borrowers/:loanId/:pairId`

#### Response:

    {
        "status": "success"
    }

<a name="Instructions"></a>

## Lender Tool Kit Node.js & Express Skills Test Instructions

This skills test is designed to allow candidates to showcase your development skills with Node.Js.

- Google can be used to lookup helpful information as needed.
- Do not worry if you cannot fully complete the test within the allotted time, the purpose of the test is to allow us to determine skills and to get an insight into how you go about solving the problem.
- Please submit a live recording of the exercise.

## Prerequisites

Please ensure that you have the following tools installed.

- Visual Studio Code / or IDE of your choice
- Node 16+

## Instructions

step 1.) clone this github repository. This repository contains a very basic REST api, using Express.

step 2.) Fix any errors that prevent the project from being built and run. Fix any Encompass problems in the code that may cause issues.

step 3.) Using the loan object schema below, and a data storage method of your choosing, create an API with basic CRUD operations

example loan object

    {
        "loanId": int,
        "borrowers": [
    		{
    			pairId: int
    			firstName: 'string',
    			lastName: 'string',
    			phone: 'string',
    		},
    	],
    }

step 4.) create a GET method that gets all loan objects

step 5.) create a GET method that gets one loan object based on loanId

step 6.) create a POST method that adds a new loan object with an array of borrowers

step 7.) create a PATCH method that updates borrower information based on loanId and pairId

step 8.) create a PATCH or DELETE method that deletes a borrower based on loanId and pairId

step 9.) create a DELETE method that deletes a loan object based on loanId

Bonus points will be awarded for:

- code organization
- Best Practice development skills
- Working Unit Tests

<a name="Contact"></a>

# Contact

Berkley Olmstead - olms2074@gmail.com - [Linkedin](https://www.linkedin.com/in/berkleyolmstead/)

Project Links:

- [Live Site](https://freebay.netlify.app/)
- [https://github.com/Bolmstead/taxrise-frontend](https://github.com/Bolmstead/taxrise-frontend)
- [https://github.com/Bolmstead/taxrise-backend](https://github.com/Bolmstead/taxrise-backend)

[node.js]: http://nodejs.org
[React Bootstrap]: https://react-bootstrap.netlify.app/
[Express.JS]: http://expressjs.com
[ReactJS]: https://react.dev/
[JSON Web Tokens]: https://www.npmjs.com/package/jsonwebtoken
[UUID]: https://www.npmjs.com/package/uuid
[Bcrypt]: https://www.npmjs.com/package/bcrypt
[JSON Schema]: https://www.npmjs.com/package/jsonschema
[Mongoose]: https://www.npmjs.com/package/mongoose
[Firebase]: https://firebase.google.com/
