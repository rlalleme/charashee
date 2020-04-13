/* Populate script retrieves value from a JSON and automatically populates Input fields */

/*! populate.js v1.0.2 by @dannyvankooten | MIT license */
!function(e){
	var t=function(e,o,n){
		if(!(e instanceof HTMLElement)){
			console.log("Warning: first arguement is not an HTML element, skip it");
			return;
		}
		
		for(var a in o){
			if(o.hasOwnProperty(a)){
				var i=a,r=o[a];
				if(void 0===r&&(r=""),null===r&&(r=""),void 0!==n&&(i=n+"["+a+"]"),r.constructor===Array){
					i+="[]";
				}else if("object"==typeof r){
					t(e,r,i);
					continue
				}
				var c=e.elements.namedItem(i);
				if(c)
					switch(c.type||c[0].type){
						case"checkbox":
							c.checked=r;
							break;
						default:
							c.value=r;
							break;
					}
			}
		}
	};
	"function"==typeof define&&"object"==typeof define.amd&&define.amd?define(function(){return t}):"undefined"!=typeof module&&module.exports?module.exports=t:e.populate=t
}(this);