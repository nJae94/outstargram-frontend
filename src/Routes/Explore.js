import React from "react";
import {gql} from "apollo-boost";
import { useQuery } from "react-apollo-hooks";
import styled from "styled-components";
import Loader from "../Components/Loader";
import FollowButton from "../Components/FollowButton";
import { Link } from "react-router-dom";
import { HeartFull } from "../Components/Icons";

const Wrapper = styled.div`
  min-height: 100vh;
  margin-left: 15px;
`;

const Title = styled.div`
    color: ${props => props.theme.lightGreyColor};
    margin-bottom: 40px;
`;

const Followdiv = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 200px);
    grid-template-rows: 200px;
    grid-auto-rows: 200px;
    grid-gap:30px;
    margin-left:15px;
`;

const Container = styled.div`
    ${props => props.theme.whiteBox};
    width: 100%;
    max-width: 600px;
    margin-bottom: 25px;
    text-align: center;
`;

const ContainerColumn = styled.div`
    margin-bottom:20px;
    text-align: center;
`;
const Avatar = styled.div`
    cursor: pointer;
    display: inline-block;
    width:50px;
    height:50px;
    background-image:url(${props => props.url});
    background-size:cover;
    border-radius:50%;
    margin-top:10px;
`;

const Username = styled.span`
    font-size: 16px;
    cursor: pointer;
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    color: black;
`;

const ButtonDiv = styled.div`
    display: inline-block;
    width:70px;
    height:30px;
    padding: 9px 5px;
`;

const Overlay = styled.div`
  background-color: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s linear;
  svg {
    fill: white;
  }
`;

const Posts = styled.div`

  display: grid;
  grid-template-columns: repeat(3, 237px);
  grid-template-rows: repeat(3, 237px);
  grid-gap:30px;
`;

const Post = styled.div`
  
  background-image: url(${props => props.src});
  background-size: 100% 100%
  cursor: pointer;
  &:hover {
    ${Overlay} {
      opacity: 1;
    }
  }
`;
const Number = styled.div`
  color: white;
  display: flex;
  align-items: center;
  &:first-child {
    margin-right: 30px;
  }
`;

const NumberText = styled.span`
  margin-left: 10px;
  font-size: 16px;
`;

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

    const {data, loading} = useQuery(ALL_USER);
    
    if (loading === true) {
        return (
          <Wrapper>
            <Loader />
          </Wrapper>
        );
      } else if (!loading && data && data.allUsers) {
        

        const { allUsers } = data;
        let posts = [];
        let counts = [];
        for(let i in allUsers)
        {
            for(let j in allUsers[i].posts)
            {
                for(let k in allUsers[i].posts[j].files)
                { 
                    const {likeCount} = allUsers[i].posts[j];
                    const target = {likeCount: likeCount};
                    
                    allUsers[i].posts[j].files[k] = Object.assign(target,allUsers[i].posts[j].files[k]);

                    posts.push(allUsers[i].posts[j].files[k]);
                }
            }
        }
      // console.log(posts);
        return (
            <Wrapper>
                <Title>팔로우할 만한 계정 둘러보기</Title>
                <Followdiv>
                   {data.allUsers.map(user => (
                        <Container>
                            <ContainerColumn>
                                <Link to = {`/${user.username}`} >
                                    <Avatar size="sm" url={user.avatar} />
                                </Link>
                            </ContainerColumn>
                            <ContainerColumn>
                                <StyledLink to = {`/${user.username}`} >
                                     {user.username}
                                </StyledLink>
                            </ContainerColumn>
                            <ContainerColumn>
                                <ButtonDiv>
                            
                                 {user.isSelf ? null : <FollowButton isFollowing={user.isFollowing} id={user.id} />}
                                 </ButtonDiv>
                            </ContainerColumn>
                        </Container>
                   ) )}
                </Followdiv>
                <Title>탐색 탭</Title>
                <Posts>
                    {posts && posts.map((post) => (
                        <Post src={post.url} >
                            <Overlay>
                            <Number>
                                <HeartFull />
                                <NumberText>{post.likeCount}</NumberText>
                            </Number>
                            </Overlay>
                        </Post>

                    ))}
                </Posts>
            </Wrapper>
        )
        
      }
}