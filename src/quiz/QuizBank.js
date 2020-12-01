
const qBank = [ 
    { 
      question: 
        "When Umi&Shio .Ch Debut ? ", 
      answers: ["17 August", "17 September", "18 August", "18 September"], 
      correct: "17 August", 
    }, 
    { 
        question: 
          "Who The Fullname of Umi ?", 
        answers: ["Umi Santika", "Seruni Santika", "Santika Umi", "Umii Umii Umii"], 
        correct: "Seruni Santika", 
    }, 
    { 
        question: 
          "Who The Fullname of Shio ?", 
        answers: ["Arshio Mandala", "Shio Mandala", "Mandala Shio", "Shioooota"], 
        correct: "Arshio Mandala", 
    },
    
  ]; 
    
// n = 5 to export 5 question 
//   export default (n = 5) => 
//     Promise.resolve(qBank.sort(() => 0.5 - Math.random()).slice(0, n)); 
export default qBank
  