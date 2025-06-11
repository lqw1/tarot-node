const app = require('./app');

const PORT = process.env.PORT || 3007;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 