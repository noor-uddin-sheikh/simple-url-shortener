const shortBtn = document.querySelector(".short-btn");
const reload = document.querySelector(".reload");


shortBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const longUrl = document.getElementById("url").value;
    const apiUrl = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`;

    const shortUrl = document.getElementById("short-url");

    try {
        let response = await fetch(apiUrl);
        let data = await response.text();
        console.log(data);
        if (data) {
            shortUrl.value = data;
        }
        else {
            shortUrl.value = "Error: Invalid link";
        }
    } catch (error) {
        shortUrl.value = "network down try again later";
    }

})

reload.addEventListener('click', () => location.reload());