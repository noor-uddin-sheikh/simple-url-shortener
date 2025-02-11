//newsapi.org api key
// const ApiKey = process.env.news_org_api_key;
// const url = "https://newsapi.org/v2/everything?q=";

// const chatgptApikey = process.env.chatgpt_api_key;


//to fetch deepseek
// const deepseekApikey = process.env.deepseek_api_key;
// const deepseekUrl = "https://api.deepseek.com/v1/summarize";


// const geminiApikey = process.env.gemini_api_key;



window.addEventListener("load", () => fetchNews("India"));

async function fetchNews(query) {
    try {
        const res = await fetch(`${url}${query}&apiKey=${ApiKey}&pageSize=20`);
        const data = await res.json();
        bindData(data.articles);
    } catch (error) {
        console.error("Error fetching the news", error);
    } finally {
        // document.getElementById('loader').style.display = "none";
        document.getElementById('loader-container').style.display = "none";
    }
}

//chatgpt fetching summarized news

async function summarizedContent(content) {
    const body = {
        model: "gpt-3.5-turbo",  // Specify the ChatGPT model
        messages: [
            { role: "system", content: "You are a helpful assistant that summarizes news." },
            { role: "user", content: `Summarize the following news content in 150-200 words with bullet points and highlight key terms:\n\n${content}` }
        ],
        max_tokens: 200
    };

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${chatgptApikey}`
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        return data.choices && data.choices.length > 0 ? data.choices[0].message.content : content;
    } catch (error) {
        console.error("Error fetching summarized content from ChatGPT:", error);
        return content;
    }
}



//parsing and fetching from deepseek

// async function summarizedContent(content) {
//     console.log("Sending content to DeepSeek:", content); // Log before sending

//     const body = {
//         text: content,
//         max_length: 200, // Adjust the max length as needed
//         prompt: "Summarize the news content in 150-200 words with bullet points and highlight key terms."
//     };

//     try {
//         const response = await fetch("https://api.deepseek.com/v1/summarize", {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${deepseekApikey}` // Use your DeepSeek API key
//             },
//             body: JSON.stringify(body)
//         });

//         const data = await response.json();
//         console.log("DeepSeek Response:", data); // Log full response

//         // Assuming the DeepSeek API returns the summarized content in a 'summary' field
//         return data.summary || "Summary unavailable.";
//     } catch (error) {
//         console.error("Error fetching summarized content from DeepSeek:", error);
//         return "Error generating summary.";
//     }
// }





//deepseek summarize function

// async function summarizedContent(content) {
//     try {
//         const response = await fetch(deepseekUrl, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${deepseekApikey}`
//             },
//             body: JSON.stringify({
//                 text: content,
//                 max_length: 200,
//                 prompt: "summarize the news content in maximum 150 to 200 words and make them in bullet points, highlight the keywords or important terms as bold and make it easy to read and understand."
//             })
//         });
//         const data = await response.json();
//         return data.summary;
//     } catch (error) {
//         console.error("Error fetching the summarized content");
//         return content;
//     }
// }



//bind data from chatgpt

// async function bindData(articles) {
//     const cardContainer = document.getElementById("cards-container");
//     const newsTemplate = document.getElementById("news-template");

//     cardContainer.innerHTML = "";

//     const summarizationPromises = articles.map(async (article) => {
//         if (!article.urlToImage) {
//             return null; // Skip articles without images
//         }

//         const articleContent = article.content || article.description || "No content available.";
//         return summarizedContent(articleContent).then(summary => ({
//             article,
//             summary
//         }));
//     });

//     // ✅ Process all articles in parallel but safely handle failures
//     const results = await Promise.allSettled(summarizationPromises);

//     results.forEach(result => {
//         if (result.status === "fulfilled" && result.value) {
//             const { article, summary } = result.value;
//             const cardClone = newsTemplate.content.cloneNode(true);
//             fillDataInCard(cardClone, article, summary);
//             cardContainer.appendChild(cardClone);
//         } else {
//             console.error("Failed to summarize an article:", result.reason);
//         }
//     });
// }




async function bindData(articles) {
    const cardContainer = document.getElementById("cards-container");
    const newsTemplate = document.getElementById("news-template");

    cardContainer.innerHTML = "";

    // articles.forEach((article) => {

    //     if (!article.urlToImage) {
    //         return;
    //     }

    for (const article of articles) {
        if (!article.urlToImage) {
            continue; // Skip articles without images
        }

        const cardClone = newsTemplate.content.cloneNode(true);
        const summarized = await summarizedContent(article.content);

        fillDataInCard(cardClone, article, summarized);
        cardContainer.appendChild(cardClone);
    };
}


function fillDataInCard(cardClone, article, summarized) {
    const newsImg = cardClone.querySelector("#news-image");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsDesc.innerHTML = summarized;
    // newsDesc.innerHTML = article.content;
    newsTitle.innerHTML = article.title;

    const date = new Date(article.publishedAt).toLocaleString("en-US", { timeZone: "Asia/Jakarta", });

    newsSource.innerHTML = `${article.source.name} - ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    })
}

document.addEventListener("click", (event) => {
    if (event.target.classList.contains("nav-item")) {
        navItemClick(event.target.id);
    }
});


// document.addEventListener("click",(e)=>{

//     const navItem = document.querySelectorAll(".nav-items");
// console.log("navitems",navItem.length);
//     navItem.forEach((item) => {
//         item.addEventListener("click", () => {
//             const category = item.id;
//             navItemClick(category);
//         });
//     });
// });

let selectedNav = null;
function navItemClick(query) {
    fetchNews(query);
    const navItem = document.getElementById(query);
    selectedNav?.classList.remove("active");
    selectedNav = navItem;
    selectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener('click', () => {
    const query = searchText.value;
    if (!query) {
        return;
    }
    fetchNews(query);
    selectedNav?.classList.remove("active");
    selectedNav = null;
})