package org.xinyo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.xinyo.domain.Poetry;
import org.xinyo.service.PoetryService;

import java.util.List;

/**
 * Created by chengxinyong on 2018/3/27.
 */
@Controller
public class PoetryController {
    @Autowired
    private PoetryService poetryService;

    @RequestMapping(value = "/poetry/{id}", method = RequestMethod.GET)
    public String getPoetryById(Model model, @PathVariable Integer id){
        System.out.println(id);
        model.addAttribute("poetry", id);
        return "poetry";
    }

}
