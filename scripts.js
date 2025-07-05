const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;
const API_KEY ="AIzaSyAlQyqqT8JI7HPIF-_HP9o0M9Jg-t-HfQQ";
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    // create a chat <li> with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>`:`<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}
const generateResponse = (incomingChatLi) => {
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/generateContent?key=${API_KEY}`;
    const messageElement = incomingChatLi.querySelector("p");
    // define the properties and message for the api request 
    const requestOptions ={
        method:"POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            contents:[{
                role: "user",
                parts:[{text:userMessage}]
            }]
        }),
    };
    // send post request to api,get response 
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
       messageElement.textContent = data.choices[0].message.content;
        update:messageElement.textContent = data.candidates[0].content.parts[0].text;
        //update message text with api response 
    }).catch((error) => {
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong . Please try again.";
    }).finally(()=> chatbox.scrollTo(0, chatbox.scrollHeight));
}
const handleChat =() => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value = "";
    chatInput.computedStyleMap.height = `${inputInitHeight}px`;
    // append the users message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0,chatbox.scrollHeight);

    setTimeout(()=> {
        // display thinking message while waiting for the response
        const incomingChatLi = createChatLi("Thinking....", "incoming")
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0,chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    },600);
}

chatInput.addEventListener("input",() => {
    //adjust height of input textarea based on its content 
    chatInput.computedStyleMap.height = `${inputInitHeight}px`;
    chatInput.computedStyleMap.height = `${chatInput.scrollHeight}px`;
});
chatInput.addEventListener("keydown",(e) => {
    // if enter key is pressed without shift key and the window 
    // width is greater than 800px, handle the chat 
    if(e.key==="Enter" && !e.shiftKey && window.innerWidth >800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click",handleChat);
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));


