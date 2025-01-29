---
title: "Blog Data Manager"
excerpt: "This page is for admin user."
sitemap: false
permalink: /admin/scripts
author_profile: true
---

This page is for admin user to manage blog data.

If you are not the owner of this site, please [go back](#){: onclick="history.back()"}.

## Very Suspicious Button

**DO NOT CLICK!** unless you are [the author](/about/).
{: .notice--danger}

<style>
    .trigger-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .trigger-button {
        display: inline-block;
        margin-bottom: 10px;
        padding: 10px 20px;
        background-color: #4c9aff;
        color: white;
        font-size: 16px;
        border: none;
        cursor: pointer;
        border-radius: 4px;
        box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
        transition: background-color 0.3s;
    }

    .trigger-button:hover {
        background-color: #2e86ff;
    }

    .message {
        font-size: 16px;
        color: #333;
    }
</style>
<div class="trigger-container">
    <button id="triggerButton" class="trigger-button">Update</button>
    <div id="message" class="message"></div>
</div>

<script>
    document.getElementById("triggerButton").addEventListener("click", sendRequest);

    async function sendRequest() {
        const messageElement = document.getElementById("message");
        messageElement.classList.add("notice", "notice--info");
        messageElement.textContent = "Sending the request...";

        await fetch("https://script.google.com/macros/s/AKfycbzYYpp5Xswu2E8gVFSFlOdaACrS7ByidAAnXiVFZs2xBOfhT_M6JcOl4-c2t7AbvnTMoQ/exec", {
            method: "POST",
        })
        .then((response) => {
            if (response.status === 204 || response.status === 200) {
                messageElement.classList.replace("notice--info", "notice--success");
                messageElement.textContent = "Request sent successfully.";
                console.log("Status code: " + response.status)
            } else {
                messageElement.classList.replace("notice--info", "notice--warning");
                messageElement.textContent = "Failed to send the request. Status code: " + response.status;
            }
        })
        .catch(error => {
            console.error("Error:", error);
            messageElement.classList.replace("notice--info", "notice--warning");
            messageElement.textContent = "An unknown error occurred while sending the request.";
        })
    }
</script>
