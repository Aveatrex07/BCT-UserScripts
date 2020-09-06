// ==UserScript==
// @name         Instant Profile & Unedited post Displayer
// @version      0.1
// @description  Instantly displays user's profile on hover and unedited post history on click.
// @author       Aveatrex
// @include      https://bitcointalk.org/index.php?topic=*
// @grant        GM_addStyle
// ==/UserScript==

//pop up styling taken from W3Schools
//theymos.css
GM_addStyle(".hover_bkgr_fricc{background:rgba(0,0,0,.4);cursor:pointer;overflow-y:scroll;overflow-x:scroll;height:100%;position:fixed;text-align:center;top:0;width:100%;z-index:10000}.hover_bkgr_fricc .helper{display:inline-block;height:100%;vertical-align:middle}.hover_bkgr_fricc>div{background-color:#fff;box-shadow:10px 10px 60px #555;display:inline-block;height:auto;max-width:700px;min-height:100px;vertical-align:middle;width:60%;position:relative;border-radius:8px;padding:15px 5%}.popupCloseButton{background-color:#fff;border:3px solid #999;border-radius:50px;cursor:pointer;display:inline-block;font-family:arial;font-weight:700;position:absolute;top:-20px;right:-20px;font-size:25px;line-height:30px;width:30px;height:30px;text-align:center}.popupCloseButton:hover{background-color:#ccc}.trigger_popup_fricc{cursor:pointer;font-size:20px;margin:20px;display:inline-block;font-weight:700}.hover_bkgr_fricc2{background:rgba(0,0,0,.4);cursor:pointer;overflow-y:scroll;height:100%;text-align:center;position:fixed;top:0;width:100%;z-index:10000}.hover_bkgr_fricc2 .helper2{display:inline-block;height:100%;vertical-align:middle}.hover_bkgr_fricc2>div{background-color:#fff;box-shadow:10px 10px 60px #555;display:inline-block;height:auto;max-width:1500px;min-height:100px;vertical-align:middle;width:60%;position:relative;border-radius:8px;padding:15px 5%}.popupCloseButton2{background-color:#fff;border:3px solid #999;border-radius:50px;cursor:pointer;display:inline-block;font-family:arial;font-weight:700;position:absolute;top:-20px;right:-20px;font-size:25px;line-height:30px;width:30px;height:30px;text-align:center}.popupCloseButto2n:hover{background-color:#ccc}.trigger_popup_fricc{cursor:pointer;font-size:20px;margin:20px;display:inline-block;font-weight:700}.postext{color:#000;background-color:#ecedf3;font-size:13px;font-family:verdana,sans-serif;margin-bottom:5px;padding:5px}.postext .quoteheaderext{color:#476c8e;text-decoration:none;font-style:normal;font-weight:700;font-size:11px;line-height:1.2em;margin-left:6px}.postext .quoteext{color:#000;background-color:#f1f2f4;border:1px solid #d0d0e0;padding:5px;margin:1px 3px 6px 6px;font-size:12px;line-height:1.4em}")
//xmlhttp request object function
function makeHttpObject() {
    try {return new XMLHttpRequest();}
    catch (error) {}
  }

//creates an html popup element to be injected in the page to display the profile
var inject= document.createElement("div");
inject.classList="bigcontain";
inject.innerHTML = '<div class="hover_bkgr_fricc"> <span class="helper"></span> <div> <div class="popupCloseButton">&times;</div> <p id="profile">Add any HTML content<br />inside the popup box!</p> </div></div>';
//get all anchor tags
var anchs=Array.from(document.getElementsByTagName("a"));
anchs.forEach((e)=>{
    //listen for mouse hovering on previously selected anchor tags
    e.addEventListener("mouseover",()=>{
        //get the profile link
        let link=e.getAttribute("href");
        //get the title of the anchor tag
        let title=e.getAttribute("title");
        if(title!=null){
            //check if the anchor tag leads to an user profile
            if(title.includes("View the profile")){
                //create request object
                var request = makeHttpObject();
                //request the profile
                request.open("GET",link, true);
                request.send(null);
                request.onreadystatechange = function() {
                    //when the request is ready
                    if (request.readyState == 4){
                        //store the requested html
                        var html=request.responseText;
                        //inject the previously created html element
                        document.body.insertBefore(inject,null);
                        document.getElementsByClassName("bigcontain")[0].style.display="";
                        if(html!=undefined){
                            //do some string processing to extract only the main box of the profile
                            let firstind=html.indexOf('<div class="tborder"');
                            let secondind=html.indexOf("</div>",firstind);
                            html = html.replace(html.substring(firstind, secondind), "");
                            firstind=html.indexOf('<table cellpadding="0"');
                            secondind=html.indexOf("</table>",firstind);
                            html = html.replace(html.substring(firstind, secondind), "");

                        }
                        //inject the profile html into the popup
                        document.getElementById("profile").innerHTML=html;
                        if(document.getElementsByClassName("popupCloseButton")[0]!=undefined){
                            //if the user clicks on the "X" button, the popup closes
                            document.getElementsByClassName("popupCloseButton")[0].addEventListener("click",(ele)=>{
                                document.getElementsByClassName("bigcontain")[0].style.display="none";
                            });
                        }
                        document.addEventListener("keyup",(ele)=>{
                            //if the user clicks on the Escape key, the popup closes
                            if(ele.key=="Escape"){
                                document.getElementsByClassName("bigcontain")[0].style.display="none";
                            }
                        });
                };}
            }

        }
    })});
