import React, { useState } from "react";
import AuthPresenter from "./AuthPresenter";
import useInput from "../../Hooks/useInput";
import { useMutation } from "react-apollo-hooks";
import { LOG_IN, CREATE_ACCOUNT,CONFIRM_SECRET, Local_LOG_IN } from "./AuthQueries";
import { toast } from "react-toastify";

export default () => {
    //useState로 상태관리 action 값은 로그인 / 회원가입 구분
  const [action, setAction] = useState("logIn");
  const username = useInput("");
  const firstName = useInput("");
  const lastName = useInput("");
  const secret = useInput("");
  // 기본값 줌
  const email = useInput("test@test.com");

  //requestSecret이라는 mutation을 사용할 수 있도록 해줌
  // useMutation (쿼리,옵션)
  const [requestSecretMutation] = useMutation(LOG_IN, {
    variables: { email: email.value },
  });

  // 회원가입 Mutation
  const [createAccountMutation] = useMutation(CREATE_ACCOUNT, {
      variables: {
          email:email.value,
          username:username.value,
          firstName:firstName.value,
          lastName:lastName.value
      }
  });

  //비밀번호 확인 이메일과 이메일로 발송되는 비밀번호
  const [confirmSecretMuattion] = useMutation(CONFIRM_SECRET, {
    variables: {
      email: email.value,
      secret: secret.value
    }
  });

  //캐쉬에 토큰 저장
  const [localLogInMutation] = useMutation(Local_LOG_IN);

  

  const onSubmit = async(e) => {
      // e의 이벤트 전파 방지
    e.preventDefault();
    // action값이 로그인이고
    if(action === "logIn") {
        // 이메일 입력값이 있다면 requestSecret 실행(비밀번호 발급)
        if(email.value !== "") {
          console.log("테스트");
            try {
             const {data : {requestSecret}} = await requestSecretMutation();
              // data값 반환 받음 (등록되있다면 t 없다면 f)

              if(!requestSecret){
                  toast.error("등록된 이메일이 없습니다.");
            
                  // 3초 뒤 회원가입 페이지로
                  setTimeout(()=> setAction("singUp"),3000)
              }
              else {
                toast.success("비밀번호 전송");
                setAction("confirm");
              }
            }
            catch
            {
              toast.error("비밀번호를 요청할 수 없습니다.")
            }
        } else {
            toast.error("이메일이 필요합니다.");
        }
    }
    else if(action === 'signUp') {
        if(email.value!=="" &&
            username.value!=="" &&
            firstName.value!=="" &&
            lastName.value!=="" 
          )
            {
              try{
                const {data:{createAccount}} = await createAccountMutation();
                if(!createAccount)
                {
                  toast.error("계정을 만들 수 없습니다.");
                }
                else
                {
                  toast.success("계정을 만들었습니다.");
                  setTimeout(()=> setAction("LogIn"),2000);
                }
              }
              catch (e){
                toast.error(e.message);
              }
              
            } else {
                toast.error("모든 항목을 입력해 주세요.");
            }
    }
    else if(action === 'confirm')
    {
      if(secret.value !=="")
      {
          try{
            //confirmSecret-> token 값
              const {data: {confirmSecret: token}} = await confirmSecretMuattion();
              console.log(token);

              if(token !== "" && token !== undefined) {
                //token 값이 return되어 생성되면 캐쉬에 저장
                localLogInMutation({variables:{token}});
              }
              else
              {
                throw Error();
              }

              
          }
          catch
          {
            toast.error("비밀번호가 맞지 않습니다.");
          }
      }
    }
  };

  return (
    <AuthPresenter
      setAction={setAction}
      action={action}
      username={username}
      firstName={firstName}
      lastName={lastName}
      email={email}
      secret={secret}
      onSubmit={onSubmit}
    />
  );
};