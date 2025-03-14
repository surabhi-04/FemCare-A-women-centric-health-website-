import { GoogleGenerativeAI } from "@google/generative-ai";
 
const API_KEY = "ENTER YOUR API KEY"
const genAI = new GoogleGenerativeAI(API_KEY);
 
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
 
const prompt = "Write a story about a magic backpack.";
 
const result = await model.generateContent(prompt);
console.log(result.response.text());

const businessInfo = `

General Business Information:
Website: www.FemCare.com


Support Email: support@femcare.com


FAQs:
General:
What does FemCare do?
It is a Women Health solution recommendation algorithm. Shortly, you'll help a customer find advise or solution that fits their needs. Right now, your job is to clarify their needs. You must ask, in a friendly, helpful tone, two questions. You can should messages with phrases such as "I'll be happy to help you with that!" or "Gotcha! Let me help!".
Don't use the word "looking for" because it's not a product recommendation system !!!
After the intro phrase, you should ask EXACTLY ONE questions to help clarify their needs. Keep your questions quite general and vague - you don't know what health issues, behavior etc. are available.

You are a friendly, helpful personalised recommendation service. Your job is to provide a recommendation of a women health issues remedies from a database to a customer. **You have already searched through the database and found a remedy.** Rather than just copy-pasting the description and metadata provided, use it to form your own responses.
Give a structured answer, use BULLET POINTS or numbering whenever its necessary.use BOLD texts also , highlight few words like headings nd so on !
For context, here's the conversation you had with the customer:
Don't always recommend some PRODUCT for every query!!!, just screen the knowledge base and give some natural remedies to cope from the situation , rather than recommending product ,



Tone Instructions:
Conciseness: Respond in short, informative sentences , use points while answering, give some spaces between every paragraphs.
Empathy: Show understanding and empathy for the customer's situation.

Formality: Use polite language with slight formality (e.g., "Please let us know," "We are happy to assist").
Clarity: Avoid technical jargon unless necessary.
Consistency: Ensure responses are aligned in tone and style across all queries.
Example: "Thank you for reaching out! Please let us know if you need further assistance."

`;


let messages = {
    history: [],
}

async function sendMessage() {

    console.log(messages);
    const userMessage = document.querySelector(".chat-window input").value;
    
    if (userMessage.length) {

        try {
            document.querySelector(".chat-window input").value = "";
            document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend",`
                <div class="user">
                    <p>${userMessage}</p>
                </div>
            `);

            document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend",`
                <div class="loader"></div>
            `);

            const chat = model.startChat(messages);

            let result = await chat.sendMessageStream(userMessage);
            
            document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend",`
                <div class="model">
                    <p></p>
                </div>
            `);
            
            let modelMessages = '';

            for await (const chunk of result.stream) {
              const chunkText = chunk.text();
              modelMessages = document.querySelectorAll(".chat-window .chat div.model");
              modelMessages[modelMessages.length - 1].querySelector("p").insertAdjacentHTML("beforeend",`
                ${chunkText}
            `);
            }

            messages.history.push({
                role: "user",
                parts: [{ text: userMessage }],
            });

            messages.history.push({
                role: "model",
                parts: [{ text: modelMessages[modelMessages.length - 1].querySelector("p").innerHTML }],
            });

        } catch (error) {
            document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend",`
                <div class="error">
                    <p>The message could not be sent. Please try again.</p>
                </div>
            `);
        }

        document.querySelector(".chat-window .chat .loader").remove();
        
    }
}

document.querySelector(".chat-window .input-area button")
.addEventListener("click", ()=>sendMessage());

document.querySelector(".chat-button")
.addEventListener("click", ()=>{
    document.querySelector("body").classList.add("chat-open");
});

document.querySelector(".chat-window button.close")
.addEventListener("click", ()=>{
    document.querySelector("body").classList.remove("chat-open");
});

/*response-enter*/
document.addEventListener('DOMContentLoaded', (event) => {
    const inputField = document.querySelector('.input-area input');

    inputField.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            // Add your CSS class or perform any action here
            document.querySelector('.chat-window').style.display = 'flex';
        }
    });
});
