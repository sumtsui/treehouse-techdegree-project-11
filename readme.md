# A Course Review REST API built with Node and Express

## To test the app
create a .env file in the root directory, and set
 ```COURSE_REVIEW_jwtPrivateKey=somestring```

## To test these authorization protected endpoints:
  POST /api/courses<br>
  PUT /api/courses/:courseId<br>
  POST /api/courses/:courseId/reviews<br>
  GET api/users/<br>

please first go to *POST /api/users* to create a new user, send a json request with format like:
```
{
  "fullName": "Steve Roger",
  "email": "caption@gmail.com",
  "password": "12345"
}
```
then in the response header there is a `x-auth-token` property. Copy the value and set `x-auth-token` in the request header with that value to gain authorization.


