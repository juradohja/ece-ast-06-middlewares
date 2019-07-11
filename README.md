### ECE Paris | Asynchronous Server Technologies

# Transpilation (Part 1)

This is part 1 of the third of a series of exercises done in the Asynchronous Server Technologies course 
at ECE Paris, summer 2019. Continuing the development left at [ece-ast-02-dependency-management-express]('https://github.com/juradohja/ece-ast-02-dependency-management-express'),
now we apply the use of transpilation to enhance code quality and readability, as well as to accelerate
programming. This exercise uses TypeScript to transpile `.ts` files to `.js` files. To do so, the EJS and now
TypeScript files were put into a `/src` folder, a `tsconfig.json` file was added,
 and the TypeScript module was included in the dependencies.
This implementation also uses nodemon.

## Build

To build, simply execute `npm run build`.

## Run

To run, simply execute `npm run start` and navigate to `localhost:8083/hello`. You may insert `name`
 as a query parameter with any value to display it on the page. You may change the port at
`index.js`.

##### by: José Alberto Jurado and @inci90

