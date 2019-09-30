
export function getQuestionObject( questionId ){

    const self = this,
          questions = self.data.questions,
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