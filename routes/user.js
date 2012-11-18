
/*
 * GET users listing.
 */
var TITLE_OF_SIGNUP_PAGE = 'Sign up',
    SIGNUP_VIEW_NAME = 'signup',
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
        console.log(data.username);
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
 
function renderSignUp(req, res, errors){
    res.render(SIGNUP_VIEW_NAME, { title: TITLE_OF_SIGNUP_PAGE,  errors : errors} );
} 
 
exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.signup = function(req, res){
	renderSignUp(req, res, EMPTY_ERRORS);
};

exports.post = function(req, res){
    var result = validateSignUp(req.body);
    if(result.success){    
        res.redirect(301, '/login');
    }else{
       renderSignUp(req, res, result);
    }            
}

exports.login = function(req, res){
    res.send(200);
}