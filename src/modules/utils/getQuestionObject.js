
export function getQuestionObject( data, questionId ){

    const questions = data.questions,
          qLength = questions.length;

    let obj = {};
    
    for(let q=0; q<qLength; q++){
        let question = questions[q];
        if( question.id == questionId ){
            obj = question;
            break;
        }
    }

    return obj;

}