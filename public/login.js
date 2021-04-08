function login(){
    const e_input = document.getElementById('email');
    const p_input = document.getElementById('password');

    if(!e_input.value){
        alert('이메일 입력');
        return;
    }
    if(!p_input.value){
        alert('패스워드 입력');
        return;
    }
    
    const form = document.getElementById('login');
    form.submit();
}

function register(){
    const form = document.getElementById('register');
    form.submit();
}