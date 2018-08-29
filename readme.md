# A Course Review REST API built with Node and Express

## To test the app
create a .env file in the root directory, and set
 ```COURSE_REVIEW_jwtPrivateKey=somestring```

## To test these authorization protected endpoints:
  POST /api/courses
  PUT /api/courses/:courseId
  POST /api/courses/:courseId/reviews
  GET api/users/

please first go to POST /api/users to create a new user, and acquire `x-auth-token` from the response header.
And set `x-auth-token` in the request header to gain authorization.


