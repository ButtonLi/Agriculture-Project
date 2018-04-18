/**
 * Created by Xin_Li on 2017/10/15.
 */

//api.js中引用dndtree.js
var new_element=document.createElement("script");
new_element.setAttribute("type","text/javascript");
new_element.setAttribute("src","./dndtree1.js");
document.body.appendChild(new_element);


var id;
var treeJson;

function createTree(json,id) {

    $.ajax({
        url: "/api/tree",
        data: {tree: json,id:id},
        type: "POST",
        // dataType: "JSON",
        success: function (data) {
            if (data.ret) {
                if (data.data != null) {
                    console.log(data.data)
                }
            }else {
                alert(data.message)
            }
        },
        error: function (data) {
            console.log(data.message)
        }
    })
}
function getAllTrees() {
    $.ajax({
        url: "/api/trees",
        type: "GET",
        dataType: "JSON",
        success: function (data) {
            var obj;
            if (data.ret) {
                if (data.data != null) {
                    var treeData = data.data;
                    for(var i =0;i<treeData.length;i++) {
                        //console.log(treeData[i]);
                        id = treeData[i].id;
                        if(id==2){
                            receiveSourceData(treeData[i].json);
                        }
                        else{
                            treeJson = treeData[i].json;
                            var jsonObj1=$.parseJSON(treeJson);
                            if(id==0){
                                //console.log(jsonObj1);
                                dataTree(jsonObj1);
                            }
                            else if(id==1){
                                display(jsonObj1);
                            }
                            else{
                                //console.log(jsonObj1);
                            }
                        }


                    }
                }
            }else {
                alert(data.message)
            }

        },
        error: function (data) {
            console.log(data.message);
        }
    })
}


function saveAllTree() {
    var tree=saveTree();
    var tree=returnTree(tree);
    var json=JSON.stringify(tree);
    console.log(json);
    var id=1;
    $.ajax({
        url:"/api/tree",
        data: {tree: json,id:id},
        type:"PUT",
        success:function(){
            alert("Modify succeed！");
        },
        error:function (data) {
            console.log(data.message);
        }
    })
}

function saveTreeFromWeb(json,id) {
    console.log("function called...");
    var json=json;
    var id=id;
    // var jsonObj=JSON.parse(json);
    // json=JSON.stringify(jsonObj);
    $.ajax({
        url:"/api/tree",
        data: {tree: json,id:id},
        type:"PUT",
        success:function(data){
            if(data.message=="update failed..."){
                createTree(json,id);
            }else {
                alert(data.message);
            }

        },
        error:function (data) {
            console.log(data.message);
        }
    })
}


function returnTree(rootNode) {
    delete rootNode.depth;
    delete rootNode.id;
    delete rootNode.x;
    delete rootNode.x0;
    delete rootNode.y;
    delete rootNode.y0;
    removeParent(rootNode);
    function removeParent(rootNode) {
        console.log(rootNode);
        if(rootNode.children!=null || rootNode._children!=null){
            var children=rootNode._children==null?rootNode.children:rootNode._children;
            for(var i=0;i<children.length;i++){
                var child=children[i];
                delete rootNode.depth;
                delete child.parent;
                delete child.x;
                delete child.x0;
                delete child.y;
                delete child.y0;
                delete child.id;
                if(child.children){
                    removeParent(child);
                }
            }
        }

    }
    //console.log(rootNode);
    return rootNode;
}






