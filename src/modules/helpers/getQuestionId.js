
export const getQuestionId = fieldEl => {
    const containerEl = fieldEl.closest('[data-question-id]');
    return (containerEl && containerEl.getAttribute('data-question-id')) || '';
}
