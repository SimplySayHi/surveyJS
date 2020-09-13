
export const isFieldForChangeEvent = fieldEl => {
    return fieldEl.matches('select, [type="radio"], [type="checkbox"], [type="file"]');
}
