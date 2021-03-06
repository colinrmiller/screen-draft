import React from "react";
import { APIManager } from "../../modules/APIManager";
import { CommentAPIManager } from "../../modules/CommentAPIManager";
import { useState, useEffect } from "react";
import { dateConversion } from "../utilities/dateConversion";
import "./Cards.css";

import { CommentCardBody } from "./CommentCardBody";
import { CommentCardEdit } from "./CommentCardEdit";
import { UserCard } from "./UserCard";
import { Button } from "@mui/material";

export const CommentCard = ({ comment, handleDelete }) => {
    const API = new APIManager();
    const CommentAPI = new CommentAPIManager();

    const currentUser = parseInt(sessionStorage.getItem("active_user"));

    const [commentUser, setCommentUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [tagList, setTagList] = useState([]);

    const [activeComment, setActiveComment] = useState({ ...comment });

    useEffect(() => {
        API.getUser(comment.userId).then((user) => {
            setCommentUser(user);
        });
        getCommentTagList();
    }, []);

    const getCommentTagList = () => {
        CommentAPI.getCommentTags(comment.id).then((tags) => {
            const tagList = tags.map((tag) => tag.tag);
            setTagList(tagList);
        });
    };

    const handleSubmitEdit = (comment) => {
        setActiveComment(comment);
        CommentAPI.editComment(comment);
        getCommentTagList();
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    return (
        <div className="commentCard">
            <div className="commentCard__header">
                <UserCard user={commentUser} />
                {/* <h5 className="commentCard__user">{commentUser.username}</h5> */}
                <p className="commentCard__date">
                    {dateConversion(comment.dateTime)}
                </p>
            </div>
            {/* {!isEditing ? () : null} */}

            {!isEditing ? (
                <CommentCardBody
                    comment={activeComment}
                    isCurrentUser={currentUser == commentUser.id}
                    setIsEditing={setIsEditing}
                    handleDelete={handleDelete}
                    tagList={tagList}
                />
            ) : (
                <CommentCardEdit
                    comment={activeComment}
                    handleSubmitEdit={handleSubmitEdit}
                    cancelEdit={handleCancelEdit}
                />
            )}

            {/* <div className="commentCard__text">{comment.text}</div>
            {commentUser.id == currentUser ? (
                <div className="commentCard__interaction">
                    <div
                        className="commentCard__button"
                        onClick={() => setIsEditing(true)}
                    >
                        Edit
                    </div>
                    <div
                        className="commentCard__button"
                        onClick={() => handleDelete(comment.id)}
                    >
                        Remove
                    </div>
                </div>
            ) : null} */}
        </div>
    );
};
