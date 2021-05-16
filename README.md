# Pet project Example - Original

Original version of the example pet project for blog post.

Various simplifications like no check if object already existed when updating counter, lack of delete options etc.

## Issues

- Request/Response parameters
    - Almost every part of the application knows about this express-like framework.
    - Request might be mutated anywhere resulting in strange behavior
    - Response might be called anywhere - hard to trace, complicates flow of application
- `dynamoDb.js` contains a large part of the logic
    - Does too many things (building parameters, calling dynamodb, handling the resulting values)
    - File will grow bigger and individual functions will as well
    - Hard to read, hard to test, hard to reuse
- Error handling everywhere
    - In validation helpers, but also elsewhere (404s for example)
    - Throwing errors in several places
    - Mixed with returning error responses using the `response` param
    - Complicates flow of application
- (Limited) business logic is spread out over many parts of the code
- Value of classes?
    - Primarily used as data containers (plus some building of ids)
        - Which is ok for us - but why use them in the first place?
    - clone method - ok by itself, but presence points to (recognized) dangers of mutations
- Minor issues
    - Use of forEach in several locations, points to side effects (less predictable)
    - Config reads values from environment which is loaded elsewhere
        - makes testing more difficult
        - 'contaminates' rest of the code with information that is not relevant
        - ok for simply reading env variables but can turn into a mess in more complicated scenario's
