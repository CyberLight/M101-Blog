
/*
 * GET users listing.
 */
var services = require('../lib/data/services').services;
    TITLE_OF_SIGNUP_PAGE = 'Sign up',
    TITLE_OF_LOGIN_PAGE = 'Login'
    SIGNUP_VIEW_NAME = 'signup',
    LOGIN_VIEW_NAME = 'login',
    EMPTY_ERRORS = {"username-error" : "", 
                   "password-error" : "",
                   "verify-error" : "",
                   "email-error" : "",
                   "success" : true };
 
function validateSignUp(data){
    var validationRules = [],
        validationResponse = {};
    
    validationRules.push(function(data){ 
        var result = {};
        result["success"] = new RegExp(/^[a-zA-Z0-9_-]{3,20}$/i).test(data.username);
        result["error"] = !result.success ? "invalid username. try just letters and numbers" : "";
        result["type"] = "username-error";
        return result; 
    });
     
    validationRules.push(function(data){ 
        var result = {};
        result["success"] = new RegExp(/^.{3,20}$/i).test(data.password);
        result["error"] = !result.success ? "invalid password" : "";
        result["type"] = "password-error";
        return result; 
    });
     
    validationRules.push(function(data){ 
        var result = {};        
        result["success"] = (data.email && data.email.length > 0) ? new RegExp(/^[\S]+@[\S]+\.[\S]+$/i).test(data.email) : true;
        result["error"] = !result.success ? "invalid email address" : "";
        result["type"] = "email-error";
        return result;
    });
     
    validationRules.push(function(data){ 
        var result = {};       
        result["success"] = (data.verify && data.password) && (data.verify.length && data.password.length) 
                            ? data.verify == data.password : false;
        result["error"] = !result.success ? "password must match" : "";
        result["type"] = "verify-error";
        return result;
    });
     
    var success = true;
        
    for(var i=0, len=validationRules.length; i<len; i++){
        var result = validationRules[i](data);
        validationResponse[result.type] = result.error;
        success &= result.success;
    }    
    
    validationResponse["success"] = success;
    return validationResponse;
}
 
function renderSignUp(req, res, errors, user){
    var defUser = { 
        username : '', 
        password : '', 
        verify : '', 
        email : ''
    },
    formUser = (user ? user : defUser);
    res.render(SIGNUP_VIEW_NAME, { title: TITLE_OF_SIGNUP_PAGE,  errors : errors, "user" : formUser} );
} 

function renderLogin(req, res, errors, user){
    var defUser = { 
            username : '', 
            password : '' 
    },
    formUser = (user ? user : defUser);
    res.render(LOGIN_VIEW_NAME, { title: TITLE_OF_LOGIN_PAGE, errors : errors, user : formUser} );
} 
 
exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.signup = function(req, res){
	renderSignUp(req, res, EMPTY_ERRORS);
};

exports.postSignUp = function(req, res){
    var userData = req.body.user,
        result = validateSignUp(userData);
    
    if(result.success){
        services.getUserService(function(err, us){
            var data = req.body.user,
                user = {_id : data.username, password : data.password, email : data.email};
            us.createUser(user, function(err, users){
                if(err){
                    result['form-error'] = err.message;
                    renderSignUp(req, res, result, userData);
                }else{
                    res.redirect(301, '/login');
                }
            });
        });
    }else{
       renderSignUp(req, res, result, userData);
    }
};

exports.login = function(req, res){
    renderLogin(req, res, EMPTY_ERRORS);
};

exports.postLogin = function(req, res){
    var userData = req.body.user,
        errors = {};
    services.getUserService(function(err, us){
        var userCredentials = {_id : userData.username, password : userData.password};
        us.validateLogin(userCredentials, function(err, isValid){
           if(isValid){
              res.redirect(301, '/');
           }else{
              errors['form-error'] = err.message;
              renderLogin(req, res, errors, userData);
           }
        });
    });
};