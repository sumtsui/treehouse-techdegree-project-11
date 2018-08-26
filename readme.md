todo:
  1. put password encrypt into the pre method in user model
  2. An "authenticate" static method on the user schema compares a password to the hashed password stored on a user document instance
  3. An express middleware function authenticates any routes using the “authenticate” static method on the user schema
    The following routes use middleware to implement authentication:
    POST /api/courses
    PUT /api/courses/:courseId
    POST /api/courses/:courseId/reviews
  4. GET /api/users 200 - Returns the currently authenticated user