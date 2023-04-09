import app from './app';


const APP_PORT = process.env.PORT  || "3000"

app
  .listen(APP_PORT, () => {
    console.log(`server running on port : ${APP_PORT}`);
  })
  .on('error', (e) => console.error(e));


//console.log(app._router);


app._router.stack.forEach(function(r){
  console.log(r)
  if (r.Layer && r.Layer.path){
    console.log(r.Layer.path)
  }
})