/**
 * 1. 로그아웃 - 서버랑 연동 필요
 * 2. 삭제하기
 * 3. 수정하기
 * 4. 내용 불러오기
 */

//내용 불러오기
function getMemo(){
    //어떤 메모를 불러올지
    const query = window.location.search;
    
    const memo_id = query.slice(4);
    
    const storage = window.localStorage;
    const memo_data = storage.getItem(memo_id);

    if(!memo_data){
        alert("존재하지 않는 메모입니다.");
        window.location.replace('/');
    }

    const text_element = document.getElementById('input');
    text_element.value = memo_data;
}

function editMemo(){
    if(!confirm("정말 수정하시겠습니까?")){
        return;
    }

    // const storage = window.localStorage;
    // const input_text = document.getElementById('input').value;
    const query = window.location.search;
    const memo_id = query.slice(4);

    // storage.setItem(memo_id, input_text);

    const form = document.getElementById('edit');
    form.action=`/edit?id=${memo_id}`;
    form.submit();// /edit로 요청을 보내게 된다.
    alert("수정되었습니다.");
    // window.location.href = "/";
}

function deleteMemo(){
    if(!confirm("정말 삭제하시겠습니까?")){
        return;
    }

    // const storage = window.localStorage;
    const query = window.location.search;
    const memo_id = query.slice(4);

    // storage.removeItem(memo_id);
    const form = document.getElementById('delete');
    form.action=`delete?id=${memo_id}`;
    form.submit();
    alert("삭제되었습니다.");
    // window.location.replace("/");
}

function logout(){
    if(!confirm('로그아웃 하시겠습니까?')){
        return;
    }
    const form = document.getElementById('logout');
    form.submit(); // '/' 위치로 POST 요청을 보낸다
    // alert('로그아웃 되었습니다.');
}

// getMemo();