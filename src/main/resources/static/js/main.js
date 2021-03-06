$(function () {

    let maxId = 333181;
    let language = 1; // 默认简体

    let currentPage = parseInt(getVal("#current-page"))
    let totalPage = parseInt(getVal("#total-page"))
    let currentKeyword = getVal("#keyword")

    /**
     * 初始化header
     * @param o Poetry对象
     */
    function initSingleHeader(o) {
        $("meta[name=keywords]").attr("content", o.keywords)
        $("meta[name=description]").attr("content", o.description)
        $("title").html(o.title + " - " + o.author)
    }

    function intiSinglePoetry(o) {
        let poetryId = "<input id='poetry-id' hidden value='" + o.id + "'/>";
        let poetryHeader =
            "<div id='poetry-header'>" +
            "<div id='poetry-title'><h2>" + o.title + "</h2></div>" +
            "<div id='poetry-author'>" + o.author + "</div>" +
            "</div>";
        let poetryContent = "<div id='poetry-content'>";
        $.each(o.contentList, function (index, value) {
            poetryContent += "<p class='content-p'>" + value + "</p>";
        })
        poetryContent += "</div>";
        $("#poetry").empty();
        $("#poetry").append("<div class='poetry-item poetry-single'>" + poetryId + poetryHeader + poetryContent + "</div>");
    }

    function initSingleAuthor(o) {
        if (o) {
            let authorDetail =
                "<span class='author-name'><a href='/poetry/search?keyword=author:" + o.name + "&page=1'>" + o.name + "</a></span>" +
                "<span class='author-dynasty'>" + ((o.dynasty == "tang") ? "唐" : (o.dynasty == "song") ? "宋" : "") + "</span>" +
                "<span class='author-desc'>" + abstract(o.desc, 128) + "</span>";
            $("#poetry").append("<div class='author-detail'>" + authorDetail + "</div>");
        }
    }

    function initSingleSidebar(o) {
        let poetryMeta = "<div class='poetry-meta'>";
        $.each(o.tags, function (index, value) {
            poetryMeta += "<span class='poetry-tags'><a href='/poetry/search?keyword=tag:" + value + "&page=1'>" + value + "</a></span>";
        })
        $.each(o.keywords, function (index, value) {
            poetryMeta += "<span class='poetry-keywords'><a href='/poetry/search?keyword=" + value + "&page=1'>" + value + "</a></span>";
        })
        poetryMeta += "</div>";

        $("#sidebar").empty();
        $("#sidebar").append(poetryMeta);
    }

    function initSingleNavbar() {
        $("#nav-bar").html("<div class='pre-poetry pre-item'>上一篇</div><div class='next-poetry next-item'>下一篇</div><div class='clearfix'></div> ")
    }
    function initSingleShangXi(o){
        let shangXi = "<div class=shangxi><div class=shangxi-content>"
        let content = o.content
        contentArray = content.split('\n')
        $.each(contentArray, function(index, c){
            shangXi += "<p>" + c + "</p>"
        })

        shangXi +=
            "</div><div class=shangxi-author>作者: " + o.author + "</div><div class=shangxi-source>来源: " + o.source + "</div></div>"

        $("#poetry").append(shangXi)
        console.log(shangXi)
    }

    function buildPoetryPage(data) {
        if(data.poetry){
            const p = new Poetry(data.poetry)
            initSingleHeader(p)
            intiSinglePoetry(p)
            initSingleSidebar(p)
        }
        if(data.author){
            const a = new Author(data.author)
            initSingleAuthor(a)
        }
        if(data.shangXi){
            const sx = new ShangXi(data.shangXi)
            initSingleShangXi(sx)
        }

        initSingleNavbar()
        initToolbar();
    }

    function initPage(o) {
        let size = 10;
        currentKeyword = o.keyword;
        currentPage = o.page;
        totalPage = ~~((o.total % size) == 0 ? (o.total / size) : (o.total / size + 1));
    }

    function initPageHeader(o) {
        $("meta[name=keywords]").attr("content", o.keyword);
        $("meta[name=description]").attr("content", o.keyword + " - 搜索结果");
        $("title").html(o.keyword + " - 搜索结果");
        $("#keyword").val(o.keyword);
        $(".title-bar").remove();
        $("#content-wrap").prepend("<div class='title-bar'>获得约 " + toThousands(o.total) + " 条结果（第" + o.page + "页）</div>")
    }

    function initPageContent(o) {
        $("#poetry").empty();
        $.each(o.poetryBeanList, function (index, poetry) {
            let kw = o.keyword.replace("author:", "");
            let re = new RegExp(kw, "g");
            let item =
                "<div class='poetry-item search-item'>" +
                "<span class='search-item-title'><a href='/poetry/" + poetry.id + "' title='" + poetry.title + "'>" + poetry.title.replace(re, "<em>" + kw + "</em>") + "</a></span>" +
                "<span class='search-item-author'>[" + poetry.author.replace(re, "<em>" + kw + "</em>") + "]</span>" +
                "<div class='search-item-content'>" + abstractWithKeyword(poetry.contentList.join(''), kw) + "</div>" +
                "</div>";
            $("#poetry").append(item);
        });
    }

    function initPageSidebar(o) {
        $("#sidebar").empty();
        if (o.relationTag) {
            let tag = "<div class='relation-tag'>";
            for (let prop in o.relationTag) {
                let rank = o.relationTag[prop];
                rank = rank < 17 ? 17 : rank;
                tag = tag +
                    "<div class='relation-tag-item'>" +
                    "<div class='item-box'><a class='percent-show' style='width:" +
                    rank + "%;background: rgb(34, 187, 204," + rank / 100 +
                    ")' href='/poetry/search?keyword=" + prop + "&amp;page=1'>" + prop + "</a></div>" +
                    "</div>"
            }
            tag = tag + "</div>";
            $("#sidebar").append(tag);
        }
        if (o.author) {
            let dynasty = o.author.dynasty == "tang" ? "唐" : o.author.dynasty == "song" ? "宋" : "";
            let author = "<div class='author-detail sidebar-author'>" +
                "<span class='author-name'><a href='/poetry/search?keyword=author:" + o.author.name +
                "&amp;page=1'>" + o.author.name + "</a></span>" +
                "<span class='author-dynasty'>" + dynasty +
                "</span><span class='author-desc'>" + o.author.desc + "</span></div>";
            $("#sidebar").append(author);
        }
    }

    function initPageNavbar() {
        $("#nav-bar").html("<div class='pre-page pre-item'>上一页</div><div class='next-page next-item'>下一页</div><div class='clearfix'></div> ")
    }

    function searchPoetryPage(resultMap) {
        const page = new PoetryPage(resultMap)

        initPage(page)
        initPageHeader(page)
        initPageContent(page)
        initPageSidebar(page)
        initPageNavbar()
    }

    function initToolbar() {
        $(".poetry-single").append("<div class='tool-bar'>" +
            "<span class='copy-poetry'><i class='material-icons'>content_copy</i></span></div>")
    }

    function getPoetryById(id, unPushState) {
        $.ajax({
            url: "/api/poetry/" + id,
            method: "GET",
            dataType: "json",
            data: {language: language},
            success: function (data) {
                buildPoetryPage(data);
                if (!unPushState) {
                    history.pushState({}, "", "/poetry/" + id);
                }
            }
        })
    }

    function getPoetryByKeyword(keyword, page, unPushState) {
        $.ajax({
            url: "/api/poetry/search",
            method: "GET",
            dataType: "json",
            data: {language: language, keyword: keyword, page: page},
            success: function (data) {
                searchPoetryPage(data);
                if (!unPushState) {
                    history.pushState({}, "", "/poetry/search?keyword=" + keyword + "&page=" + page);
                }
            }
        })
    }

    function switchLanguage(targetValue) {
        console.log("当前语言模式为：" + (targetValue ? "简体" : "繁体"));
        setCookie("language", targetValue);
        language = targetValue;
        if (targetValue == 1) { // 简
            $("#tr-sp .sp").css({top: ".1em", right: ".1em", color: "#fff"});
            $("#tr-sp .tr").css({top: "1.4em", right: "1.4em", color: ""});
        } else { // 繁
            $("#tr-sp .tr").css({top: ".1em", right: ".1em", color: "#fff"});
            $("#tr-sp .sp").css({top: "1.4em", right: "1.4em", color: ""});
        }
    }

    function loadByUrl() {
        let location = document.location + '';
        console.log(location)
        let re = /\/poetry\/(\d+)$/i;
        let found = location.match(re);
        if (found) {
            getPoetryById(found[1], true);
            return;
        }

        re = /\/poetry\/search\?keyword=([^&]*)&page=(\d*)$/i;
        found = location.match(re);
        if (found) {
            getPoetryByKeyword(decodeURI(found[1]), found[2], true);
            return;
        }

        let currentId = parseInt($("#poetry-id").val());
        getPoetryById(currentId);
    }

    function itemMsg(_this, msg) {
        _this.css({position: "relative"});
        _this.append("<div class='item-msg-box'>" + msg + "</div>");
        setTimeout(function () {
            _this.children(".item-msg-box").remove();
        }, 1000);
    }

// 下一篇
    $(document).on("click touchend", ".next-poetry", function () {
        let currentId = parseInt($("#poetry-id").val());
        if (currentId >= maxId) {
            // getPoetryById(maxId);
            itemMsg($(this), "已是最后一篇");
            return;
        } else {
            getPoetryById(currentId + 1);
        }
    });

// 上一篇
    $(document).on("click touchend", ".pre-poetry", function () {
        let currentId = parseInt($("#poetry-id").val());
        if (currentId <= 1) {
            // getPoetryById(1);
            itemMsg($(this), "已是第一篇");
            return;
        } else {
            getPoetryById(currentId - 1);
        }
    });

// 下一页
    $(document).on("click touchend", ".next-page", function () {
        if (currentPage == totalPage) {
            itemMsg($(this), "已是最后一页");
        } else {
            getPoetryByKeyword(currentKeyword, currentPage + 1);
        }
    });


// 上一页
    $(document).on("click touchend", ".pre-page", function () {
        if (currentPage == 1) {
            itemMsg($(this), "已是第一页");
        } else {
            getPoetryByKeyword(currentKeyword, currentPage - 1);
        }
    });


// 搜索
    $(document).on("click touchend", "#searchsubmit", function () {
        getPoetryByKeyword($("#keyword").val(), 1);
    });
    $(document).on("keyup", "#keyword", function (e) {
        let keycode = 'which' in e ? e.which : e.keyCode;
        if (keycode == "13") { //回车
            getPoetryByKeyword($(this).val(), 1);
        }
    });

// 繁简切换
    $(document).on("click", "#tr-sp", function () {
        switchLanguage(language ^ 1);
        loadByUrl();
    });

// 复制
    $(document).on("click touchend", ".copy-poetry", function () {
        //初始化
        $("textarea").remove("#targetId");

        var poetryHeader = $("#poetry-header");
        var poetryContent = $("#poetry-content");
        var poetryText = poetryHeader[0].outerText + "\n" + poetryContent[0].outerText.replace(/\n\n/g, "\n");

        //添加 <textarea> DOM节点，将获取的代码写入
        var target = document.createElement("textarea");
        target.style.position = "absolute";
        target.style.left = "-9999px";
        target.style.top = "0";
        target.id = "targetId";
        poetryHeader.append(target);
        target.textContent = poetryText;

        //选中textarea内的代码
        target.focus();
        target.setSelectionRange(0, target.value.length);

        // 复制选中的内容
        document.execCommand("copy");

        //删除添加的节点
        $("textarea").remove("#targetId");

        let thisCopied = $(this);
        thisCopied.empty();
        thisCopied.html("<i class='material-icons'>done</i>");
        setTimeout(function () {
            thisCopied.empty();
            thisCopied.html("<i class='material-icons'>content_copy</i>");
        }, 1000)

    });

    // 登录-注册切换
    $(document).on("click touchend", "#login-switch", function () {
        $(this).addClass("on-active");
        $("#register-switch").removeClass("on-active");
        $("#login-form").addClass("on-show");
        $("#register-form").removeClass("on-show");
    })
    $(document).on("click touchend", "#register-switch", function () {
        $(this).addClass("on-active");
        $("#login-switch").removeClass("on-active");
        $("#login-form").removeClass("on-show");
        $("#register-form").addClass("on-show");
    })

    $(document).on("focus", ".login-input input", function () {
        $(this).siblings(".input-err").remove();
        $(".global-msg").remove();
    })
    // 点击注册
    $(document).on("click touchend", "#register-submit-btn", function () {
        let param = $("form#register-form").serialize();
        $.ajax({
            url: "/api/user/register",
            method: "POST",
            dataType: "json",
            data: param,
            success: function (data) {
                $(".input-err").remove();
                let code = data.code;
                let tag = data.tag;
                let msg = data.msg;
                if (code == -1) { // 注册失败
                    if (tag != "global") {
                        $("#register-form .input-" + tag).append("<div class=input-err>" + msg + "</div>");
                    } else {
                        $("#register-form").after("<div class='input-err global-msg'>" + msg + "</div>")
                    }
                } else if (code == 0) {
                    $("#register-form").after("<div class='global-msg'>" + msg + "</div>");
                    setTimeout(function () {
                        $("#login-switch").addClass("on-active");
                        $("#register-switch").removeClass("on-active");
                        $("#login-form").addClass("on-show");
                        $("#register-form").removeClass("on-show");
                    }, 1200)
                }
            }
        })
    })
    // 点击登录
    $(document).on("click touchend", "#login-submit-btn", function () {
        let param = $("form#login-form").serialize();
        $.ajax({
            url: "/api/user/login",
            method: "POST",
            dataType: "json",
            data: param,
            success: function (data) {
                $(".input-err").remove();
                let code = data.code;
                let tag = data.tag;
                let msg = data.msg;
                if (code == -1) { // 注册失败
                    if (tag != "global") {
                        $("#register-form .input-" + tag).append("<div class=input-err>" + msg + "</div>");
                    } else {
                        $("#login-form").after("<div class='input-err global-msg'>" + msg + "</div>")
                    }
                } else if (code == 0) {
                    $("#login-form").after("<div class='global-msg'>" + msg + "</div>")
                    setTimeout(function () {
                        document.location.href = "/admin";
                    }, 1200)
                }
            }
        })
    })


    window.addEventListener('popstate', function (event) {
        loadByUrl();
    });

    function initAll() {
        // 初始化语言
        let _language = getCookie("language");
        if (_language == null) {
            _language = 1;
        } else {
            _language = parseInt(_language)
        }
        switchLanguage(_language);
    }

    initAll();
});