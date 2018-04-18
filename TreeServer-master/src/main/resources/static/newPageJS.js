/**
 * Created by llei on 2018/1/2.
 */

//根据选中的表格名称，筛选出我们所需要对比的两个表格
function sortByName(allTrees) {
    console.log(allTrees);
    var nameText=document.getElementById("hide").textContent;
    // console.log(nameText);
    var names=nameText.split("-");
    var treeLeftObj;
    var treeRightObj;
    for(var i=0;i<allTrees.length;i++){
        var json=allTrees[i].json;
        var jsonObj=JSON.parse(json);
        if(jsonObj.name==names[0]){
            treeLeftObj=jsonObj;
        }
        if(jsonObj.name==names[1]){
            treeRightObj=jsonObj;
        }
    }

    //提取两张表的信息，在table中展示出来
    // tableDisplay(treeLeftObj,treeRightObj);
    relatedInfoDisplay(treeLeftObj,treeRightObj);
    //筛选出两张表之后，将其中信息读取出来，合成一个object，方便展示
    createObj(treeLeftObj,treeRightObj);
}


/*
sort出来两张我们需要比较的表格后，需要将其使用表格展示出来，但是
由于空间有限，我们可以将有关系的节点关系展示出来
对于那些大量的没有关系的节点不予展示
这个方法是1.0版本，即展示出来一个表格的形式，存在大量的冗余无用的信息
接下来的一个方法relatedInfoDisplay仅仅展示有关系的节点信息，以及其对应的关系
*/

function tableDisplay(treeLeftObj,treeRightObj) {
    var nameLeft=treeLeftObj.name;
    var nameRight=treeRightObj.name;
    var c=document.getElementById("myCanvas");
    var ctx=c.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(c.width,c.height);
    ctx.fillText(nameRight,c.width/3,c.height/3);
    ctx.fillText(nameLeft,c.width/11,c.height/5*4);
    ctx.stroke();

    //表的横向填充，即右边表的名称字段
    var row=document.getElementById("row1");
    var childRight=treeRightObj.children;
    for(var i=0;i<childRight.length;i++){
        var newCell=row.insertCell();
        newCell.innerHTML=childRight[i].name;
    }

    //表的纵向填充，即左边表的名称字段填充，同时要注意与横轴对齐
    var table=document.getElementById("tab");
    var childLeft=treeLeftObj.children;
    for(var i=0;i<childLeft.length;i++){
        var newRow=table.insertRow();
        var newCell=newRow.insertCell();
        newCell.innerHTML=childLeft[i].name;
        for(var j=0;j<childRight.length;j++){
            newCell=newRow.insertCell();
        }

    }
}

var relations=[];
function relatedInfoDisplay(treeLeftObj,treeRightObj) {
    getNames(treeLeftObj,treeRightObj);
    //调用该方法填充relations数组
    relationVerify();

}


