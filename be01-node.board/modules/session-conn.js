
// 실제 서비스 시 세션 값을 메모리가 아닌 저장소에 저장 (새로고침해도 세션 정보 날아가지 않도록)

const expressSession = require('express-session');
const MySQLStore = require('express-mysql-session')(expressSession);

const options = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
};
 
const sessionStore = new MySQLStore(options); // 저장소

const session = expressSession({
  key: 'bokyung-cookie',
  store: sessionStore,
  secret: process.env.SESSION_SALT,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, path: '/', httpOnly: true } // https 인증을 아직 못받았기 때문에 false를 줌
});

module.exports = session;