var width = 1700;
var height = 750;
var img_w = 77;
var img_h = 90;

//将用来记录表格信息的表中的表格数与数据库中实际存在的表的数目进行比较，如果数目不相同，
//则调用addTableInfo()方法，对信息表进行更新
function treeCount(infoTreeObj,allTreesObj) {
    // console.log(infoTreeObj.nodes);
    // console.log(allTreesObj);
    // if(infoTreeObj.nodes[0]==null){
    //     infoTreeObj.nodes.length=0;
    // }
    var nodes = infoTreeObj.nodes;
    // var obj={name:""+"name",image:"table.jpg",description:"hahahah"};
    // nodes.push(obj);
    // console.log(nodes);
    //若长度不相等的话，则向infoTreeObj里添加或者删除信息
    if (nodes.length < allTreesObj.length) {
        console.log("长度小于所有树");
        console.log("call add function...");
        //长度小于所有树的数目的时候，调用addTableInfo方法
        addTableInfo(infoTreeObj,allTreesObj);
    }else if(nodes.length > allTreesObj.length){
        console.log("长度大于所有树");
        //长度大于所有树的数目的时候，调用removeTableInfo()方法
        removeTableInfo(infoTreeObj,allTreesObj);
    }else {
        console.log("长度等于所有树");
        //长度相等的话就在直接调用展示方法
        console.log(infoTreeObj);
        display(infoTreeObj);
    }

}

//addTableInfo()方法
function addTableInfo(infoTreeObj,allTreesObj) {
    var flag;
    var names=[];
    for(var i=0;i<allTreesObj.length;i++){
        flag=false;
        for(var j=0;j<infoTreeObj.nodes.length;j++){
            if(allTreesObj[i].name==infoTreeObj.nodes[j].name){
                flag=true;
                break;
            }
        }
        if(!flag){
            names.push(allTreesObj[i].name);
        }
    }
    // console.log(names);
    for(var i=0;i<names.length;i++){
        var obj={name:names[i],image:"table.jpg",description:"这是"+names[i]+"的描述"};
        infoTreeObj.nodes.push(obj);
        var source=infoTreeObj.nodes.length-1;
        //如果infoTree中的树不止一棵的话，就需要将新添加的树与
        // 其他树的信息进行对比，判断其是否和其他树之间存在关系
        if(source>0){
            console.log(source);
            var existingNodes=[];
            var nodes=infoTreeObj.nodes;
            //此循环是将infoTree中已经存在的树的名称全部存储到existingNodes中
            for(var j=0;j<nodes.length-1;j++){
                existingNodes.push(nodes[j].name);
            }
            //添加infoTree中的edges
            addEdges(infoTreeObj,allTreesObj,existingNodes,names[i]);
        }

    }
    //更新infoTreeObj之后，需要写回数据库
    //首先将jsonObject转换成json字符串
    var json=JSON.stringify(infoTreeObj);
    //调用updateTree方法，写回数据库
    updateTree(json,0);
    //写回数据库后，便可以调用display方法，展示
    console.log(infoTreeObj);
    display(infoTreeObj);

}
//removeTableInfo()方法
function removeTableInfo(infoTreeObj,allTreesObj) {
    console.log(infoTreeObj.nodes);
    console.log(allTreesObj);
    if(allTreesObj.length==0){
        //当数据库中不存在一棵树的时候，删除info表中所有的节点信息
        for(var i=0;i<infoTreeObj.nodes.length;i++){
            delete infoTreeObj.nodes[i];
        }
        infoTreeObj.nodes.length=0;
        //当数据库中不存在一棵树的时候，删除info表中所有边的信息
        for(var i=0;i<infoTreeObj.edges.length;i++){
            delete infoTreeObj.edges[i];
        }
        infoTreeObj.edges.length=0;
        //更新infoTreeObj之后，需要写回数据库
        //首先将jsonObject转换成json字符串
        var json=JSON.stringify(infoTreeObj);
        //调用updateTree方法，写回数据库
        updateTree(json,0);
        //写回数据库后，便可以调用display方法，展示
        console.log(infoTreeObj);
        display(infoTreeObj);
    }else{
        //删除不存在的节点信息
        for(var j=0;j<infoTreeObj.nodes.length;j++){
            var flag=false;
            for(var i=0;i<allTreesObj.length;i++){
                if(infoTreeObj.nodes[j].name==allTreesObj[i].name){
                    flag=true;
                    break;
                }
            }
            if(!flag){
                delete infoTreeObj.nodes[j];
                // infoTreeObj.nodes.length--;
                //该节点被删除后，应当删除其对应的边的关系
                // var edges=infoTreeObj.edges;
                for(var i=infoTreeObj.edges.length-1;i>=0;i--){
                    // console.log(infoTreeObj.edges[i].source+","+j);
                    if(infoTreeObj.edges[i].source==j){
                        // console.log(infoTreeObj.edges[i].source+","+infoTreeObj.edges[i].target);
                        delete infoTreeObj.edges[i];
                        // infoTreeObj.edges.length--;
                    }
                }
                var nodes=infoTreeObj.nodes;
                var edges=infoTreeObj.edges;
                var newObj={nodes:[],edges:[]};
                for(var i=0;i<nodes.length;i++){
                    if(nodes[i]!=null){
                        newObj.nodes.push(nodes[i]);
                    }
                }
                for(var i=0;i<edges.length;i++){
                    if(edges[i]!=null){
                        newObj.edges.push(edges[i]);
                    }
                }


            }
        }
        console.log(newObj);
        infoTreeObj=newObj;

        //更新infoTreeObj之后，需要写回数据库
        //首先将jsonObject转换成json字符串
        var json=JSON.stringify(infoTreeObj);
        //调用updateTree方法，写回数据库
        updateTree(json,0);
        //写回数据库后，便可以调用display方法，展示

        display(infoTreeObj);

    }


}

