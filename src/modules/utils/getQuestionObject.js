
export const getQuestionObject = ( questions, questionId ) => {

    const qLength = questions.length;

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