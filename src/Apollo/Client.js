import ApolloClient from "apollo-boost";
import { defaults, resolvers } from "./LocalState";

export default new ApolloClient({
  uri: "http://localhost:4000",
  clientState: {
    defaults,
    resolvers
  },
  // 토큰이 있을 때 토큰을 request해주는 것 
  headers: {
                            //캐시에 저장된 토큰이란는 이름의 값 전달
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
});