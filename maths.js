var answer = 5;
var score = 0;
var bgImages = [];

function nextQuestion() {
  const n1 = Math.floor(Math.random() * 5);
  document.getElementById("n1").innerHTML = n1;
  const n2 = Math.floor(Math.random() * 6);
  document.getElementById("n2").innerHTML = n2;

  answer = n1 + n2;
}

function chekAnswer() {
  const prediction = predictImage();
  console.log(`Prediction: ${prediction}, Answer: ${answer}`);
  if (prediction == answer) {
    score++;
    console.log(`Correct. Score is ${score}`);
    if (score <= 6) {
      bgImages.push(`url('images/background${score}.svg')`);
    } else {
      alert(
        "Well done! Your math garden is in full bloom! Want to start again?"
      );
      score = 0;
      bgImages = [];
    }
    document.body.style.backgroundImage = bgImages;
  } else {
    if (score != 0) score--;
    console.log(`Wrong. Score is ${score}`);
    alert(
      "Oops! Check your calculation and try writing the number neater next time."
    );
    setTimeout(function () {
      bgImages.pop();
      document.body.style.backgroundImage = bgImages;
    }, 500);
  }
}
