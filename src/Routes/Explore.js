import React from "react";
import {gql} from "apollo-boost";
import { useQuery } from "react-apollo-hooks";

const ALL_USER = gql`
{
    allUsers {
      id
      avatar
      username
      email
      isFollowing
      isSelf
      posts {
          id
          location
          caption
          files {
              id
              url
          }
          likeCount
          commentCount
      }
    }
}`;

export default () => {

    const {data} = useQuery(ALL_USER);

    console.log(data);

    return null;

}