//获取所有表的名称
function getTableName(nodes) {
    var names=[];
    for(var i =0;i<nodes.length;i++){
        names.push(nodes[i].name);
    }
    addOption(names);
}

//动态添加select的option项
function addOption(names) {
    document.getElementById("tab1").options.length = 0;
    document.getElementById("tab2").options.length = 0;
    var op1=document.createElement("option");
    op1.appendChild(document.createTextNode("请选择..."));
    var op2=document.createElement("option");
    op2.appendChild(document.createTextNode("请选择..."));
    document.getElementById("tab1").appendChild(op1);
    document.getElementById("tab2").appendChild(op2);
    for(var i=0;i<names.length;i++){
        var op1=document.createElement("option");
        op1.appendChild(document.createTextNode(names[i]));
        var op2=document.createElement("option");
        op2.appendChild(document.createTextNode(names[i]));
        document.getElementById("tab1").appendChild(op1);
        document.getElementById("tab2").appendChild(op2);
    }
}
//remNodes 是为了记录节点信息，为了刷新使用
var remNodes;

//refreshDiv用来更新mainDiv中的数据
function refreshDiv() {
    // $("#mainDiv").empty();
    //
    // display(remNodes);

    window.location.href="./index.html";
}


//选择两个表格进行信息对比，当选择结束后执行此操作
function onSelectOver() {
    /*
    下面获取两个option中选定的表的名称
     */
   var selectItem1=document.getElementById("tab1");
   var selectItem2=document.getElementById("tab2");
   var selectIndex1=selectItem1.selectedIndex;
   var selectIndex2=selectItem2.selectedIndex;
   var val1=selectItem1.options[selectIndex1].text;
   var val2=selectItem2.options[selectIndex2].text;


    // if(val1=="请选择..." || val2=="请选择..." ){
    //     alert("请选择需要比较的表格");
    //     return;
    // }
    var tabNames=val1+"-"+val2;
    document.getElementById("hide").textContent=tabNames;
    // console.log(document.getElementById("hide").textContent);

    //获得到当前选定的值之后，将select选定值置为默认的第一个
    document.getElementById("tab1").options[0].selected=true;
    document.getElementById("tab2").options[0].selected=true;
    replaceDivWithNew();

}
//选择两个表格进行信息对比，当选择结束后执行此操作
function selectHistoryPage() {

    var s1=document.getElementById("tab1");
    var s2=document.getElementById("tab2");
    var sIndex1=s1.selectedIndex;
    var sIndex2=s2.selectedIndex;
    var value1=s1.options[sIndex1].text;
    var value2=s2.options[sIndex2].text;

    if(value1=="请选择..." || value2=="请选择..."){
        alert("请选择需要比较的表格");
        return;
    }

    var tabNames=value1+"-"+value2;
    document.getElementById("hide").textContent=tabNames;
    // console.log(document.getElementById("hide").textContent);

    //获得到当前选定的值之后，将select选定值置为默认的第一个
    document.getElementById("tab1").options[0].selected=true;
    document.getElementById("tab2").options[0].selected=true;

    replaceDivWithHis();
}

//该方法用来处理standardTreePro数据的，
//将标准的树存储到数组中，方便后面进行数据查询的时候使用
var splitItem;//全局变量，存储标准树，方便后续调用
function standardTreePro(standardData) {
    // console.log(standardData);
    //用splitItem来存放每棵树
    splitItem=standardData.split("%");
}

//将同义词词库读出到后台，方便后面进行同义词替换使用
var synonymSplits;//全局变量，存储同义词词表，方便后续调用
function synonymPro(synonymData) {
    // console.log(synonymData);
    synonymSplits=synonymData.split("%");
}

