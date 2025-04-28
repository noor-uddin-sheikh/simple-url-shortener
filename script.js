const shortBtn = document.querySelector(".short-btn");
const reload = document.querySelector(".reload");


shortBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const longUrl = document.getElementById("url").value;
    const apiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent('https://tinyurl.com/api-create.php?url=' + longUrl)}`;


    const shortUrl = document.getElementById("short-url");

    try {
        let response = await fetch(apiUrl);
        let data = await response.json();
        let tinyUrl = data.contents;
        console.log(data);
        if (data) {
            shortUrl.value = tinyUrl;
            // shortUrl.value = data;
        }
        else {
            shortUrl.value = "Error: Invalid link";
        }
    } catch (error) {
        shortUrl.value = "network down try again later";
    }

})

reload.addEventListener('click', () => location.reload());