import express from 'express';
const app = express();
import cors from 'cors';
import messageRouteHandler from './routes/message.routes';

app.use(cors());

app.use('/message', messageRouteHandler);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
 