var sourceNames=[];
var targetNames=[];
var stdSourceNames=[];
var stdTargetNames=[];
//该方法用来填充sourceNames数组，targetNames数组
//即获取树上所有节点的name属性
function getNames(treeLeftObj,treeRightObj) {
    sourceNames.push(treeLeftObj.name);
    targetNames.push(treeRightObj.name);
    var sourceChildren=treeLeftObj.children;
    var targetChildren=treeRightObj.children;
    for(var i=0;i<sourceChildren.length;i++){
        sourceNames.push(sourceChildren[i].name);
    }
    for(var i=0;i<targetChildren.length;i++){
        targetNames.push(targetChildren[i].name);
    }
    //获得两棵树上的所有节点后，调用synonymCall方法，
    // 来填充stdSourceNames以及stdTargetNames两个数组
    // console.log(sourceNames);
    // console.log(targetNames);
    synonymCall();
}
//该方法用来将用户树的各个节点数据映射成标准数据，
// 并且分别存储在stdSourceNames,stdTargetNames中
function synonymCall() {
    for(var i=0;i<sourceNames.length;i++){
        var name=sourceNames[i];
        for(var j=0;j<synonymSplits.length;j++){
            var str=synonymSplits[j];
            if(str.indexOf(name)!=-1){
                if(str.length==name.length){
                    var tmp=name+"-"+name;
                    stdSourceNames.push(tmp);
                }else {
                    //前三种情况未一般性情况，可以直接判断该字符串是完整的，直接截取“：”之前的那个标准，存储起来
                    var nodeName1="/"+name+"/";
                    var nodeName2=":"+name+"/";
                    var nodeName3=name+":";
                    //下面两种是一些特殊情况，
                    // 如该字符串位于“：”之后的第一个位置，且存在一种可能，该字符串是另一个字符串的子串
                    //又如该字符串位于该synonymsplit最后一个位置，这时候还应该考虑到该字符串位于synonymsplit中间的某个位置，
                    // 且为某个name的子串，如：/namexxxxxx/ 此种情况
                    var nodeName4=":"+name;
                    var nodeName5="/"+name;
                    if(str.indexOf(nodeName1)!=-1 || str.indexOf(nodeName2)!=-1 || str.indexOf(nodeName3)!=-1){
                        var tmp=str.split(":")[0]+"-"+name;
                        stdSourceNames.push(tmp);
                    }
                    else{
                        var len1=str.length-nodeName4.length;
                        if(str.lastIndexOf(nodeName4)==len1){
                            var tmp=str.split(":")[0]+"-"+name;
                            stdSourceNames.push(tmp);
                        }
                        var len2=str.length-nodeName5.length;
                        if(str.lastIndexOf(nodeName5)==len2){
                            var tmp=str.split(":")[0]+"-"+name;
                            stdSourceNames.push(tmp);
                        }
                    }
                }
            }
        }
    }
    for(var i=0;i<targetNames.length;i++){
        var name=targetNames[i];
        for(var j=0;j<synonymSplits.length;j++){
            var str=synonymSplits[j];
            if(str.indexOf(name)!=-1){
                if(str.length==name.length){
                    var tmp=name+"-"+name;
                    stdTargetNames.push(tmp);
                }else {
                    //前三种情况未一般性情况，可以直接判断该字符串是完整的，直接截取“：”之前的那个标准，存储起来
                    var nodeName1="/"+name+"/";
                    var nodeName2=":"+name+"/";
                    var nodeName3=name+":";
                    //下面两种是一些特殊情况，
                    // 如该字符串位于“：”之后的第一个位置，且存在一种可能，该字符串是另一个字符串的子串
                    //又如该字符串位于该synonymsplit最后一个位置，这时候还应该考虑到该字符串位于synonymsplit中间的某个位置，
                    // 且为某个name的子串，如：/namexxxxxx/ 此种情况
                    var nodeName4=":"+name;
                    var nodeName5="/"+name;
                    if(str.indexOf(nodeName1)!=-1 || str.indexOf(nodeName2)!=-1 || str.indexOf(nodeName3)!=-1){
                        var tmp=str.split(":")[0]+"-"+name;
                        stdTargetNames.push(tmp);
                    }
                    else{
                        var len1=str.length-nodeName4.length;
                        if(str.lastIndexOf(nodeName4)==len1){
                            var tmp=str.split(":")[0]+"-"+name;
                            stdTargetNames.push(tmp);
                        }
                        var len2=str.length-nodeName5.length;
                        if(str.lastIndexOf(nodeName5)==len2){
                            var tmp=str.split(":")[0]+"-"+name;
                            stdTargetNames.push(tmp);
                        }
                    }
                }
            }
        }
    }
    // console.log(stdSourceNames);
    // console.log(stdTargetNames);

}
//当stdSourceNames,stdTargetNames数组都已经填充完毕，
// 便调用此方法得到各个节点之间的关系
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
    relationVerify(sourceNames,targetNames);
    console.log(relations);

}

//此方法用于对比两棵树，若节点之间存在关系（下面定义），则填充关系列表relations
/*
 关系的定义：
 该出给出关系的三种定义，即等同关系，父子关系，兄弟关系
 等同关系：通过同义词词表，两者对应到同一个标准词汇上，即称作等同关系
 父子关系：通过同义词词表，二者对应到标准树上，所属父子，即为父子关系
 兄弟关系：通过同义词词表，二者对应到标准树上，所属同一个根节点的邻居，即为兄弟关系
 */
