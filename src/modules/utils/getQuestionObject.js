
export const getQuestionObject = ( data, questionId ) => {

    const questions = data.questions,
          qLength = questions.length;

    let obj = {};
    
    for(let q=0; q<qLength; q++){
        const question = questions[q];
        if( question.id == questionId ){
            obj = question;
            break;
        }
    }

    return obj;

}