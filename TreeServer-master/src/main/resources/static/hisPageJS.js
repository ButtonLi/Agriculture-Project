/**
 * Created by llei on 2018/1/26.
 */
//该方法用来调用getTreeById()方法
function getTreeByIdNum() {
    var name=document.getElementById("hide");
    var id=name.textContent;
    getTreeById(id);
}
//用于接收api.js返回的数据
//该方法是用来处理由  id号  查询出的结果,接收参数为历史存储在数据库中的关系表
//即直接调用历史数据来展示两张表之间的关系，包括两个部分，
// 首先会根据选中的两张表生成一张信息表，用来图形化展示
//其实要填充界面右侧是关系表格
var jsonObj;
function receiveObj(jsonObject) {
    jsonObj=jsonObject;

    getAllTrees();
}

//此方法与newPageJS.js中额sortByName()方法相同，均是筛选出我们选中的两棵树
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
    // relatedInfoDisplay(treeLeftObj,treeRightObj);
    //筛选出两张表之后，将其中信息读取出来，合成一个object，方便展示
    createObj(treeLeftObj,treeRightObj);
}

var disObj=new Object();
function createObj(treeLeftObj,treeRightObj) {

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

    //调用addRelation()方法，将历史存储的边的关系添加到disObj中
    //第一个参数为需要展示的信息表的obj
    //第二个参数为第一棵树的长度
    addRelations(disObj,len);
    //调用该方法，创建两棵树之间的关系
    // disObj=relationAdd(disObj,len);
    //调用该方法，对更新后的disObj进行展示
    // resDisplay(disObj);
    //调用该方法，填充关系表
    relationTable();
}

function addRelations(disObj,len) {
    var nodes=disObj.nodes;
    for(var i=0;i<jsonObj.children.length;i++){
        var relStr=jsonObj.children[i];
        var source=relStr.split("-")[0];
        var target=relStr.split("-")[1];
        var rel=relStr.split("-")[2];
        for(var j=0;j<len;j++){
            if(nodes[j].name==source){
                for(var k=len;k<nodes.length;k++){
                    if(nodes[k].name==target){
                        var obj={source:j,target:k,relation:rel};
                        disObj.edges.push(obj);
                    }
                }
            }
        }
    }
    resDisplay(disObj);
    // console.log(disObj);
}

function relationTable() {
    var tab=document.getElementById("tab");
    var lbl=document.getElementById("lbl");
    // var txtBox=document.getElementById("txt");
    // var btn=document.getElementById("btnSave");
    if(jsonObj.children.length>0){
        tab.style.visibility="visible";
        // txtBox.style.visibility="visible";
        // btn.style.visibility="visible";
        for(var i=0;i<jsonObj.children.length;i++){
            var sourceName=jsonObj.children[i].split("-")[0];
            var targetName=jsonObj.children[i].split("-")[1];
            var relation=jsonObj.children[i].split("-")[2];
            var newRow=tab.insertRow();
            var newCol1=newRow.insertCell();
            newCol1.innerHTML=sourceName;
            var newCol2=newRow.insertCell();
            newCol2.innerHTML=targetName;
            var newCol3=newRow.insertCell();
            newCol3.innerHTML=relation;
        }
    }else {
        lbl.style.visibility="visible";
    }
}


//newDisplay用来展示关系
var img_w = 40;
var img_h = 55;

function resDisplay(jsonObj) {
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