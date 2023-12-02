import express from 'express';
import { specs } from './config/swagger.config.js';
import SwaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import { response } from './config/response.js';
import cors from 'cors';

import { BaseError } from './config/error.js';
import { status } from './config/response.status.js';

import { userRouter } from './src/routes/user.route.js';

dotenv.config();

const app = express();

// 서버 설정 - 뷰, 정적 파일, body-parser 등
app.set('port', process.env.PORT || 8001);
app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Swagger 설정
app.use('/api-docs', SwaggerUi.serve, SwaggerUi.setup(specs));

// 라우터 설정
app.use('/user', userRouter);

// 홈 페이지에 대한 라우트
app.get('/', (req, res) => {
  res.send('Hello, this is the home page!');
});

// about 페이지에 대한 라우트
app.get('/about', (req, res) => {
  res.send('This is the about page!');
});

// 에러 처리 미들웨어
app.use((req, res, next) => {
  const err = new BaseError(status.NOT_FOUND);
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.data.status || status.INTERNAL_SERVER_ERROR).send(response(err.data));
});

// 서버 시작
app.listen(app.get('port'), () => {
  console.log(`Example app listening on port ${app.get('port')}`);
});