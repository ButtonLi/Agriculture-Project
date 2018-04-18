/**
 * Created by llei on 2017/12/13.
 */

var new_element=document.createElement("script");
new_element.setAttribute("type","text/javascript");
new_element.setAttribute("src","./test.js");
document.body.appendChild(new_element);

function json2csv(jsonObj) {
    console.log(jsonObj);
    getChild(jsonObj);
    console.log(res);
    console.log("-----------------------");
    console.log(names);
}
var res="";
var names="";
function getChild(jsonObj) {
    names=names+jsonObj.name+"\n";
    if(jsonObj.children){
        var childs=jsonObj.children;
        var len=childs.length;
        for(var i=0;i<len;i++){
            getChild(childs[i]);
            res=res+jsonObj.name+","+childs[i].name+" child"+"\n";
        }
    }
}


