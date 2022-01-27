import React, {useEffect, useState } from "react";
import axios from "axios";
import "@nylas/components-composer";
import "@nylas/components-mailbox";
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import CircularProgress from '@mui/material/CircularProgress';

//Removing line 11 results in an error "Variable Buffer undefined - no undefineds"
global.Buffer = global.Buffer || require('buffer/').Buffer;
const Nylas = require('nylas');  

Nylas.config({
    clientId: '7lgbae43g6ina7od8cub3jysn', 
    clientSecret: 'iv9y66e3u58l3t2crzdrh55c'
});
const nylas = Nylas.with('GXGwYxuJX7V2VnWNyrsmRdMXPqNIh2');

// "Label" is not defined no-undef
// const label = new Label(nylas) 

export default () => {
    const [allMessages, setAllMessages] = useState("loading");
    const [search, setSearch] = useState({
        query: "",
        add: "", 
        change: ""
    });
    const [addSuccess, setAddSuccess] = useState(false);
    const [messageHeader, setMessageHeader] = useState("All");
    const [focusEmail, setFocusEmail] = useState({
        name: "", 
        id: "",
        labels: []
    });
    const [focusLabel, setFocusLabel] = useState("");
    const [allLabels, setAllLabels] = useState([]);
    const [labelSelect, setLabelSelect] = useState("");
    const [update, setUpdate] = useState(false);

    

function fetchNylasMessages(method="get", endpoint="messages", dataOptions=null){
    axios({
        method: method,
        url: `https://api.nylas.com/${endpoint}`,
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer GXGwYxuJX7V2VnWNyrsmRdMXPqNIh2',
            'Content-Type': 'application/json'
        },
        data: dataOptions
    }) 
        .then(
            res => setAllMessages(res.data) 
        )
        .catch(err=>(console.log(err)));
    }

