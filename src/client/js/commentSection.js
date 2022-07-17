const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const videoDelete = document.getElementById("videoDelete");
const deleteBtn = document.querySelectorAll(".deleteBtn");

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;

  if (text === "") {
    //내용 없으면 그냥 동작 취소
    return;
  }
  //ajax 요청 //HTTP 구조 이론 알아야함
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId, name } = await response.json();
    addComment(name, text, newCommentId);
  }
};

const addComment = (name, text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");

  newComment.dataset.id = id;
  newComment.className = "video__comment";

  const icon = document.createElement("i");
  icon.className = "fas fa-comment";

  const span = document.createElement("span");
  span.innerText = `${name} : ${text}`;

  const span2 = document.createElement("span");
  span2.innerText = "❌";
  span2.addEventListener("click", handleDelete);

  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);

  videoComments.prepend(newComment);
};

const handleDelete = async (event) => {
  const commentList = event.target.parentNode;
  const commentId = commentList.dataset.id;
  const videoId = videoContainer.dataset.id;

  if (confirm("삭제하시겠습니까?")) {
    const response = await fetch(`/api/comments/${commentId}/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        videoId,
      }),
    });

    if (response.status === 201) {
      deleteComment(event);
    }

    if (response.status === 403) {
      alert("댓글 작성자가 아닙니다.");
    }
  }
};

const deleteComment = (event) => {
  const commentContainer = document.querySelector(".video__comments ul");
  const commentList = event.target.parentNode;
  commentContainer.removeChild(commentList);
};

const handleDeleteVideo = (event) => {
  event.preventDefault();
  if (confirm("삭제하시겠습니까?")) {
    window.location.href = event.target.href;
  }
};

videoDelete.addEventListener("click", handleDeleteVideo);

if (form) {
  form.addEventListener("submit", handleSubmit);
}

for (let i = 0; i < deleteBtn.length; i++) {
  deleteBtn[i].addEventListener("click", handleDelete);
}
