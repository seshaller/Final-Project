var pf = new petfinder.Client({apiKey: "ox2UwD23VVWakkvlLBUnm7DYZjdHxsOFSl1dmkb71fcNWjnd10", secret: "rRkLqNRvQOSE9yy5WobT4rYKC41sETxVmxOSFl7i"});
const APP = {
    currentQuestion: 0,
    questions: [
      {
        question: "Do you own your home?",
        dog: "./Images/pitbull-1.png",
        answers: ["yep!", "I rent", "still in my parents' basement"],
        selected: null
      },
      {
        question: "do you or anyone in your home have a dog allergy?",
        dog: "./Images/noun_Bone_477275.svg",
        answers: ["yes", "no"],
        selected: null
      },
      {
        question: "Is a responsible caretaker home for at least 4 hours during the day?",
        dog: "./Images/mutt-1.png",
        answers: ["yes", "no"],
        selected: null
      },
      {
        question: "which breed do you most identify with?",
        answers: [
          {
            name: "chihuahuha",
            url: './Images/chihuahua.png'
          }, 
          {
            name: "poodle",
            url: './Images/poodle.png'
          },
          {
            name: "great dane",
            url: './Images/greatdane.png'
          },
          {
            name: "lab",
            url: './Images/lab.png'
          },
          {
            name: "french bulldog",
            url: './Images/frenchbulldog.png'
          },
          {
            name: "basset hound",
            url: './Images/bassethound.png'
          }],
        selected: null
      }
    ]
  }
  
  /**
   * Toggles the previous question button based on the value
   * of currentQuestion inside our APP object
   */
  const btnContainer = document.querySelector('.btnContainer');
  
  const updateBtn = (returnHome) => {

    if(APP.currentQuestion && returnHome) {
      btnContainer.innerHTML = returnHomeTemplate;
    } else if(APP.currentQuestion) {
      btnContainer.innerHTML = previousBtnTemplate;
    } else {
      btnContainer.innerHTML = '';
    }
  }
  
  const previousBtnTemplate = `<button onclick="goBack()" style="font-size: 14px;border: none;color: #FF004E; font-weight: bolder;background: none;padding-top: 20px;">&lt; previous question</button>`;

  const returnHomeTemplate = `<button onclick="goHome()" style="font-size: 14px;border: none;color: #FF004E; font-weight: bolder;background: none;padding-top: 20px;">&lt; return home</button>`;

  const goBack = () => {
    APP.currentQuestion--;
    updateBtn();
    compileQuestionTemplate();
    displayTemplate();
  }

  const goHome = () => {
    APP.currentQuestion = 0;
    updateBtn();
    compileQuestionTemplate();
    displayTemplate();
  }
  
  
  /**
   * Toggles question template for each question respectively
   */
  
  const compileQuestionTemplate = () => {
    // get currently selected question
    const question = APP.questions[APP.currentQuestion];
    if(question) {
      const answers = question.answers
    
      if(APP.currentQuestion === 3){

        // return your pooch images
        return `
          <div class="headline">${question.question}</div>
          <div class="counter">Question ${APP.currentQuestion + 1} of 4</div>
            <div class="btn-grid-wrapper">
            ${
              answers.map((ans, index) => `<div class="btn"><img src="${ans.url}"><button class="breeds question-button button-${index+1}">${ans.name}</button></div>`).join("")
            }
            </div>
          <div class="dog dog-${APP.currentQuestion + 1}">
            <img src="${question.dog}" alt="dog">
          </div>
        `;

      } else {
        
        return `
          <div class="headline">${question.question}</div>
          <div class="counter">Question ${APP.currentQuestion + 1} of 4</div>
            <div class="btn-grid-wrapper">
            ${
              answers.map((ans, index) => `<div class="btn"><button class="question-button button-${index+1}">${ans}</button></div>`).join("")
            }
            </div>
          <div class="dog dog-${APP.currentQuestion + 1}">
            <img src="${question.dog}" alt="dog">
          </div>
        `;
      }
    
      
    } else {
      // here is where we would make a call to the petFinder API
      // and upon getting results back, we would display
      // a new template with the results

      // here is where you could assign your loadig gif to the question
      // container's innerHTML
  
    //$(window).ready(hideLoader);
      //const questionContainer = document.querySelector('.container');
      //questionContainer.innerHTML = `<div class="btn"><img src="file:///Users/staceyshaller/Desktop/General%20Assembly-FEWD/Final/Images/bouncyball.gif"></div>`;
      
      
      let template;
      // fire the search
      pf.animal.search({
        type: "Dog",
        location: "Chicago, IL"
      })
        .then(function (response) {
            console.log(response ); 
            // Do something with `response.data.animals`
            template = response.data.animals.map((animal) => {
                console.log(animal.description);
            return `
            <div class="box" style="color:#572A00; font-size: 12px;
            font-family: cabin condensed, sans-serif;" >
              ${
                animal.photos.length
                ?  `<div class="imagebox" style="background-image: url(${animal.photos[0].medium})"></div>` : `<img src="./Images/GenericDog.png">`
              }
                <a href="${animal.url}" style="color:#6ad4ff; font-size: 16px; font-weight: bolder;">Adoption info</a>
                <p>${animal.description || "This animal has no description"}</p>
            </div>
            `;

          }).join('');
          questionContainer.innerHTML = template;
        
      })
      .catch(function(error) {
          // Handle the error
          console.error(error)
      });
  }
}
  
  const questionContainer = document.querySelector('.container');
  
  // attaches template to the DOM
  const displayTemplate = () => {
    questionContainer.innerHTML = compileQuestionTemplate()
  }
  
  // displays the first template on initial load
  displayTemplate();
  
  
  // grabs all the current question-related buttons
  // converts them from a NodeList to an Array
  // and uses the map method to iterate over them
  // and add a click event listener to them respectively
  // allowing each button to update our APP object responses
  Array.from(document.querySelectorAll('.question-button')).forEach(btn => {
    btn.addEventListener('click', (evt) => {
      // captures the response in our APP object
      APP.questions[APP.currentQuestion].selected = evt.target.innerText;
      // updates the page with the next question
      updateQuestionnaire();
  
    })
  });
  
  
  /**
   * We create an observer to observe when the DOM has been mutated.
   * We can react to when we update the innerHTML of our questionContainer
   */
   const observer = new MutationObserver( (mutations) => {
     mutations.forEach( (mutation) => {
       // if the dom has been mutated/updated
       if(mutation.addedNodes.length) {
  
         // we know the DOM has been updated
         // we initialize our click listeners for our newly added buttons
         Array.from(document.querySelectorAll('.question-button')).map(btn => {
           btn.addEventListener('click', (evt) => {
            APP.questions[APP.currentQuestion].selected = evt.target.innerText;
            updateQuestionnaire();
           })
         })
       }
     })
   })
  
   // initialize our observer for our questionContainer
   observer.observe(questionContainer, {
     childList: true
   })
  
   // Utility function that updates our questionnaire
   // by firing all of the needed functions
   const updateQuestionnaire = () => {
    APP.currentQuestion++;
    if(APP.currentQuestion === 4) {
      updateBtn(true);
    } else {
      updateBtn();
    }
    compileQuestionTemplate();
    displayTemplate();
   }
   