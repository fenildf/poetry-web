<!DOCTYPE html>
<html lang="zh-CN">

<#include "template/head.ftl" >

<body>
<div id="wrap">
    <div id="tr-sp">
        <div class="bg-change"></div>
        <span class="tr">繁</span>
        <span class="sp">简</span>
    </div>
    <div id="header-wrap" class="wrap">
        <div id="header">
            <div id="title"><h1><a href="/">诗词歌赋</a></h1></div>
            <div id="search">
                <div method="get" id="search-form">
                    <input id="keyword" type="text" name="keyword" placeholder="" value="${keyword}">
                    <input id="searchsubmit" type="button" value="搜索">
                </div>
            </div>
            <div class="clearfix"></div>
        </div>
    </div>
    <div id="content-wrap" class="wrap">
        <div class="title-bar">获得约 ${total?string(',###')} 条结果（第${page}页）</div>
        <div id="content">
            <div id="poetry">
            <#list poetryBeanList as poetry>
                <div class="poetry-item search-item"><span class="search-item-title">
                    <a href="/poetry/${poetry.id?c}"  title="${poetry.title}">${poetry.title?replace(keyword, '<em>'+keyword+'</em>', 'r')}</a></span><span
                        class="search-item-author">[${poetry.author?replace(keyword, '<em>'+keyword+'</em>', 'r')}]</span>
                    <div class="search-item-content">${poetry.description?replace(keyword, '<em>'+keyword+'</em>', 'r')}</div>
                </div>
            </#list>
            </div>
            <div id="sidebar">
            <#if (relationTag)??>
                <div class="relation-tag">
                    <#list relationTag?keys as prop>
                        <div class="relation-tag-item">
                            <div class="item-box">
                                <a class="percent-show" style="width: ${relationTag[prop]}%;background: rgb(34, 187, 204, ${relationTag[prop]/100})" href="/poetry/search?keyword=${prop}&amp;page=1">${prop}</a>
                            </div>
                        </div>
                    </#list>
                </div>
            </#if>
            <#if (author)??>
                <div class="author-detail sidebar-author">
                    <span class="author-name"><a
                            href="/poetry/search?keyword=author:${author.name}&amp;page=1">${author.name}</a></span><span
                        class="author-dynasty"><#if author.dynasty == "tang">唐<#elseif author.dynasty == "song">
                    宋</#if></span><span class="author-desc">${author.desc}</span>
                </div>
            </#if>

            </div>
            <div id="nav-bar">
                <input id="current-page" hidden value="${page?c}">
                <input id="total-page" hidden value="${totalPage?c}">
                <div class="pre-page pre-item">上一页</div>
                <div class="next-page next-item">下一页</div>
                <div class="clearfix"></div>
            </div>
        </div>

    </div>
    <div id="footer"></div>
</div>

</body>
</html>