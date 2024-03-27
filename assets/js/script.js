function loadScript() {
  let user = prompt("Please enter your name", "");
  if (!user) {
    document.getElementsByTagName("main")[0].innerHTML =
      "Please Enter Your Name";
  }

  var pubnub = new PubNub({
    publishKey: "demo",
    subscribeKey: "demo",
    userId: user,
  });

  pubnub.subscribe({
    channels: ["ws-channel"],
  });

  pubnub.addListener({
    message: (payload) => {
      let messageString = "";
      const isCurrentUserPublisher = user === payload.publisher;
      const msg_cls = isCurrentUserPublisher
        ? "justify-content-md-end"
        : "justify-content-md-start";
      if (payload.messageType === "image") {
        messageString = `
          <div class='row w-100 ${msg_cls} mb-2'>
            <div class="col-5 text-start sender-msg p-0">
              <img src="${payload.messages}" class="message-image" />
            </div>
            <div class="col-1 p-0">
              <div class='d-inline text-dark fw-bold'>${payload.publisher}</div>
            </div>
          </div>
        `;
      } else {
        if (isCurrentUserPublisher) {
          messageString = `
            <div class='row w-100 ${msg_cls} mb-2'>
              <div class="col-5 text-start sender-msg p-0">
                <div class='d-inline'>${payload.message}</div>
              </div>
              <div class="col-1 p-0">
                <div class='d-inline text-dark fw-bold'>${payload.publisher}</div>
              </div>
            </div>
          `;
        } else {
          messageString = `
            <div class='row w-100 ${msg_cls} mb-2'>
              <div class="col-1 p-0">
                <div class='d-inline text-dark fw-bold'>${payload.publisher}</div>
              </div>
              <div class="col-5 text-start receiver-msg p-0">
                <div class='d-inline'>${payload.message}</div>
              </div>
            </div>
          `;
        }
      }
      document.getElementById("messages").innerHTML += messageString;
    },
  });

  function sendMessage(event) {
    var inputMessage = document.getElementById("message");
    var messages = document.getElementById("messages");
    var fileInput = document.getElementById("file-input");

    if (fileInput.files.length > 0) {
      var file = fileInput.files[0];
      var reader = new FileReader();
      reader.onload = function (event) {
        var imageUrl = event.target.result;
        var img = document.createElement("img");
        img.classList.add("message-image");
        img.src = imageUrl;

        var imageContent = document.createElement("div");
        imageContent.classList.add("image-content");

        var imageContainer = document.createElement("div");
        imageContainer.classList.add("image-container");
        imageContent.appendChild(imageContainer);
        imageContainer.appendChild(img);
        messages.appendChild(imageContent);

        pubnub.publish({
          channel: "ws-channel",
          message: messages.value,
        });
      };

      reader.readAsDataURL(file);

      fileInput.value = "";
    } else if (inputMessage.value) {
      pubnub.publish({
        channel: "ws-channel",
        message: inputMessage.value,
      });
      inputMessage.value = "";
    }

    event.preventDefault();
  }
  document.getElementById("input-form").addEventListener("submit", sendMessage);
}

const emojiBtn = document.querySelector("#emoji-btn");
const picker = new EmojiButton();
// Emoji selection
window.addEventListener("DOMContentLoaded", () => {
  picker.on("emoji", (emoji) => {
    document.querySelector("input").value += emoji;
  });

  emojiBtn.addEventListener("mouseover", () => {
    picker.togglePicker(emojiBtn);
  });
});
function setTheme(theme) {
  document.documentElement.style.setProperty("--primary-color", theme);
  localStorage.setItem("hpc-theme", theme);
}

window.onload = loadScript;