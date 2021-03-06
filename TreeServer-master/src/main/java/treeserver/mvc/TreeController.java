package treeserver.mvc;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import treeserver.bean.Bean;
import treeserver.bean.HttpResult;
import treeserver.dao.MongodbDao;
import treeserver.utils.JsonUtils;

import javax.annotation.Resource;
import java.util.List;

/**
 * Created by Xin_Li on 2017/10/15.
 */
@RestController
@RequestMapping("/api")
public class TreeController extends BaseController {

    private Logger logger = LoggerFactory.getLogger(TreeController.class);

    @Resource
    private MongodbDao mongodbDao;

    @RequestMapping(value = "/tree", method = RequestMethod.POST)
    public HttpResult createTree() {
        String id = StringUtils.trimToEmpty(httpServletRequest.getParameter("id"));
        String tree = StringUtils.trimToEmpty(httpServletRequest.getParameter("tree"));
        System.out.println(id+","+tree);
        if (StringUtils.isAnyEmpty(id,tree)) {
            return HttpResult.error("参数不正确");
        }
        Bean bean = new Bean(tree,id);
        mongodbDao.saveBean(bean);
        logger.info("插入新的树,id="+bean.getId());
        return HttpResult.success(bean.getId());
    }

    @RequestMapping(value = "/tree/{id}", method = RequestMethod.GET)
    public String getTree(@PathVariable String id) {

        if (StringUtils.isEmpty(id)) {
            return JsonUtils.generateJson(HttpResult.error("参数不正确"));
        }
        Bean bean = mongodbDao.queryBeanById(id);
        return JsonUtils.replaceBlank(JsonUtils.generateJson(HttpResult.success(bean)));
    }

    //---------------------------------------------------------------
    //该方法是尝试着根据具体某个id号来查询一个json文件
    @RequestMapping(value = "/tree", method = RequestMethod.GET)
    public HttpResult getTreeById() {
        String id = StringUtils.trimToEmpty(httpServletRequest.getParameter("id"));
        if (StringUtils.isEmpty(id)) {
            return HttpResult.error("参数不正确");
        }
        Bean originBean = mongodbDao.queryBeanById(id);
        if (originBean == null) {
            return HttpResult.error("未找到对应的数据");
        }
//        System.out.println(JsonUtils.generateJson(HttpResult.success(originBean)));
        String json=JsonUtils.generateJson(HttpResult.success(originBean));
        return HttpResult.success(json);

    }


    @RequestMapping(value = "/trees", method = RequestMethod.GET)
    public String getTrees() {
//        String id = StringUtils.trimToEmpty(httpServletRequest.getParameter("id"));
//        if (StringUtils.isEmpty(id)) {
//            return JsonUtils.generateJson(HttpResult.error("参数不正确"));
//        }
//        Bean originBean = mongodbDao.queryBeanById(id);
//        if (originBean == null) {
//            return JsonUtils.generateJson(HttpResult.error("未找到相关数据"));
//        }
        List<Bean> beans = mongodbDao.queryAllBeans();
        return JsonUtils.replaceBlank(JsonUtils.generateJson(HttpResult.success(beans)));
    }

    @RequestMapping(value = "/tree", method = RequestMethod.PUT)
    public HttpResult updateTree() {
        String id = StringUtils.trimToEmpty(httpServletRequest.getParameter("id"));
        String tree = StringUtils.trimToEmpty(httpServletRequest.getParameter("tree"));
        if (StringUtils.isAnyEmpty(id,tree)) {
            return HttpResult.error("参数不正确");
        }
        Bean bean = new Bean();
        bean.setId(id);
        bean.setJson(tree);
        boolean result = mongodbDao.updateBean(bean);
        if (result) {
            return HttpResult.success("update succeed..");
        } else {
            return HttpResult.error("update failed...");
        }
    }
    @RequestMapping(value = "/tree", method = RequestMethod.DELETE)
    public HttpResult deleteTree() {
        String id = StringUtils.trimToEmpty(httpServletRequest.getParameter("id"));
        if (StringUtils.isEmpty(id)) {
            return HttpResult.error("参数不正确");
        }
        Bean originBean = mongodbDao.queryBeanById(id);
        if (originBean == null) {
            return HttpResult.error("未找到对应的数据");
        }
        boolean result = mongodbDao.removeBeanById(id);
        if (result) {
            return HttpResult.success();
        } else {
            return HttpResult.error("删除出错，请稍后重试");
        }
    }

}
