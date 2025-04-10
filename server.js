const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the root directory
app.use(express.static(__dirname));

// Serve the pages directory
app.use('/src/pages', express.static(path.join(__dirname, 'src/pages')));

// Handle all routes by serving index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Available routes:');
    console.log('- /');
    console.log('- /projects');
    console.log('- /skills');
    console.log('- /contact');
}); 