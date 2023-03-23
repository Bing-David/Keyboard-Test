
// let width = window.innerWidth;
// let height = window.innerHeight;
// alert(`La resolución de la ventana es: ${width} x ${height}`);



    /*LOADER*/
    window.addEventListener('load', function() {
      const loading = document.querySelector('.loading');
      loading.style.display = "none";
    });
    /*LOADER*/
    


    /*bserver load game*/
    const section = document.querySelector('.container');

    const options = {
      rootMargin: '1px',
      threshold: 0.5
    };
    
    const observer = new IntersectionObserver(function(entries, observer) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, options);
    
    observer.observe(section);

    /*bserver load game*/




    /*Game backend*/
    document.addEventListener('DOMContentLoaded', function () {
      const board = document.querySelector(".board");
      const input = document.getElementById("user-input");
      const stats = document.getElementById("stats");
      const numWordsInput = document.getElementById("num-words-input");
      let currentIndex = 0;
      let startTime = 0;
      let endTime = 0;
      let correctWords = 0;
      let incorrectWords = 0;
      let words = [];
    
      // Nuevas variables para los graficos
      const ppmCanvas = document.getElementById("ppm-chart");
      const timeCanvas = document.getElementById("time-chart");
      const ppmCtx = ppmCanvas.getContext("2d");
      const timeCtx = timeCanvas.getContext("2d");
      let ppmChart = null;
      let timeChart = null;
    
      function generateBoard() {
        const numWords = parseInt(numWordsInput.value);
        const wordList = words.slice(0, numWords).map(word => `<h4>${word}</h4>`).join('');
        board.innerHTML = wordList;
      }
    
      function checkInput() {
        const currentWord = board.childNodes[currentIndex];
        const userInput = input.value.trim();
        const isCorrect = userInput === currentWord.textContent;
    
        if (currentWord) {
          if (isCorrect) {
            currentWord.classList.add("correct");
            currentWord.style.color = "#7AA874";
            currentWord.style.textDecoration = "none";
            correctWords++;
          } else if (currentWord.textContent.includes(userInput)) {
            currentWord.style.color = "#F7DB6A";
            currentWord.style.textDecoration = "line-through";
            incorrectWords++;
    
          } else {
            currentWord.classList.add("incorrect");
            currentWord.style.color = "#FC2947";
            currentWord.style.textDecoration = "line-through";
            incorrectWords++;
          }
        }
    

   


        input.value = "";
        currentIndex++;
    
        if  (currentIndex === parseInt(numWordsInput.value)) {
          endTime = new Date().getTime();
          const timeElapsed = (endTime - startTime) / 1000;
          const ppm = Math.round(parseInt(numWordsInput.value) / (timeElapsed / 60));
          const accuracy = Math.round((correctWords / (correctWords + incorrectWords)) * 100);
          stats.innerHTML = ` Has tardado <b> ${timeElapsed} segundos </b>. Tu velocidad es de <b> ${ppm} PPM </b>. Tu tasa de precisión es del <b> ${accuracy}%.<b>`;
          currentIndex = 0;
          correctWords = 0;
          incorrectWords = 0;
          loadWords();
          
          // Añadir los datos de ppm y tiempo a los graficos
          if (ppmChart) {
            ppmChart.data.labels.push(ppmChart.data.labels.length + 1);
            ppmChart.data.datasets[0].data.push(ppm);
            ppmChart.update();
          } else {


            

            ppmChart = new Chart(ppmCtx, {


              type: "line",
              data: {
                labels: [1],
                datasets: [{
                  label: "Palabras por minuto",
                  data: [ppm],
                  borderColor: "#F15A24",
                  backgroundColor: "rgba(241, 90, 36, 0.08)"
                }]
              },
              options: {
                scales: {
                  yAxes: [{
                    ticks: {
                      beginAtZero: true,
                    },
                  }]
                }
              }
            }); 
          }
        
          if (timeChart) {
            timeChart.data.labels.push(timeChart.data.labels.length + 1);
            timeChart.data.datasets[0].data.push(timeElapsed);
            timeChart.update();
          } else {
            timeChart = new Chart(timeCtx, {
              type: "line",
              data: {
                labels: [1],
                datasets: [{
                  label: "Tiempo de prueba (segundos)",
                  data: [timeElapsed],
                  borderColor: "#CCCCCC",  
                  backgroundColor: "rgba(200, 200, 200, 0.05)"
                }]
              },
              options: {

          

                scales: {
                  yAxes: [{
                    ticks: {
                      beginAtZero: true
                    }
                  }]
                }
              }
            });
          }
        
          generateBoard();
          // input.focus();
          startTime = new Date().getTime();
        } else {
          board.childNodes[currentIndex].classList.add("current");
        }
      }




      


        function loadWords() {
          fetch('https://random-word-api.herokuapp.com/word?number=20&lang=es')
            .then(response => response.json())
            .then(data => {
              words = data;
              generateBoard();
              // input.focus();
              startTime = new Date().getTime();

            })
            .catch(error => {
              const msg =document.querySelector(".message");
              msg.classList.replace("message","error");
              msg.innerText = 'API ' + error;
              document.body.appendChild(msg);
            });
            

        }
        
        
      
      loadWords();
      input.addEventListener("keyup", function(event) {
        if (event.key === " ") {
          checkInput();
        }

      });
      numWordsInput.addEventListener("change", generateBoard);

      });
    

    /*Game backend*/



    /* KeySong*/
    const keys = document.querySelectorAll('.key');

    function playSound(e) {
      const key = document.querySelector(`.key[data-key="${e.keyCode}"]`);
      if (!key) return;
      key.classList.add('playing');
    
      const audio = new Audio("/song/data-key.mp3");
      audio.play();
    }
    
    function removeTransition(e) {
      if (e.propertyName !== 'transform') return;
      this.classList.remove('playing');
    }
    
    document.addEventListener('keydown', playSound);
    
    keys.forEach(key => key.addEventListener('transitionend', removeTransition));


      


      

