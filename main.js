// 서버
// 패키지 연결

const { response } = require('express');
const express = require('express');
const session = require('express-session');
const {Firestore} = require('@google-cloud/firestore');
const {FirestoreStore} = require('@google-cloud/connect-firestore');

//Express 사용
const app = express();

// /Express 사용 기본 설정
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// 패이지를 렌더링 하기위한 설정
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname+'/public');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// 세션 설정
app.use(session({
  store: new FirestoreStore({
    dataset: new Firestore({
      projectId:'noteapp002',
      keyFilename:'./servicekey.json',
    }),
    kind: 'express-sessions',
  }),
  secret:'secret-key',
  resave: false,
  saveUninitialized: true,
}));

// 데이터베이스 초기화
const db = new Firestore({
  projectId:'noteapp002',
  keyFilename:'./servicekey.json',
}).collection('users');

// 엔드포인트 (주소+경로)
// 메인페이지 접속
app.get('/', async (request, response) => {
  if(!request.session.account){
    response.redirect('/login');
    return;
  }

  const {uid} = request.session.account;

  const memo_list = await db.doc(uid).collection('memos').orderBy('date', 'desc').get();

  const memos = [];

  memo_list.forEach((memo)=>{
    const memo_data =  memo.data();
    memo_data.id = memo.id;
    /**
     * {content:'memo1', id='~~~~}
     */
    memos.push(memo_data);
  });

  response.render('main.html', {memos});
});

//작성요청을 위한 엔드포인트
app.post('/',async (req, res)=>{
  if(!req.session.account){
    res.redirect('/login');
    return;
  }

const {uid} =req.session.account;

  const memo_data = req.body.content;
  let now = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  // console.log("now : ", now);
  await db.doc(uid).collection('memos').add({
    content: memo_data,
    date: now,
  });

  res.redirect('/');
});

//수정 페이지에 접속

app.get('/edit', async (req, res)=>{
  if(!req.session.account){
    res.redirect('login');
    return;
  }

  const id = req.query.id; //{id:'~~~'}

  // id가 없을 경우
  if(!id){
    res.send('아이디를 적어야 합니다.');
    return;
  }
  
  const {uid} = req.session.account;

  const doc = await db.doc(uid).collection('memos').doc(id).get();

  // 이 문서가 없을 경우
  if(!doc.exists){
    res.send('메모가 없습니다.');
    return;
  }

  //아래것과 똑같음 const content = doc.data().content;//{content:'~~~'}
  const {content} = doc.data();

  res.render('edit.html', {content});
});

// 메모 수정하기
app.post('/edit',async (req, res)=>{
  if(!req.session.account){
    res.redirect('login');
    return;
  }
  //1.content
  const {content} = req.body;
  //2. 주소
  const {id} = req.query;

  const {uid} = req.session.account;

  await db.doc(uid).collection('memos').doc(id).update({
    content : content,//content만 써도 알아서 들어가긴함
  });

  res.redirect('/');
});

// 메모 삭제하기
app.post('/delete', async(req, res)=>{
  if(!req.session.account){
    res.redirect('login');
    return;
  }

  const {id} = req.query;

  const {uid} = req.session.account;

  await db.doc(uid).collection('memos').doc(id).delete();

  res.redirect('/');
});

// 로그인 페이지 접속
app.get('/login', (req, res)=>{
  if(req.session.account){
    //이미 로그인 된 상태
    res.redirect('/');
    return;
  }
  res.render('login.html');
});

// 로그인 요청
app.post('/login', async (req, res)=>{
  //세션, 토큰 -> 세션 방식
  if(req.session.account){
    //이미 로그인 된 상태
    res.redirect('/');
    return;
  }

  const {email, password} = req.body;
  
  const user_doc = await db.where('id', '==', email).get();
  if(user_doc.empty){
    res.send('없는 아이디(이메일)이다.');
    return;
  }
  const user_data = user_doc.docs[0].data();
  const user_id = user_doc.docs[0].id;

  if(user_data.password !== password){
    res.send('비밀번호가 잘못됨');
    return;
  }

  req.session.account = {
    email,
    uid : user_id,
  };

  console.log("로그인")

  res.redirect('/');
});

// 로그아웃
app.post('/logout',(req, res)=>{
  if(!req.session.account){
    res.redirect('/login');
    return;
  }

  delete req.session.account;
  
  res.redirect('/login');
});

// 회원가입 페이지 접속
app.get('/register', (req, res)=>{
  if(req.session.account){
    //이미 로그인 된 상태
    res.redirect('/');
    return;
  }
  res.render('register.html');
});

// 회원가입
app.post('/register', async(req, res)=>{
  if(req.session.account){
    //이미 로그인 된 상태
    res.redirect('/');
    return;
  }
  const email = req.body.email;
  const password = req.body.password;
  // const {email, password} = req.body;

  const user = await db.where('id', '==', email).get();

  if(!user.empty){
    res.send('이미 가입된 이메일(아이디)이다.');
    return;
  }

  const {id} = await db.add({
    id: email,
    password: password,
  });

  //세션을 등록
  req.session.account = {
    email,
    uid: id,
  } //{account : {email:'~~' uid'~~'}}

  res.redirect('/');
});

app.all('*', (req, res) =>{
  res.status(404).send("none page");
});

//서버 열기
app.listen(8080);