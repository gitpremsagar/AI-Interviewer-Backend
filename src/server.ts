import express from 'express';
const app = express();
import chatRouteHandler from './routes/chat.routes';

app.use('/chat', chatRouteHandler);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
 