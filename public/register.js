function register(){
    const e_input = document.getElementById('email');
    const p_input = document.getElementById('password');
    const p_c_input = document.getElementById('password-check');

    if(!e_input.value){
        alert('이메일 입력');
        return;
    }
    if(!p_input.value){
        alert('비밀번호 입력');
        return;
    }
    if(!p_c_input.value){
        alert('비밀번호 확인 필요');
        return;
    }
    if(p_c_input.value!==p_input.value){
        alert('비밀번호 확인이 동일하지 않음');
        return;
    }

    const form = document.getElementById('register');
    form.submit();
}