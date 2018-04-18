/**
 * Created by llei on 2017/12/25.
 */

function updateTree(json,id) {
    $.ajax({
        url:"/api/tree",
        data:{tree:json,id:id},
        type:"PUT",
        success:function (data) {
            if(data.ret){
                if(data.data!=null){
                    console.log(data.data);
                }
            }else{
                alert(data.message);
            }
        },
        error:function (data) {
            console.log(data.message);
        }
    })
}

function createTree(json,id) {
    $.ajax({
        url: "/api/tree",
        data: {tree: json,id:id},
        type: "POST",
        // dataType: "JSON",
        success: function (data) {
            if (data.ret) {
                if (data.data != null) {
                    //返回的是插入树的id
                    console.log(data.data);
                    if(data.data==0){
                        startGet();
                    }
                }
            }else {
                // alert(data.message);
                if(data.message=="未知错误"){
                    updateTree(json,id);
                }
            }
        },
        error: function (data) {
            console.log(data.message);
        }
    });
}
function getTreeById(id) {
    var jsonObj=new Object();
    var url="/api/tree/"+id;
    $.ajax({
        url:url,
        type:"GET",
        dataType:"JSON",
        success:function (data) {
            if(data.ret){
                if(data.data!=null){
                    var treeData=data.data;
                    var json=treeData.json;
                    jsonObj=JSON.parse(json);
                    receiveObj(jsonObj);
                    // display(jsonObj);
                }
            }
        },
        error:function (data) {
            console.log(data.message);
        }
    });


}

//在初始化界面（加载index.html的时候），调用此方法获得信息表以及所有表格信息
//接着调用treeCount方法，判断信息表中树的个数与真实表格数量是否相同
var infoTreeObj;
var allTreesObj=[];
function startGet() {

    $.ajax({
        url: "/api/trees",
        type: "GET",
        dataType: "JSON",
        success: function (data) {
            if (data.ret) {
                if (data.data != null) {
                    var treeData = data.data;
                    var flag=false;
                    for(var i=0;i<treeData.length;i++){
                        var id=treeData[i].id;
                        if(id==0){
                            flag=true;
                        }
                        if(i==treeData.length-1 && !flag){
                            var obj={nodes:[],edges:[]};
                            var json=JSON.stringify(obj);
                            createTree(json,0);
                            return;
                        }

                    }
                    for (var i=0;i<treeData.length;i++){
                        var id=treeData[i].id;
                        if(id==0){
                            var json=treeData[i].json;
                            var jsonObj=JSON.parse(json);
                            infoTreeObj=jsonObj;
                        }else if(id=="standardTree"){
                            // console.log("standardTree");
                            //调用mainJS.js中的standardTreePro方法，对标准树进行处理
                            standardTreePro(treeData[i].json);
                        }else if(id=="synonym"){
                            // console.log("synonym");
                            synonymPro(treeData[i].json);
                        }else{
                            var tmp=parseInt(id);
                            // console.log(isNaN(tmp));
                            if(!isNaN(tmp)){
                                var json=treeData[i].json;
                                var jsonObj=JSON.parse(json);
                                allTreesObj.push(jsonObj);
                            }

                        }

                    }
                    console.log(allTreesObj);
                    //调用mainJS.js中的treeCount，来判断info.json里面的信息是否记录所有tree
                    // console.log("treeCount function...");
                    treeCount(infoTreeObj,allTreesObj);
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
var allTrees=[];
function getAllTrees() {
    $.ajax({
        url: "/api/trees",
        type: "GET",
        dataType: "JSON",
        success: function (data) {
            if (data.ret) {
                if (data.data != null) {
                    var treeData = data.data;
                    // allTrees=treeData;
                    // console.log(treeData);
                    // console.log(typeof(treeData));
                    for (var i=0;i<treeData.length;i++){
                        // console.log(i);
                        var id=treeData[i].id;

                        var tmp=parseInt(id);
                        // console.log(isNaN(tmp));
                        if(!isNaN(tmp) && tmp!=0){
                            allTrees.push(treeData[i]);
                        }
                    }
                    // console.log(allTrees);
                    //调用newPageJS.js中的sortByName方法，对选取的结果进行筛选
                    sortByName(allTrees);
                    // for(var i =0;i<treeData.length;i++) {
                    //     var json=treeData[i].json;
                    //     var id=treeData[i].id;
                    //     var jsonObj=JSON.parse(json);
                    //     if(id==0){
                    //         continue;
                    //     }
                    // }
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
    getAllTrees();
    var json=json;
    var id=id;
    $.ajax({
        url:"/api/tree",
        data: {tree: json,id:id},
        type:"PUT",
        success:function(data){
            // if(data.message=="update failed..."){
            //     createTree(json,id);
            // }else {
            //     // alert(data.message);
            //     alert("..........");
            // }
            createTree(json,id);

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