function putToNylas(method="put", endpoint="messages", dataOptions=null){
    axios({
        method: method,
        url: `https://api.nylas.com/${endpoint}`,
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer GXGwYxuJX7V2VnWNyrsmRdMXPqNIh2',
            'Content-Type': 'application/json'
        },
        data: dataOptions
    }) 
        .then(
            res => console.log(res)
        )
        .catch(err=>(console.log(err)));
    }

    useEffect(()=>{
        // =======================
        // Get All Messages
        // =======================

        fetchNylasMessages();
        
        // =======================
        // Get All Labels
        // =======================
        
        axios({
            method: 'get',
            url: 'https://api.nylas.com/labels',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer GXGwYxuJX7V2VnWNyrsmRdMXPqNIh2',
                'Content-Type': 'application/json'
            }
        }) 
            .then(
                res => {
                    console.log(res);
                    setAllLabels(res.data);

                }
            )
            .catch(err=>(console.log(err)));

        // /\/\/\/\/\/\/\/\//\/\/\/\/\/\/\/\
        // this throws an error  << url_1.URL is not a constructor >> nylas-connection.js: 74.
        // /\/\/\/\/\/\/\/\//\/\/\/\/\/\/\/\
        try{
            nylas.messages.first({in: 'inbox'}).then(message =>{
                console.log(message.subject);
                // Log the Nylas global ID for the message
                console.log(message.id);
                // Log the service provider ID of the message
                console.log(message.unread);
            });
        }
        catch (error){console.log(error)}
    }, [update]) 
    //--------------------------
    // --- End UseEffect ---
    //--------------------------

    const exposeMsgsByLabel = (label) => {
        setAllMessages("loading")
        console.log("Search clicked");
        fetchNylasMessages("get", `messages?in=${label}`);
        setMessageHeader(label);
    }

    const sendEmail = () => {
        axios({
            method : "POST",
            url : `https://api.nylas.com/send`,
            headers : {
                'Accept': 'application/json',
                'Authorization': 'Bearer GXGwYxuJX7V2VnWNyrsmRdMXPqNIh2',
                'Content-Type': 'application/json'
            },
            data: {
                "subject": "From NylasAPI",
                "to": [
                    {
                        "email": "dkearns11@gmail.com",
                        "name": "Nylas"
                    }
                ],
                "from": [
                    {
                        "email": "dkearns11@gmail.com",
                        "name": "Devin"
                    }
                ],
                "reply_to": [
                    {
                        "name": "Devin",
                        "email": "dkearns11@gmail.com"
                    }
                ],
                "reply_to_message_id": null,
                "body": "This email was sent using the Nylas email API. Visit https://nylas.com for details."
            }
        }) 
            .then(
                res => console.log(res) 
            )
            .catch(err=>(console.log(err)));
    }

    const addLabel = (labelSelect, input ) => {
        console.log("label select", labelSelect);
        console.log("input", input)
        if(labelSelect.length > 0){
            putToNylas("put", `messages/${focusEmail.id}`, {label_ids: [labelSelect]});
        }
        else{
            putToNylas("post", `labels/`, {"display_name" : input, "name" : input})
        }
        setAddSuccess(!addSuccess);
        setSearch({...search, add: ""});
        setUpdate(!update);
        setInterval(()=>setAddSuccess(false), 5000)
    }

    const changeLabel = (labelSelect, input) => {
        putToNylas("put", `labels/${labelSelect}`, {"display_name": input});
        setUpdate(!update);
    } 

    function onChangeHandler(e){
        let name = e.target.name;
        setSearch({...search, [name] : e.target.value});
    }

    function handleSelect(e){
        let name = e.target.name;
        console.log(name);
        const value = e.target.value;
        if(name == "focusLabel"){
            setFocusLabel(value);
        }
        if(name == "allLabels"){
            console.log("we tried here");
            setLabelSelect(value); 
        }
    }

    // ••••••••••••••••••••••••••
    // Render
    // ••••••••••••••••••••••••••


    return (
        <Container className="w-80 h-50"> 
            <Row className="mt-2">
                <Col sm={4}>
                    <nylas-composer id="27e7867a-cf9f-4c41-aa3f-539c4e5a52ca" > </nylas-composer>
                </Col> 
                <Col sm={8}>
                    <nylas-mailbox  id="8f1d4639-85bf-4e00-ae35-e527d5f08322"> </nylas-mailbox>
                </Col>
            </Row>
            <button onClick={sendEmail} className="btn btn-info">Quick Send</button>
            {/* =================================== */}
            {/* =======  Email / Label Focus ====== */}
            {/* =================================== */}
            <div className="mt-5">
                <h2>Email: <span style={{color:"blue"}}> {focusEmail.name} | {focusEmail.id} </span> </h2>
            </div>

            <div className="d-flex w-50 m-auto justify-content-around">
                <div>
                    <label>Current Labels:  </label>
                    <select onChange={handleSelect} name="focusLabel">
                        {focusEmail.labels.map(label => <option value={label.id}>{label.display_name}</option>
                        )}
                    </select>
                </div>
                <div>
                    <label>Select Label:  </label>
                    <select onChange={handleSelect} name="allLabels" defaultValue="">
                        <option value="">Select Label </option>
                        {allLabels.map(label => <option value={label.id}>{label.display_name}</option>
                        )}
                    </select>
                </div>
            </div>

            {/* =================================== */}
            {/* =======  Label Controls  ========= */}
            {/* =================================== */}

            <div className="mt-3">
                {/* Label Search */}
                <input type="text" placeholder="search" onChange={onChangeHandler} value={search.query} name="query" className="mt-2"/>
                <button onClick={()=> exposeMsgsByLabel(search.query)} class="mx-1">Search</button>
                
                {/* Label Add */}
                <input type="text" placeholder="add label" onChange={onChangeHandler} value={search.add} name="add" class="mt-2"/>
                <button onClick={()=> addLabel(labelSelect, search.add)} class="mx-1">Add</button>
                
                {/* Label Change */}
                <input type="text" placeholder="change label" onChange={onChangeHandler} value={search.change} name="change" className="mt-2"/>
                <button onClick={()=> changeLabel(labelSelect, search.change)} class="mx-1">Change</button>
            </div>

            {addSuccess && <p style={{color: "gree"}}> Label Added </p>}


            
            <Container className="mt-3"><h2>{messageHeader + " Messages"}</h2></Container>
            
            <div className="d-flex justify-content-between align-items-center">
                <h4>Message Subject</h4>
                <h4>Labels</h4>
            </div>
            
            <div className="mt-2">
                {allMessages!="loading" && allMessages.map((message) => {return(
                    <div key={[message.id, message.name]} 
                        className="d-flex justify-content-between align-items-center" 
                        style={{border: "2px solid black"}} 
                        onClick={()=>
                            setFocusEmail({
                                name: message.subject,
                                id: message.id,
                                labels: message.labels
                            })
                        }>
                        <div style={{display:"inline"}}>
                            {message.subject}
                        </div>
                        <div style={{display:"inline"}}>
                            {message.labels.length > 1
                                ? message.labels.map((label) => <span key={label.id}> {label.display_name + "; "}</span>)
                                : message.labels.map((label)=> <span key={label.id}> {label.display_name} </span>) 
                            }
                        </div>
                    </div>
                )})}
                {allMessages == "loading"? <CircularProgress />: ""}
                {allMessages.length == 0?<h4 style={{color:"red"}}>No Messages under label: {messageHeader} </h4>: ""}
            </div>
            <div style={{height: "200px"}}></div>
        </Container>
    )
}