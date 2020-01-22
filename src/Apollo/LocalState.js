export const defaults = {
    //resolvers에서 저장된 토큰에 따라 값 변경
    isLoggedIn: localStorage.getItem("token") !== null ? true : false
  };
  
  export const resolvers = {
    Mutation: {
      logUserIn: (_, { token }, { cache }) => {
          //토큰 설정
        localStorage.setItem("token", token);
        //캐쉬에 기록
        cache.writeData({
          data: {
            isLoggedIn: true
          }
        });
        return null;
      },
      logUserOut: (_, __, { cache }) => {
          //토큰 지우기
        localStorage.removeItem("token");
        //로그아웃 시 reload가 아닌 /.로 이동
        window.location= "/";
        return null;
      }
    }
  };