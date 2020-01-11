import React, { useState } from "react";
import AuthPresenter from "./AuthPresenter";
import useInput from "../../Hooks/useInput";
import { useMutation } from "react-apollo-hooks";
import { LOG_IN, CREATE_ACCOUNT } from "./AuthQueries";
import { toast } from "react-toastify";

export default () => {
  const [action, setAction] = useState("logIn");
  const username = useInput("");
  const firstName = useInput("");
  const lastName = useInput("");
  const email = useInput("example@example.com");
  const [requestSecret] = useMutation(LOG_IN, {
    update: (_, {data}) => {
        const {requestSecret} = data;
        if(!requestSecret){
            toast.error("등록된 이메일이 없습니다.");
            
            setTimeout(()=> setAction("singUp"),3000)
        }
    },
    variables: { email: email.value },
    
  });

  const [createAccount] = useMutation(CREATE_ACCOUNT, {
      variables: {
          email:email.value,
          username:username.value,
          firstName:firstName.value,
          lastName:lastName.value
      }
  })

  const onLogin = e => {
    e.preventDefault();
    if(action === "logIn") {
        if(email.value !== "") {
            requestSecret();
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
                createAccount();
            } else {
                toast.error("모든 항목을 입력해 주세요");
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
      onLogin={onLogin}
    />
  );
};