//调用该方法为infoTree添加edges
function addEdges(infoTreeObj,allTreesObj,existingNodes,name) {
    // console.log(existingNodes);
    var source=infoTreeObj.nodes.length-1;
    var addedNode;
    //获取到刚刚添加的这棵树的信息，包括名称以及children
    for(var i=0;i<allTreesObj.length;i++){
        if(allTreesObj[i].name==name){
            addedNode=allTreesObj[i];
        }
    }
    for(var i=0;i<existingNodes.length;i++){
        var tmpName=existingNodes[i];
        // console.log(existingNodes);
        for(var j=0;j<allTreesObj.length;j++){
            if(tmpName==allTreesObj[j].name){
                sourceNames=[];
                targetNames=[];
                console.log(allTreesObj[j]);
                //调用treeCompare方法，对二者关系进行对比，返回关系类型
                var relation=treeCompare(addedNode,allTreesObj[j]);
                console.log(relation);
                if(relation!="无关系"){
                    var obj={source:source,target:j,relation:relation};
                    infoTreeObj.edges.push(obj);
                }
            }
        }
    }

}
//此方法用于对比两棵树，若节点之间存在关系（下面定义），则返回关系
/*
关系的定义：
该出给出关系的三种定义，即等同关系，父子关系，兄弟关系
等同关系：通过同义词词表，两者对应到同一个标准词汇上，即称作等同关系
父子关系：通过同义词词表，二者对应到标准树上，所属父子，即为父子关系
兄弟关系：通过同义词词表，二者对应到标准树上，所属同一个根节点的邻居，即为兄弟关系
 */
var sourceNames=[];
var targetNames=[];
function treeCompare(sourceTree,targetTree) {
    var sourceRoot=sourceTree.name;
    var targetRoot=targetTree.name;
    synonymCall(sourceRoot,sourceNames);
    var sourceChildren=sourceTree.children;
    console.log(sourceChildren);
    for(var i=0;i<sourceChildren.length;i++){
        synonymCall(sourceChildren[i].name,sourceNames);
    }
    synonymCall(targetRoot,targetNames);
    var targetChildren=targetTree.children;
    console.log(targetChildren);
    for(var i=0;i<targetChildren.length;i++){
        synonymCall(targetChildren[i].name,targetNames);
    }
    console.log(sourceNames);
    console.log(targetNames);
    //将关系确认功能单独封装成一个函数relationVerify，方便理解
    var relation=relationVerify(sourceNames,targetNames);
    return relation;
}

//该方法用来确定两棵树的关系，传入两棵树的name信息，返回一个relation
function relationVerify(sourceNames,targetNames) {
    var relation;
    for(var j=0;j<sourceNames.length;j++){
        for(var k=0;k<targetNames.length;k++){
            if(sourceNames[j]==targetNames[k]){
                relation="等价关系";
                return relation;
            }
            var sourceP;
            var targetP;
            for(var i=0;i<splitItem.length;i++){
                var str=splitItem[i];
                if(str.indexOf(sourceNames[j])!=-1){
                    sourceP=str.split(",")[0];
                    if(sourceP==targetNames[k]){
                        relation="父子关系";
                        return relation;
                    }
                }
                if(str.indexOf(targetNames[k])!=-1){
                    targetP=str.split(",")[0];
                    if(targetP==sourceNames[j]){
                        relation="父子关系";
                        return relation;
                    }
                }
            }
            if(sourceP==targetP){
                relation="兄弟关系";
                return relation;
            }
        }
    }
    return "无关系";
}

