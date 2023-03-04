
function returnString(template){   
    return `${template}`
}

function setTitle(title){   
    this.pageTitle = title
}

function getCookie(cookie) {
    // let userSession = req.cookies;
    // try to get cookie server side for
    return cookie;
}

function section (name, options) { 
if (!this._sections) this._sections = {};
    this._sections[name] = options.fn(this); 
    return null;
}

function ifEquals(arg1, arg2, options) {    
    if (arg1 === undefined) {
        // if the ar1 does not exist return 1st block
        return options.fn(this) 
    }else{
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    }
    
}

function generateLink (options) {
    return '<a href="' + options['hash']['href'] + '">' + options['hash']['title'] + '</a>';
}

function isInRole(userRole, rolename) {
    console.log("userRole", userRole)
    console.log("rolename", rolename)
    if (rolename == undefined) {
        return true
    }else{
        return userRole == rolename
    }    
}

function getMenuItems(){
    var menuItems = require("../config/menu.json");
    return menuItems;
}



module.exports = { returnString, getCookie, section, ifEquals, returnString, generateLink, isInRole, getMenuItems };

