import React from "react";
import { useState, useEffect } from "react";
import { FilmCard } from "../cards/FilmCard";
// import APIManager from "~/src/modules/APIManager";
import { APIManager } from "../../modules/APIManager";
import "./FilmFeed.css";

export const FilmFeed = ({ filmList, header }) => {
    // const [mainFilmList, setMainFilmList] = useState([]);
    // const [filter, setfilter] = useState("popular");

    // const API = new APIManager();
    // useEffect(() => {
    //     API.getPopular().then((res) => setMainFilmList(res.results));
    // }, []);

    return (
        <>
            <hr />
            <div className="FilmFeed">
                <h3 className="FilmFeed__header">{header}</h3>
                <div className="FilmFeed__feed">
                    {filmList?.length > 0 ? (
                        filmList.map((film) => (
                            <FilmCard key={film.id} film={film} expand />
                        ))
                    ) : (
                        <></>
                    )}
                </div>
            </div>
            {/* <hr /> */}
        </>
    );
};
