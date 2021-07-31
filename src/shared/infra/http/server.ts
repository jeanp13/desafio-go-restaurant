import app from './app';

import '../typeorm';

app.listen(33335, () => {
  console.log('🚀 Server started on port 3333!');
});
