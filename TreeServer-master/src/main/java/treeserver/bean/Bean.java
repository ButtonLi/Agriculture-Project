package treeserver.bean;

import treeserver.utils.JsonUtils;

import java.util.UUID;

/**
 * Created by Xin_Li on 2017/10/15.
 */
public class Bean {
    private String id;
    private String json;

    public Bean() {
    }

    public Bean(String json,String id) {
        //this.id = UUID.randomUUID().toString()+json.length();
        this.id=id;
        this.json = JsonUtils.replaceBlank(json);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getJson() {
        return json;
    }

    public void setJson(String json) {
        this.json = JsonUtils.replaceBlank(json);
    }
}