;
//creates an html popup element to be injected in the page to display the profile
var inject2= document.createElement("div");
inject2.classList="bigcontain2";
inject2.innerHTML = '<div class="hover_bkgr_fricc2"> <span class="helper2"></span> <div> <div class="popupCloseButton2">&times;</div> <p id="editpos">Add any HTML content<br />inside the popup box!</p> </div></div>';

//select all the elements that contain the time of edited posts
var edits=Array.from(document.getElementsByClassName("edited"));

edits.forEach((ele)=>{
    //listens for when the user clicks on the selected elements
    ele.addEventListener("click",()=>{
        //do some string processing to get the post id
        let html=document.getElementsByTagName("body")[0];
        html=html.outerHTML
        let firstindexo=html.indexOf(ele.outerHTML);
        let secondindexo=html.indexOf('https://bitcointalk.org/index.php?topic=',firstindexo);
        let thirdindexo=html.indexOf('"',secondindexo);
        html=html.substring(secondindexo,thirdindexo);
        let fourthindexo=html.indexOf(".msg");
        let fifthindexo=html.indexOf("<head>");
        let sixthindexo=html.indexOf("</head>");
        html = html.replace(html.substring(fifthindexo, sixthindexo), "");
        html=html.substring(fourthindexo+4,fourthindexo+12);
        //define the link to the unedited post on loyce website
        let post="https://loyce.club/archive/posts/"+html.substring(0,4)+"/"+html+".html";
        console.log(post);
        //make a request object
        var request2 = makeHttpObject();
        //request the unedited post from loyce website
        request2.open("GET",post, true);
        request2.send(null);
        request2.onreadystatechange = function() {
            //if the request is ready
            if (request2.readyState == 4){
                //store the requested html
                var html3=request2.responseText;
                //if the archive of the post exists
                if(!html3.includes("The page you're looking for doesn't exist.")){
                    //inject the popup
                    document.body.insertBefore(inject2,null);
                    document.getElementsByClassName("bigcontain2")[0].style.display="";
                    //remove some elements
                    let seventhindexo=html3.indexOf("<meta");
                    let eighthindexo=html3.indexOf('<B>');
                    html3 = html3.replace(html3.substring(seventhindexo, eighthindexo), "");
                    //change the classes to fit theymos.css styling
                    html3=html3.replace('"quote"','"quoteext"');
                    html3=html3.replace('"post"','"postext"');
                    html3=html3.replace('"quoteheader"','"quoteheaderext"');
                    //inject the unedited post
                    document.getElementById("editpos").innerHTML=html3;
                }
                else{
                    //if the archive of the post doesn't exist
                    document.body.insertBefore(inject2,null);
                    document.getElementsByClassName("bigcontain2")[0].style.display="";
                    document.getElementById("editpos").innerHTML="Original post is not available";
                }
                //if the user clicks on the "X" button, the popup closes
                if(document.getElementsByClassName("popupCloseButton2")[0]!=undefined){
                    document.getElementsByClassName("popupCloseButton2")[0].addEventListener("click",(ele)=>{
                        document.getElementsByClassName("bigcontain2")[0].style.display="none";
                    });
                }
                //if the user clicks on the "Escape" button, the popup closes
                document.addEventListener("keyup",(ele)=>{
                    if(ele.key=="Escape"){
                        document.getElementsByClassName("bigcontain2")[0].style.display="none";
                        //location.reload();
                    }
                });
            }
        }
    })
})
