/**
* 1. 로그아웃 기능 - 서버랑 연동이 되어야 함(지금 못함)
* 2. 작성하기 기능
* 3. 과거에 작성한 걸 받아오는 기능
*
* -데이터베이스
* -파일로 저장
* -웹 저장소에 저장(V)
*
* -Web Storage API(함수, URL...)
*
* local storage(5MB) - 영구적
* session storage - 탭을 끄면 다 날아간다
*/

//작성하기
function addMemo(){
    const input_text = document.getElementById('input').value;

    //1. 빈 메모일 경우에는 안된다 말하기
    if(!input_text.length){
        alert("빈 메모입니다.");
        return;
    }

    // 요청 보내기
    const form = document.getElementById('write');
    form.submit(); // '/' 위치로 POST 요청을 보낸다
    alert('작성되었습니다.');


    // //2. 입력이 성공했을 경우, input 안에 있는 내용 비우기
    // document.getElementById('input').value = "";
    // alert("메모가 등록되었습니다.");

    // //글 요소를 만들고 자식으로 넣기
    // const note_container = document.getElementsByClassName("main__note-contents")[0];
    // // 할 일 : main__note-content div 만들고 note_container에 추가
    // const note_content = document.createElement('div');
    // note_content.className="main__note-content";
    // note_content.innerText = input_text;
    
    // const link_element = document.createElement('a');
    // link_element.href="./edit";

    // link_element.appendChild(note_content)

    // // note_container.appendChild(link_element);
    // note_container.prepend(link_element);
}

function logout(){
    if(!confirm('로그아웃 하시겠습니까?')){
        return;
    }
    const form = document.getElementById('logout');
    form.submit(); // '/' 위치로 POST 요청을 보낸다
    // alert('로그아웃 되었습니다.');
}

//storage 에 있는 글 가져오기
function getMemos(){
    const storage = window.localStorage;
    const memos = Object.entries(storage);
    const note_container = document.getElementsByClassName("main__note-contents")[0];

    memos.sort(function(a,b){
        return b[0]-a[0];
    })

    memos.forEach((memo) =>{
        const id = memo[0];
        const data = memo[1];

        const note_content = document.createElement('div');
        note_content.className="main__note-content";
        note_content.innerText = data;

        const link_element = document.createElement('a');
        link_element.href=`./edit?id=${id}`;

        link_element.appendChild(note_content)

        note_container.appendChild(link_element);
    });

}

function folderChange(){
    const selecting = document.getElementById('main__folder_select');
    if(selecting.value === 'add_folder'){
        let foldName = prompt('새로운 폴더명을 입력하세요.');
        if(selecting.options.namedItem(foldName)){
            alert('이미 존재하는 폴더입니다.');
            return;
        }
        if(!confirm(`[${foldName}] 폴더를 생성할까요?`)){
            alert('취소되었습니다.');
            return;
        }
        document.getElementById('add_folder').value = 'new' + foldName;
        alert('생성되었습니다.');
    }
    // alert(`${document.getElementById('main__folder_select').value}`);
    const form = document.getElementById('main__folder');
    form.submit();
}
// getMemos();