function relationVerify() {

    for(var i=0;i<stdSourceNames.length;i++){
        var stdSource=stdSourceNames[i].split("-")[0];
        for(var j=0;j<stdTargetNames.length;j++){
            var stdTarget=stdTargetNames[j].split("-")[0];
            // console.log(stdSource);
            // console.log(stdTarget);
            //判断等同关系
            if(stdSource==stdTarget){
                var relationStr=stdSourceNames[i].split("-")[1]+"-"+stdTargetNames[j].split("-")[1]+"-等同关系";
                relations.push(relationStr);
                continue;
            }
            //判断兄弟关系-->前面排除掉等同关系后，
            //通过其父节点是否相同，进而得到兄弟关系
            //遍历标准树，寻找stdSource,stdTarget,进而对比其关系
            for(var k=0;k<splitItem.length;k++) {
                // console.log(splitItem[257]);
                var str = splitItem[k];               /*
                 该部分用来寻找到stdSource以及stdTarget的parent
                 找到后对比，若二者相同，则二者为兄弟关系
                 */
                var sourceParent="";
                var sourceName1 = "," + stdSource + ",";
                //对应以该字符串结束，此种情况可能存在子串问题
                var sourceName2 = "," + stdSource;
                //对应以该字符串开始，此种情况可能存在子串问题,
                // 且该情况下，该字符串就是parent，应该单独拿出来讨论
                var sourceName3 = stdSource + ",";

                if(str.indexOf(sourceName3)==0){
                    if(str.indexOf(stdTarget)!=-1){
                        var relationStr=stdSourceNames[i].split("-")[1]+"-"+stdTargetNames[j].split("-")[1]+"-父子关系";
                        relations.push(relationStr);
                        break;
                    }
                }


                if (str.indexOf(sourceName1) != -1) {
                    sourceParent = str.split(",")[0];
                }
                else if(str.indexOf(sourceName2)!=-1){
                    var len1 = str.length - sourceName2.length;
                    if (str.lastIndexOf(sourceName2) == len1) {
                        sourceParent = str.split(",")[0];
                    }
                }
                var targetParent="";
                var targetName1=","+stdTarget+",";
                //对应以该字符串结束，此种情况可能存在子串问题
                var targetName2=","+stdTarget;
                //对应以该字符串开始，此种情况可能存在子串问题,
                // 且该情况下，该字符串就是parent，应该单独拿出来讨论
                var targetName3=stdTarget+",";
                if(str.indexOf(targetName3)==0){
                    if(str.indexOf(stdSource)!=-1){
                        var relationStr=stdSourceNames[i].split("-")[1]+"-"+stdTargetNames[j].split("-")[1]+"-父子关系";
                        relations.push(relationStr);
                        break;
                    }
                }
                if(str.indexOf(targetName1)!=-1){
                    targetParent=str.split(",")[0];
                }
                else if(str.indexOf(targetName2)!=-1){
                    var len1=str.length-targetName2.length;
                    if(str.lastIndexOf(targetName2)==len1){
                        targetParent=str.split(",")[0];
                    }
                }

                if(sourceParent==targetParent && sourceParent!=""){
                    console.log(sourceParent,",",targetParent);
                    var relationStr=stdSourceNames[i].split("-")[1]+"-"+stdTargetNames[j].split("-")[1]+"-兄弟关系";
                    relations.push(relationStr);
                    break;
                }
            }


        }
    }
    // console.log(relations);
}


//将需要展示的信息表object对象设置为全局对象，方便后续的编辑以及存储
var disObj=new Object();
//筛选出需要比较的两个表格之后，需要将其整理到一个表中，方便展示
function createObj(treeLeftObj,treeRightObj) {
    // console.log(relations);
    disObj.nodes=[];
    disObj.edges=[];
    var names=[];
    var children=[];
    //用来记录左边树的长度，方便后面插入关系时使用
    var len;
    //该循环进行两次，分别将treeLeftObj，treeRightObj中的信息push到disObj中
    for(var i=0;i<=1;i++){
        //treeLeftObj信息push进去
        if(i==0){
            //节点信息
            names.push(treeLeftObj.name);
            children=treeLeftObj.children;
            for(var j=0;j<children.length;j++){
                names.push(children[j].name);
            }
            for(var j=0;j<names.length;j++){
                var obj={name:names[j],image:"nodeLeft.jpg",description:"...."};
                disObj.nodes.push(obj);
            }
            //树内部关系的创建，即仅仅存在父子关系
            for(var j=1;j<names.length;j++){
                var obj={source:0,target:j,relation:"父子"};
                disObj.edges.push(obj);
            }
        }else{
            //treeRightObj信息push进去
            len=names.length;
            //节点信息
            names.push(treeRightObj.name);
            children=treeRightObj.children;
            for(var j=0;j<children.length;j++){
                names.push(children[j].name);
            }
            for(var j=len;j<names.length;j++){
                var obj={name:names[j],image:"nodeRight.jpg",description:"...."};
                disObj.nodes.push(obj);
            }
            //边的信息
            for(var j=len+1;j<names.length;j++){
                var obj={source:len,target:j,relation:"父子"};
                disObj.edges.push(obj);
            }
        }
    }
    console.log(disObj);
    //调用该方法，创建两棵树之间的关系
    disObj=relationCreate(disObj,len);
    //调用该方法，对更新后的disObj进行展示
    newDisplay(disObj);
    //调用该方法，填充关系表
    relationTable();
}

