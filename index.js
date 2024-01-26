import express, { response } from "express";

import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://api.jikan.moe/v4"

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 1;

app.get("/", (req, res) => {
    res.render("index.ejs");
})

app.get("/random", async (req, res)=>{
    try{
        let response = await axios.get(API_URL+"/random/anime?rank");
        let { data: { data } } = response;
        
        res.render("index.ejs", { 
            content: data,
            imgURL: data.images.jpg.image_url,
            title: data.title,
            EP: data.episodes,
            sourceMat: data.source,
            stat: data.status,
            ranking: data.rank,
        });
    } catch (error){
        res.render("index.ejs", {error:`Failed to load: ${error.message}`});
    };
})

app.post("/anime", async (req, res) => {
    console.log(req.body);
    const { body: { animeID }} = req;
    try {
        const response = await axios.get(API_URL+`/anime/${animeID}`);
        let { data: { data } } = response;
        res.render("index.ejs", {
            content: data,
            imgURL: data.images.jpg.image_url,
            title: data.title,
            EP: data.episodes,
            sourceMat: data.source,
            stat: data.status,
            ranking: data.rank,
        });
    } catch (error) {
        res.render("index.ejs", {error:`Failed to load: ${error.message}`});
    };
})

app.post("/search", async (req, res) =>{
    console.log(req.body);
    const {body: {search: anime} } = req;
    const {body: { page: currentPage} } = req;

    try{
        const response = await axios.get(API_URL+`/anime?q=${anime}&page=${currentPage}`);
        const {data: {data} } = response;
        const {data: { pagination: { last_visible_page: pages}}} =response;
        res.render("index.ejs", {
            search: data,
            pages: pages,
            anime: anime,
            currentPage: currentPage,
        })
    } catch (error){
        res.render("index.ejs", {error:`Failed to load: ${error.message}`});
    };
})


app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
})