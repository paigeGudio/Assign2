var express = require('express'); // Import the express module
const bodyParser = require('body-parser');
var path = require('path'); // Import the path module
var app = express(); // Create an instance of the express application
//const exphbs = require('express-handlebars'); // Require the express-handlebars module
const exphbs = require('express-handlebars').create({ extname: '.hbs' });; // Create an instance of express-handlebars with a custom configuration
const port = process.env.PORT || 3000; // Set the port number from an environment variable or default to 3000
const fs = require('fs')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the 'public' directory
app.engine('.hbs', exphbs.engine); // Set the handlebars engine for rendering templates
//app.engine('.hbs', exphbs({ extname: '.hbs' })); // Alternate way to set the handlebars engine
app.set('view engine', '.hbs'); // Set the default view engine to use for rendering templates
app.get('/', function(req, res) { // Define a route handler for the root path
  res.render('index', { title: 'Express' }); // Render the 'index' template with a context object containing the title
});
app.get('/users', function(req, res) { // Define a route handler for the '/users' path
  res.send('respond with a resource'); // Send a simple response
});

app.get('/data', (req, res) => {
    
  const filePath = 'datasetB.json';
  const fileStream = fs.createReadStream(filePath, 'utf-8');

  let data = ''; // To accumulate the data

  fileStream.on('data', (chunk) => {
    data += chunk;
  });

  fileStream.on('end', () => {
    // Parse the accumulated data as JSON
    const jsonData = JSON.parse(data);

    // Log the parsed JSON to the console
    console.log(jsonData);

    res.render('data', { title: 'Data', message:'data loaded to the console' }); 
    //res.send('data loaded to the console');
  });

  fileStream.on('error', (err) => {
    console.error('Error reading file:', err);
    res.status(500).send('Internal Server Error');
  });
});

app.get('/product/:index', (req, res) => {
      fs.readFile('datasetB.json', function (err, data) {
          const index = req.params.index;
          const records = JSON.parse(data);

          if (index >= 0 && index < records.length ) {
            res.render('data', { title: 'Data', message: records[index].asin }); 
           //res.send(records[index].asin);
            return;
          }
              res.send('No record to Display');
      });
  
  console.log('done');
})

app.get('/data/search/prdID', function (req, res) {
    res.render('dataSearch', {
        layout: 'main.hbs' // do not use the default Layout (main.hbs) 
    });
  /**res.send(`<form method="POST" action="/searchProduct">
<input type="text" name="productId" placeholder="Enter Product Id">
<input type="submit">
</form>`);*/
});

app.post('/searchProduct', function (req, res) {
  const search = req.body && req.body.productId;

  if (!search) {
      res.status(400).send('Bad Request: ProductId is missing in the request.');
      return;
  }

  fs.readFile('datasetB.json', function (err, data) {
      if (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
          return;
      }

      //const records = JSON.parse(data);

      //if (search >= 0 && search < records.length) {
          //res.send(JSON.stringify(records[search]));
      //    res.render('data', { title: 'Data', message: JSON.stringify(records[search]) }); 
      //    return;
      //}
      const records = JSON.parse(data);

     
      if (search >= 0 && search < records.length) {
          res.render('dataResult', {
              title: 'Data Result',
              data: records[search],
              layout: 'main'
          });
          console.log(records[search]);
          return;
      }


      res.send('No record to Display');
  });
});

app.get('/data/search/prdName', function (req, res) {
  /**res.send(`<form method="POST" action="/searchProductName">
<input type="text" name="prdName" placeholder="Enter Product Name">
<input type="submit">
</form>`);*/
  res.render('dataSearchName', {
    layout: 'main.hbs' // do not use the default Layout (main.hbs) 
  });
});

app.post('/searchProductName', function (req, res) {
  const search = req.body && req.body.prdName;

  if (!search) {
      res.status(400).send('Bad Request: ProductName is missing in the request.');
      return;
  }

  fs.readFile('datasetB.json', function (err, data) {
      if (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
          return;
      }

      const records = JSON.parse(data);

      const matchingProducts = records.filter(product => product.title.toLowerCase().includes(search.toLowerCase()));

      //res.send(JSON.stringify(matchingProducts));
      if (matchingProducts.length > 0) {
          const result = matchingProducts.map(product => {
              return {
                  title: product.title,
                  asin: product.asin,
                  category: product.categoryName,
                  actual_price: product.price,
                  rating: product.stars
              };
          });
          res.render('dataResultName', {
            title: 'Data Result',
            data: result,
            layout: 'main'
        });
          console.log(result);
      } else {
          res.send('No matching products found');
      }
  });
});

app.get('/allData', function (req, res) {
  
  fs.readFile('datasetB.json', function (err, data) {
      if (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
          return;
      }
    const records = JSON.parse(data);
          res.render('dataResultAllData', {
              title: 'Data Result',
              data: records,
              layout: 'main'
          });
          console.log(records);
          return;


      res.send('No record to Display');
  });
});

app.get('/allDataZero', function (req, res) {
  
  fs.readFile('datasetB.json', function (err, data) {
      if (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
          return;
      }
    const records = JSON.parse(data);
          res.render('dataResultAllDataZero', {
              title: 'Data Result',
              data: records,
              layout: 'main'
          });
          console.log(records);
          return;


      res.send('No record to Display');
  });
});

app.get('/allDataZeroNA', function (req, res) {
  
  fs.readFile('datasetB.json', function (err, data) {
      if (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
          return;
      }
    const records = JSON.parse(data);
          res.render('dataResultAllDataZeroNA', {
              title: 'Data Result',
              data: records,
              layout: 'main'
          });
          console.log(records);
          return;


      res.send('No record to Display');
  });
});

app.get('/allDataColor', function (req, res) {
  
  fs.readFile('datasetB.json', function (err, data) {
      if (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
          return;
      }
    const records = JSON.parse(data);
          res.render('dataResultAllDataColor', {
              title: 'Data Result',
              data: records,
              layout: 'main'
          });
          console.log(records);
          return;


      res.send('No record to Display');
  });
});

app.get('*', function(req, res) { // Define a route handler for all other paths
  res.render('error', { title: 'Error', message:'Wrong Route' }); // Render the 'error' template with a context object containing the title and message
});
app.listen(port, () => { // Start the express application and listen for incoming requests on the specified port
  console.log(`Example app listening at http://localhost:${port}`); // Log a message to the console indicating that the server is running
});