//该方法用来创建两棵树之间的关系，传入参数为上一个函数所得到的两颗
// 只有树内关系的disObj以及左边树的长度，结合之前得到的两棵树直接节点的关系列表relations
function relationCreate(disObj,len) {
    for(var i=0;i<relations.length;i++){
        // console.log(relations[i]);
        var sourceName=relations[i].split("-")[0];
        var targetName=relations[i].split("-")[1];
        var relation=relations[i].split("-")[2];
        // console.log(sourceName+","+targetName+","+relation);
        var nodes=disObj.nodes;
        // console.log(nodes);
        for(var j=0;j<len;j++){
            if(nodes[j].name==sourceName){
                for(var k=len;k<disObj.nodes.length;k++){
                    if(nodes[k].name==targetName){
                        var obj={source:j,target:k,relation:relation};
                        disObj.edges.push(obj);
                    }
                }
            }
        }
    }
    // console.log(disObj);
    return disObj;
}

var img_w = 40;
var img_h = 55;

function newDisplay(jsonObj) {
    console.log(jsonObj);
    remNodes=jsonObj;
    var svg = d3.select("#div-left").append("svg")
        .attr("width",width)
        .attr("height",height);
    var root=jsonObj;

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
        })
        .on("dblclick",function (d) {
            console.log("hahaha");
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

//该方法用来展示关系table，当relations的length不为0，即设置表格的visibility为visible

function relationTable() {
    var tab=document.getElementById("tab");
    var lbl=document.getElementById("lbl");
    var txtBox=document.getElementById("txt");
    var btn=document.getElementById("btnSave");
    if(relations.length>0){


        tab.style.visibility="visible";
        txtBox.style.visibility="visible";
        btn.style.visibility="visible";
        for(var i=0;i<relations.length;i++){
            var sourceName=relations[i].split("-")[0];
            var targetName=relations[i].split("-")[1];
            var relation=relations[i].split("-")[2];
            // var newRow=tab.insertRow();
            // var newCol1=newRow.insertCell();
            // newCol1.innerHTML=sourceName;
            // var newCol2=newRow.insertCell();
            // newCol2.innerHTML=targetName;
            // var newCol3=newRow.insertCell();
            // newCol3.innerHTML=relation;
            tab.innerHTML+='<tr><td></td><td></td><td></td></tr>';
            var len=tab.rows.length;
            var rowAdd=tab.rows[len-1];
            var id="row"+i;
            rowAdd.id=id;
            var cells=rowAdd.cells;
            for(var j=0;j<cells.length;j++){
                if(j==0){
                    cells[j].innerHTML=sourceName;
                }
                else if(j==1){
                    cells[j].innerHTML=targetName;
                }
                else {
                    if(relation=="父子关系"){
                        cells[j].innerHTML='<select onchange="onChangeFunction()"><option selected>父子关系</option><option>兄弟关系</option><option>等同关系</option></select>';
                    }else if(relation=="兄弟关系"){
                        cells[j].innerHTML='<select onchange="onChangeFunction()"><option>父子关系</option><option selected>兄弟关系</option><option>等同关系</option></select>';
                    }
                    else if(relation=="等同关系"){
                        cells[j].innerHTML='<select onchange="onChangeFunction()"><option>父子关系</option><option>兄弟关系</option><option selected>等同关系</option></select>';
                    }
                }
            }

        }

    }else {
        lbl.style.visibility="visible";
    }

}
//此方法当任一select发生变化时触发
//该方法执行逻辑：读取所有select中的选中元素，更新relations数组
function onChangeFunction() {
    relations=[];
    var btn=document.getElementById("btn");
    btn.style.visibility="visible";
    var tab=document.getElementById("tab");
    var rows=tab.rows;
    var opt;
    for(var i=1;i<rows.length;i++){
        var cells=rows[i].cells;
        var opts=cells[2].getElementsByTagName("option");
        for(var j=0;j<opts.length;j++){
            if(opts[j].selected){
                opt=opts[j].innerHTML;
                break;
            }
        }
        var r=cells[0].innerHTML+"-"+cells[1].innerHTML+"-"+opt;
        relations.push(r);
    }
}

//该方法用来存储两张表的关系，id为两张表名称的连接，形如：tableName1-tableName2
function saveRelation() {
    var name=document.getElementById("hide");
    var jsonObj=new Object();
    jsonObj.name=name.textContent;
    jsonObj.children=[];
    for(var i=0;i<relations.length;i++){
        jsonObj.children.push(relations[i]);
    }
    var json=JSON.stringify(jsonObj);
    // console.log(jsonObj);
    createTree(json,name.textContent);
}

