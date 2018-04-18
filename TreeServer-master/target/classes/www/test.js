/**
 * Created by llei on 2017/12/13.
 */



function returnTree(rootNode) {
    delete rootNode.depth;
    delete rootNode.id;
    delete rootNode.x;
    delete rootNode.x0;
    delete rootNode.y;
    delete rootNode.y0;
    removeParent(rootNode);
    function removeParent(rootNode) {
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
    return rootNode;
}