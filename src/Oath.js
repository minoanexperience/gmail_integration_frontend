import React, {useEffect, useState} from "react";
import {useSearchParams,useNavigate} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from "axios";
import {Table} from "antd";
import './styles.scss'
import { Pagination } from 'antd';
import {Base64} from "js-base64";
import DOMPurify from 'dompurify';


function getHeadersData(headers, value){
    if (!headers || headers === []){
        return ""
    }

    // console.log(headers, "headers")
    for (let i = 0; i < headers.length; i++) {
        const header = headers[i];
        // console.log(header.name, "header")
        // console.log(header.name === value)
        if (header.name === value){
            return header.value
        }
    }

    return "empty"
}

const column = [
    {
        title: 'From',
        dataIndex: "payload",
        render: (_, { payload }) => {
            const headers = payload.headers;
            return (
                <>
                    <p>{getHeadersData(headers, "From")}</p>
                </>
            )
        }
    },
    {
        title: 'Subject',
        dataIndex: "payload",
        render: (_, { payload }) => {
            const headers = payload.headers;
            return (
                <>
                    <p>{getHeadersData(headers, "Subject")}</p>
                </>
            )
        }
    },
    {
        title: 'snippet',
        dataIndex: 'snippet'

    }
];

function Auth() {
    const [isLoading, setIsLoading] = useState(true);
    const [params, setParams] = useSearchParams()
    const [tabledata, setTabledata] = useState([]);
    const [showModel, setShowModel] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [previousPageLink, setPreviousPageLink] = useState("")
    const [nextPageLink, setNextPageLink] = useState("")
    const [totalRecords, setTotalRecords] = useState(0);
    const [paramsValue, setParamsValue] = useState("");
    const navigate = useNavigate();
    const [htmlContent, setHtmlContent] = useState('');

    const fetchApi = async (pageToken = "", currentPage = 1, code = "") => {
        try {
            const url = "https://dev-minoan-gmail.minoanexperience.com/auth"
            // const url = "http://localhost:8000/auth"
            console.log("before call")
            console.log(paramsValue)
            const res = await axios.post(url, {
                "code": code ? code : paramsValue,
                "pageToken": pageToken,
                "filter": ""
            });
            console.log(res, "response")
            if (res.status === 200) {
                setTabledata(res.data.list);
                setIsLoading(false);
                setCurrentPage(currentPage);
                updateTableData(res);
                // setParamsValue("");
            }

        } catch (e) {
            console.log(e)
        }
        // if((res.status)
    }
    useEffect(() => {
        setIsLoading(true);
        setParamsValue(params.get("code") || "");
        fetchApi("", 1, params.get("code") || "");
    }, [])


    function updateTableData(res){
        setTotalRecords(res.data?.resultSizeEstimate)
        setNextPageLink(res.data?.nextPageToken)
        setPreviousPageLink(res.data?.previousPageToken)
    }

    function closeMailClick(){
        setShowModel(false);

    }

    function getDataFromParts(res){
        let rawBody = res.payload?.parts
        // console.log(rawBody)
        if (!rawBody) return ""

        let decodedBody = ""
        for (let index = 0; index < rawBody.length; index++){
            let item = rawBody[index]
            // console.log(item)
            // console.log(item.mimeType)
            if(item.mimeType === "text/html"){
                decodedBody = item.body.data;
                break;
            }
            else if(item["mimeType"] === "text/plain"){
                decodedBody = item.body.data;
            }
        }
        // console.log(decodedBody);

        return Base64.decode(decodedBody.replace(/-/g, '+').replace(/_/g, '/'));
    }

    function decodeMailBody(res){
        if(!res) return ""
        let rawBody = res.payload.body?.data
        console.log(rawBody, "rawBody")
        if (!rawBody){
            return getDataFromParts(res);
        }

        return Base64.decode(rawBody.replace(/-/g, '+').replace(/_/g, '/'));
    }

    const getMailBody = (record) => {
        console.log(record, "selectedRow")
        const decodedBody = decodeMailBody(record);
        console.log(decodedBody, "decodedbody")
        // let modelBody = document.getElementById('modalBody');
        // console.log(modelBody, "model");
        // modelBody.innerHTML = decodedBody;

        setHtmlContent(decodedBody);
    };
    const  [toInputValue, setToInputValue] =  useState('');
    const  [fromInputValue, setFromInputValue] =  useState('');

    const  handleToChange = (event) => {
        setToInputValue(event.target.value);
    };
    const handleFromChange = (event) => {
        setFromInputValue(event.target.value);
    }

    async function handleSubmit() {
        const url = "https://dev-minoan-gmail.minoanexperience.com/auth"
        // const url = "http://localhost:8000/auth"
        console.log("before call fghjrg")
        const res = await axios.post(url, {
            "code": "n",
            "pageToken": "",
            "filter": {
                "To": toInputValue,
                "From": fromInputValue
            }
        });
        console.log(res, "response")
        if (res.status === 200) {
            setTabledata(res.data.list);
            setIsLoading(false);
            setCurrentPage(currentPage);
            updateTableData(res);
        }
    }


    return (
        <>
            <div className="email_header">
                <div className={'container-fluid'}>
                    <div className={'inner_header_wrap'}>
                        <div className={'logo-wrap'}>
                            <a href="https://minoan-gmail.minoanexperience.com/home" className={'logo-ui'}>
                                <img src="https://dev-my.minoanexperience.com/assets/images/update-minoan_logo_green.svg" alt=""/>
                            </a>
                        </div>

                    </div>

                </div>


            </div>


            {/*<div>*/}
            {/*        <label>To:*/}
            {/*            <input  type="text"  value={toInputValue} onChange={handleToChange} />*/}
            {/*        </label>*/}
            {/*        <label>From:*/}
            {/*            <input  type="text"  value={fromInputValue} onChange={handleFromChange} />*/}
            {/*        </label>*/}
            {/*        <button onClick={handleSubmit}>submit</button>*/}
            {/*</div>*/}


           <div className={'table_outer_container'}>
               <div className={'table_inner_container'}>

                   {
                       isLoading ? (
                           <div className={"loader_wrapper"}>
                               <div className={"cstm_loader"}></div>
                           </div>
                       ) : (
                           // <div>
                           //     <Table
                           //         className='custom-table-wrap product-table'
                           //         // rowSelection={rowSelection}
                           //         onRow={(record,index)=>{
                           //             return{
                           //                 onClick:(e)=> {
                           //                     console.log({record,index})
                           //                     console.log("working");
                           //                     setShowModel(true);
                           //                     getMailBody(record);
                           //                 }
                           //             }
                           //         }}
                           //         columns={column}
                           //         dataSource={tabledata}
                           //         loading={isLoading}
                           //         pagination={
                           //             false
                           //         }
                           //     />
                           //
                           //     {
                           //         tabledata.length > 0 &&
                           //         (
                           //             <div>
                           //                 <button onClick={() => {fetchApi(previousPageLink, currentPage - 1)}} disabled={currentPage === 1}>Previous</button>
                           //                 {(
                           //                     <div className='pagination_text' style={{}}>
                           //                         <span>Page {currentPage} of {Math.ceil(totalRecords / 50)}</span>
                           //                     </div>
                           //                 )}
                           //                 <button onClick={() => {fetchApi(nextPageLink, currentPage + 1)}} disabled={currentPage === Math.ceil(totalRecords / 50)}>Next</button>
                           //             </div>
                           //         )
                           //     }
                           // </div>
                           <div className={"success_message"}>
                               <span className={"icon"}>
                                   <img src={"/success.gif"} alt={""}/>
                               </span>
                               <p>Authorization Successful</p>
                           </div>
                       )
                   }
               </div>
           </div>

            {/*<div>*/}
            {/*    <Modal*/}

            {/*        size="lg"*/}
            {/*        aria-labelledby="contained-modal-title-vcenter"*/}
            {/*        centered*/}
            {/*        show={showModel}*/}
            {/*    >*/}
            {/*        <Modal.Header closeButton  onClick={closeMailClick}>*/}
            {/*            /!*<Modal.Title id="contained-modal-title-vcenter">*!/*/}
            {/*            /!*  Heading*!/*/}
            {/*            /!*</Modal.Title>*!/*/}
            {/*        </Modal.Header>*/}
            {/*        <Modal.Body>*/}
            {/*           <div id="modalBody" dangerouslySetInnerHTML={{ __html: htmlContent }}>*/}
            {/*           </div>*/}
            {/*        </Modal.Body>*/}
            {/*        <Modal.Footer>*/}
            {/*            <Button onClick={closeMailClick} >Close</Button>*/}
            {/*        </Modal.Footer>*/}
            {/*    </Modal>*/}
            {/*</div>*/}
        </>
    )
}

export default Auth;
