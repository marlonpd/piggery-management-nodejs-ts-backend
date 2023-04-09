import app from './app';


const APP_PORT = process.env.PORT  || "3000"

app
  .listen(APP_PORT, () => {
    console.log(`server running on port : ${APP_PORT}`);
  })
  .on('error', (e) => console.error(e));


