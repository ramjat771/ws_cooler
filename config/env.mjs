import dotenv from 'dotenv';
dotenv.config();
 const PORT=process.env.PORT
  const MONGO_URI=process.env.MONGO_URI
  const CLOUD_NAME=process.env.CLOUD_NAME;
  const CLOUD_API_KEY=process.env.CLOUD_API_KEY;
  const CLOUD_API_SECRATE=process.env.CLOUD_API_SECRATE; 
 export {PORT,MONGO_URI,CLOUD_NAME,CLOUD_API_KEY,CLOUD_API_SECRATE};
