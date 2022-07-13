//--------------Validations Functions---------------//
const isValidtitle =  (title) => {
    return ["Mr", "Mrs", "Miss"].indexOf(title) === -1
}
const isValid = (value) => {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}
const isValidName = (name) => {
    if ((/^[A-Za-z_ ]+$/.test(name)))
        return true
}
const isValidPhone = (phone) => {
    if ((/^(\+\d{1,3}[- ]?)?\d{10}$/.test(phone)))
        return true
}
const isValidEmail = (email) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
        return true
}
const isValidPassword = (password) => {
    if ((/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/.test(password)))
        return true
}

const isValidRating = (rating) => {
    if((/^(1[1]|[1-5])$/.test(rating)))
    return true
}
     
           //------------------------Exports---------------------//
module.exports = {
    isValidtitle, isValid, isValidName ,isValidPhone, isValidEmail, isValidPassword,isValidRating
}   