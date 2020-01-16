// 중복되는 쿼리 저장

import {gql} from "apollo-boost"

//내 이름 가져오는 쿼리
// Header에서 가져옴
export const ME = gql`
  {
    me {
          username
    }
  }
`;