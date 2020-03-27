/* Populate script retrieves value from a JSON and automatically populates Input fields */

/*! populate.js v1.0.2 by @dannyvankooten | MIT license */
!function(e){
	var t=function(e,o,n){
		for(var a in o)
			if(o.hasOwnProperty(a)){
				var i=a,r=o[a];
				if(void 0===r&&(r=""),null===r&&(r=""),void 0!==n&&(i=n+"["+a+"]"),r.constructor===Array)
					i+="[]";
				else if("object"==typeof r){
					t(e,r,i);
					continue
				}
				var c=e.elements.namedItem(i);
				if(c)
					switch(c.type||c[0].type){
						default:
							c.value=r;
							break;
						case"radio":
						case"checkbox":
							if(c.length)
								for(var l=0;l<c.length;l++)
									c[l].checked=r.indexOf(c[l].value)>-1;
							else c.checked=r.indexOf(c.value)>-1;
							break;
						case"select-multiple":
							for(var f=r.constructor==Array?r:[r],s=0;s<c.options.length;s++)
								c.options[s].selected|=f.indexOf(c.options[s].value)>-1;
							break;
						case"select":
						case"select-one":
							c.value=r.toString()||r;
							break;
						case"date":
							c.value=new Date(r).toISOString().split("T")[0]
					}
			}
	};
	"function"==typeof define&&"object"==typeof define.amd&&define.amd?define(function(){return t}):"undefined"!=typeof module&&module.exports?module.exports=t:e.populate=t
}(this);