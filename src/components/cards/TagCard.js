import React from "react";
import "./Cards.css";
import { useState, useEffect } from "react";
// import { APIManager } from "../../modules/APIManager";
import { TagAPIManager } from "../../modules/TagAPIManager";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

export const TagCard = ({ tag, filmId }) => {
    const currentUser = parseInt(sessionStorage.getItem("active_user"));
    const API = new TagAPIManager();
    const [hover, setHover] = useState(false);
    const [userRating, setUserRating] = useState("");
    const [ratedTag, setRatedTag] = useState({ ...tag });

    // const [upVoteCount, setUpvoteCount] = useState(tag.plusRatings);
    // const [downVoteCount, setDownvoteCount] = useState(tag.minusRatings);
    let upVoteCount = 0;
    let downVoteCount = 0;

    // handleUpVote =() => {

    // }
    const handleUserRating = (rating) => {
        // get any previous user rating for currentUser and tagId
        // if no previous rating create a new UserFilmRating
        // if previous, modify it with new rating
        return API.getUserFilmTag(tag.id, filmId)
            .then((userTag) => {
                if (userTag?.length > 0) {
                    const updatedTag = { ...userTag[0] };
                    switch (rating) {
                        case "plus":
                            updatedTag["rating"] = rating === "plus" ? 1 : -1;
                            return API.updateUserTag(updatedTag);
                        case "minus":
                            updatedTag["rating"] = rating === "plus" ? 1 : -1;
                            return API.updateUserTag(updatedTag);
                        case "":
                            return API.deleteUserTag(updatedTag);
                        default:
                    }
                    return API.updateUserTag(updatedTag);
                } else {
                    const newTag = {
                        filmId: filmId,
                        tagId: tag.id,
                        userId: currentUser,
                        dateTime: Date.now(),
                    };
                    newTag["rating"] = rating === "plus" ? 1 : -1;
                    return API.addUserTag(newTag);
                }
            })
            .then(() => getTagRating());
    };

    const getUserRating = () => {
        // determine if the currentUser has +/- review on the tag
        API.getUserFilmTag(tag.id, filmId).then((res) => {
            if (res) {
                if (res.length > 0) {
                    if (res[0].rating === 1) setUserRating("plus");
                    else if (res[0].rating === -1) setUserRating("minus");
                }
            }
        });
    };

    const getTagRating = () => {
        API.getUsersFilmTagTotal(filmId, tag.id).then((totalTagList) => {
            const ratedTag = { ...tag };
            ratedTag["plusRatings"] = 0;
            ratedTag["minusRatings"] = 0;
            totalTagList.forEach((userTag) => {
                ratedTag["plusRatings"] =
                    userTag.rating === 1
                        ? ratedTag["plusRatings"] + 1
                        : ratedTag["plusRatings"];
                ratedTag["minusRatings"] =
                    userTag.rating === -1
                        ? ratedTag["minusRatings"] + 1
                        : ratedTag["minusRatings"];
            });
            setRatedTag(ratedTag);
        });
    };

    const handlePlusRating = () => {
        switch (userRating) {
            case "plus":
                // setUpvoteCount(upVoteCount - 1);
                setUserRating("");
                return handleUserRating("");
            case "":
                // setUpvoteCount(upVoteCount + 1);
                setUserRating("plus");
                return handleUserRating("plus");
            case "minus":
                // setUpvoteCount(upVoteCount + 1);
                // setDownvoteCount(downVoteCount - 1);
                setUserRating("plus");
                return handleUserRating("plus");
            default:
        }
    };

    const handleMinusRating = () => {
        switch (userRating) {
            case "plus":
                // setUpvoteCount(upVoteCount - 1);
                // setDownvoteCount(downVoteCount + 1);
                setUserRating("minus");
                return handleUserRating("minus");
            case "":
                // setDownvoteCount(downVoteCount + 1);
                setUserRating("minus");
                return handleUserRating("minus");
            case "minus":
                // setDownvoteCount(downVoteCount - 1);
                setUserRating("");
                return handleUserRating("");
            default:
        }
    };

    useEffect(() => {
        getUserRating();
        getTagRating();
    }, []);

    return !hover ? (
        <div
            className={"tagCard tagCard__" + tag.type}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div className="tagCard__text">{tag.name}</div>
            <div className="tagCard__subText">
                <div>{tag.type}</div>
                <div
                    className={
                        ratedTag.plusRatings - ratedTag.minusRatings > 0
                            ? "subText--plus"
                            : "subText--minus"
                    }
                >
                    {ratedTag.plusRatings - ratedTag.minusRatings}
                </div>
            </div>
        </div>
    ) : (
        <div
            className={"tagCard tagCard__reveal tagCard__" + tag.type}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div className="tagCard__text">{tag.name}</div>
            <div className="tagCard__subText">
                <div>{tag.type}</div>
                <div>{ratedTag.plusRatings - ratedTag.minusRatings}</div>
            </div>
            <div className="tagCard__dropdown">
                {" "}
                <div
                    className={
                        userRating === "plus"
                            ? "tagCard__minus voteActive--plus"
                            : "tagCard__minus"
                    }
                    onClick={() => {
                        handlePlusRating().then(getUserRating);
                    }}
                >
                    <ArrowUpwardIcon /> {ratedTag.plusRatings}
                </div>
                <div
                    className={
                        userRating === "minus"
                            ? "tagCard__minus voteActive--minus"
                            : "tagCard__minus"
                    }
                    onClick={() => {
                        handleMinusRating().then(getUserRating);
                    }}
                >
                    <ArrowDownwardIcon /> {ratedTag.minusRatings}
                </div>
                {/* <div className={"tagCard__dropdown tagCard__" + tag.tag.type}> */}
            </div>
        </div>
    );
};
