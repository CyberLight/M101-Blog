var jspatterns = {};
jspatterns.errors = {};
jspatterns.contracts = {};

jspatterns.errors.WrongConstructorArgumentCountError = function (message) {
	this.message = message;
}

jspatterns.errors.WrongParameterTypeError = function (paramName, paramType) {
	this.message = 'Wrong type of parameter "' + paramName +'". Parameter type must be "' + paramType + '"';
}

jspatterns.errors.WrongTypeError = function (paramName, paramType) {
	this.message = 'Wrong type of object "' + paramName +'". Object type must be "' + paramType + '"';
}

jspatterns.errors.WrongCountOfMethodArgumentsError = function (methodName){
	this.message = "Wrong count of " + methodName + "method arguments";
}

jspatterns.errors.MethodNotImplementedError = function (methodName){
	this.message = "Method '" + methodName + "' not implemented";
}

jspatterns.errors.WrongParameterValueError = function (paramName, paramValue){
	this.message = 'Parameter' + paramName + ' has wrong value "' + paramValue + '"';
}

jspatterns.errors.WrongConstructorArgumentCountError.prototype = new Error();
jspatterns.errors.WrongParameterTypeError.prototype = new Error();
jspatterns.errors.WrongTypeError.prototype = new Error();
jspatterns.errors.WrongCountOfMethodArgumentsError.prototype = new Error();
jspatterns.errors.MethodNotImplementedError.prototype = new Error();
jspatterns.errors.WrongParameterValueError.prototype = new Error();

jspatterns.utils = {};

jspatterns.utils.isString = function(o){
	 return typeof (o.valueOf())  == 'string';
}

jspatterns.utils.isInstanceOf = function(o, type){
		return  o.constructor === type;
}

jspatterns.utils.hasMethod = function(o, methodName){
		return !!(o[methodName] || typeof(o[methodName]) === 'function');		
}

jspatterns.contracts.Interface = function (objectName, interfaceMethods){
	var methods = [],
		name = objectName,
		getName = function(){
			return name;
		};
	
	if(arguments.length!=2){
		throw new jspatterns.errors.WrongConstructorArgumentCountError("Parameters count can't be less then 2!");
	}
	
	if(typeof(objectName) !== 'string'){
		throw new jspatterns.errors.WrongParameterTypeError('objectName', 'string');
	}
	
	for(var i =0, len = interfaceMethods.length; i < len; i++){
		var method = interfaceMethods[i];
		if(!jspatterns.utils.isString(method)){
			throw new jspatterns.errors.WrongTypeError('method name', 'string');
		}
		methods.push(interfaceMethods[i]);
	}	
		
	this.methods = methods;
	this.name = getName();
};

jspatterns.contracts.Interface.ensureImplements = function(objectToInspect){
	var beginInterfacesArgumentIndex = 1;
	
	if(!objectToInspect)
		throw new jspatterns.errors.WrongParameterValueError('objectToInspect', objectToInspect);
	
	if(arguments.length<2){
		throw new jspatterns.errors.WrongCountOfMethodArgumentsError('Interface.ensureImplements');
	}
	
	for(var i = beginInterfacesArgumentIndex, len = arguments.length; i < len; i++){
		var interface = arguments[i];
		if(!jspatterns.utils.isInstanceOf(interface, jspatterns.contracts.Interface))
			throw new jspatterns.errors.WrongParameterTypeError('interface','Interface');
		for(var m = 0, mlen = interface.methods.length; m < mlen; m++ ){
			var method = interface.methods[m];
			if(!jspatterns.utils.hasMethod(objectToInspect, method)){
				throw new jspatterns.errors.MethodNotImplementedError(method);
			}
		}
	}
	
	return true;
};

exports.jspatterns = jspatterns;