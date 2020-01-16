import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import useInput from "../../Hooks/useInput";
import PostPresenter from "./PostPresenter";
import { useMutation, useQuery } from "react-apollo-hooks";
import { TOGGLE_LIKE, ADD_COMMENT } from "./PostQueries";
import { toast } from "react-toastify";
import { ME } from "../../SharedQueries";

const PostContainer = ({
  id,
  user,
  files,
  likeCount,
  isLiked,
  comments,
  createdAt,
  caption,
  location,
}) => {

  const [isLikedS, setIsLiked] = useState(isLiked);
  const [likeCountS, setLikeCount] = useState(likeCount);

  //현재 사진의 위치를 알기 위해 
  const [currentItem, setCurrentItem] = useState(0);
  // comment 입력 받기위함
  const comment = useInput("");

  const {data: meQuery} = useQuery(ME);

  const [selfComments, setSelfComments] = useState([]);

  const [toggleLikeMutation] = useMutation(TOGGLE_LIKE, {variables:{postId:id}});
  
  const [addCommentMutation] = useMutation(ADD_COMMENT,{
    variables:{postId:id, text:comment.value}
  });
  
  //사진 슬라이더
  const slide = () => {
    // 사진 올린 개수 
    const totalFiles = files.length;
    // 사진 끝이라면
    if (currentItem === totalFiles - 1) {
      //맨처음으로 돌아감
      setTimeout(() => setCurrentItem(0), 3000);
    } else {
      //한장씩 넘김
      setTimeout(() => setCurrentItem(currentItem + 1), 3000);
    }
  };
  useEffect(() => {
    slide();
    //currentItem이 변경될 때 마다 호출
  }, [currentItem]);

  const toggleLike = async () =>{

    if(isLikedS === true){
      setIsLiked(false);
      setLikeCount(likeCountS - 1);
    }
    else {
      setIsLiked(true);
      setLikeCount(likeCountS + 1);
    }
    try{

     await toggleLikeMutation();

    }
    catch(e){
      console.log(e);
      setIsLiked(!isLikedS);
      toast.error("에러");
    }
  }

  const onKeyUp = async (event) => {
    
    const { which } = event;
    if (which === 13) {
      event.preventDefault();
      try {
        const {
          data: { addComment }
        } = await addCommentMutation();
        //기존 댓글 + 추가 댓글을 즉각적으로 보여주기 위해 추가
        setSelfComments([...selfComments, addComment]);
        comment.setValue("");
      } catch {
        toast.error("Cant send comment");
      }
    }
  };

  return (
    <PostPresenter
      user={user}
      files={files}
      likeCount={likeCountS}
      location={location}
      caption={caption}
      isLiked={isLikedS}
      comments={comments}
      createdAt={createdAt}
      newComment={comment}
      setIsLiked={setIsLiked}
      setLikeCount={setLikeCount}
      currentItem={currentItem}
      toggleLike={toggleLike}
      onKeyUp={onKeyUp}
      selfComments={selfComments}
      
    />
  );
};

PostContainer.propTypes = {
  id: PropTypes.string.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    username: PropTypes.string.isRequired
  }).isRequired,
  files: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    })
  ).isRequired,
  likeCount: PropTypes.number.isRequired,
  isLiked: PropTypes.bool.isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired
      }).isRequired
    })
  ).isRequired,
  caption: PropTypes.string.isRequired,
  location: PropTypes.string,
  createdAt: PropTypes.string.isRequired
};

export default PostContainer;