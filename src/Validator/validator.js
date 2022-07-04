//for internModel
// const isValidName = (name) => {
//     if (!(/^[A-Za-z_ ]+$/.test(name)))
//         return true
// };
//for collegeName
const isValidCollegeName = (name) => {
    if (/^[a-z]+$/.test(name))
        return true
};
const isValid = (value) => {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true

}

const isValidUrl = (logoLink) => {
   // if (/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/.test(logoLink))
   if (/(https?:\/\/.*\.(?:png|jpg))/i.test(logoLink))
        return true
}
const isValidMobile = (mobile) => {
    if (/^(\+\d{1,3}[- ]?)?\d{10}$/.test(mobile))
        return true
}
const isValidEmail = (email) => {
    if (/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email.trim()))
        return true
}
module.exports = {
     isValid, isValidUrl, isValidMobile, isValidEmail,isValidCollegeName
}