//该方法用来将用户树的各个节点数据映射成标准数据，并且分别存储在sourceNames,targetNames中
function synonymCall(nodeName,names) {
    for(var i=0;i<synonymSplits.length;i++){
        var str=synonymSplits[i];
        // nodeName=nodeName+"/";
        if(str.indexOf(nodeName)!=-1){
            if(str.length==nodeName.length){
                if(names==sourceNames){
                    sourceNames.push(synonymSplits[i]);
                    break;
                }
                else {
                    targetNames.push(synonymSplits[i]);
                    break;
                }
            }else{
                var nodeName1="/"+nodeName+"/";
                var nodeName2=":"+nodeName+"/";
                var nodeName3=":"+nodeName;
                if(str.indexOf(nodeName1)!=-1 || str.indexOf(nodeName2!=-1)){
                    if(names==sourceNames){
                        sourceNames.push(str.split(":")[0]);
                        break;
                    }
                    else {
                        targetNames.push(str.split(":")[0]);
                        break;
                    }
                }else {
                    var len=str.length-nodeName3.length;
                    if(str.lastIndexOf(nodeName3)==len){
                        if(names==sourceNames){
                            sourceNames.push(str.split(":")[0]);
                            break;
                        }
                        else {
                            targetNames.push(str.split(":")[0]);
                            break;
                        }
                    }

                }
            }
        }
    }
}
function display(jsonObj) {

    remNodes=jsonObj;
    var svg = d3.select("#mainDiv").append("svg")
        .attr("width",width)
        .attr("height",height);
    var root=jsonObj;

    var nodes=root.nodes;
    //获取所有的表的名称
    getTableName(nodes);



    var force = d3.layout.force()
        .nodes(root.nodes)
        .links(root.edges)
        .size([width,height])
        .linkDistance(200)
        .charge(-1500)
        .start();

    var label_text_1 = svg.append("text")
        .attr("class","labeltext")
        .attr("x",10)
        .attr("y",16)
        .text("运动状态：开始");

    var label_text_2 = svg.append("text")
        .attr("class","labeltext")
        .attr("x",10)
        .attr("y",40)
        .text("拖拽状态：结束");


    var edges_line = svg.selectAll("line")
        .data(root.edges)
        .enter()
        .append("line")
        .style("stroke","#ccc")
        .style("stroke-width",1);

    var edges_text = svg.selectAll(".linetext")
        .data(root.edges)
        .enter()
        .append("text")
        .attr("class","linetext")
        .text(function(d){
            return d.relation;
        });

    var drag = force.drag()
        .on("dragstart",function(d,i){
            d.fixed = true;    //拖拽开始后设定被拖拽对象为固定
            label_text_2.text("拖拽状态：开始");
        })
        .on("dragend",function(d,i){
            label_text_2.text("拖拽状态：结束");
        })
        .on("drag",function(d,i){
            label_text_2.text("拖拽状态：进行中");
        });

    var nodesG=svg.selectAll("g")
        .data(root.nodes)
        .enter()
        .append("g")
        .on("click",function (d) {
            var name=d.name;
            var description=d.description;
            document.getElementById("tabName").style.visibility="visible";
            document.getElementById("tabDes").style.visibility="visible";
            document.getElementById("nameContent").innerText=name+"\n";
            document.getElementById("desContent").innerText=description;
            document.getElementById("nameContent").style.visibility="visible";
            document.getElementById("desContent").style.visibility="visible";
        });

    var nodes_img=nodesG.append("image")
        .attr("width",img_w)
        .attr("height",img_h)
        .attr("xlink:href",function(d){
            return d.image;
        })
        .on("mouseover",function(d,i){
            //显示连接线上的文字
            edges_text.style("fill-opacity",function(edge){
                if( edge.source === d || edge.target === d ){
                    return 1.0;
                }
            });
        })
        .on("mouseout",function(d,i){
            //隐去连接线上的文字
            edges_text.style("fill-opacity",function(edge){
                if( edge.source === d || edge.target === d ){
                    return 1.0;
                }
            });
        })
        .on("dblclick",function(d,i){
            d.fixed = false;
        })
        .call(drag);

    var text_dx = -20;
    var text_dy = 20;
    var nodes_text = nodesG.append("text")
        .attr("class","nodetext")
        .attr("dx",text_dx)
        .attr("dy",text_dy)
        .text(function(d){
            return d.name;
        });
    //力学图运动开始时
    force.on("start", function(){
        label_text_1.text("运动状态：开始");
    });
    //力学图运动结束时
    force.on("end", function(){
        label_text_1.text("运动状态：结束");
    });
    force.on("tick", function(){
        //修改标签文字
        label_text_1.text("运动状态：进行中");
        //限制结点的边界
        root.nodes.forEach(function(d,i){
            d.x = d.x - img_w/2 < 0     ? img_w/2 : d.x ;
            d.x = d.x + img_w/2 > width ? width - img_w/2 : d.x ;
            d.y = d.y - img_h/2 < 0      ? img_h/2 : d.y ;
            d.y = d.y + img_h/2 + text_dy > height ? height - img_h/2 - text_dy : d.y ;
        });
        //更新连接线的位置
        edges_line.attr("x1",function(d){ return d.source.x; });
        edges_line.attr("y1",function(d){ return d.source.y; });
        edges_line.attr("x2",function(d){ return d.target.x; });
        edges_line.attr("y2",function(d){ return d.target.y; });
        //更新连接线上文字的位置
        edges_text.attr("x",function(d){ return (d.source.x + d.target.x) / 2 ; });
        edges_text.attr("y",function(d){ return (d.source.y + d.target.y) / 2 ; });

        //更新结点图片和文字
        nodes_img.attr("x",function(d){ return d.x - img_w/2; });
        nodes_img.attr("y",function(d){ return d.y - img_h/2; });

        nodes_text.attr("x",function(d){ return d.x });
        nodes_text.attr("y",function(d){ return d.y + img_w/2; });
    });
}




