/**
 @Author：tzhx
 @describ: 问题回答页面展示比较复杂，因此这里单独抽取出一些借口调用处理逻辑,以及一些常用的函数，主要包括问答返回结果的一些函数
 @version
 */

/**
 * 问题重写调用
 * @param question
 * @param type
 * 接口：medical/rewrite/queryRewrite.do
 测试：http://222.29.68.23:22602/medical/rewrite/queryRewrite.do?&query=高血压怎么治&type:tag
 params={
        'query': '老刘突然得高血',
        ‘type’: ‘tag’,
        }
 */
function question_rewrite(question, type) {
    var defer = $.Deferred();
    var options = {
        url: getFullUrl('medical/rewrite/queryRewrite.do'),
        dataType: 'JSON',
        data: {
            "query": question,
            "type": type
        },
        success: function (result) {
            if (result.result === 1) {
                defer.resolve(result.data);
            } else {
                alert(result.message)
            }
        }
    };
    $.ajax(options);
    return defer.promise();
}

/**
 * 相关问题推荐接口调用
 * @param query
 * @param user_id
 * @param max_count
 * @returns {*|never|{always, promise, state, then}}
 */
function question_recommend(query, user_id, max_count) {
    var defer = $.Deferred();
    var options = {
        url: getFullUrl('medical/recommend/questionRecommendation.do?'),
        dataType: 'JSON',
        data: {
            "query": query,
            "user_id": user_id,
            "max_count": max_count
        },
        success: function (result) {
            if (result.result === 1) {
                defer.resolve(result.data);
            } else {
                alert(result.message)
            }
        }
    };
    $.ajax(options);
    return defer.promise();
}

/**
 * 获取用户历史记录
 * @param query
 * @param user_id
 * @param max_count
 * @returns {*|jQuery}
 */
function question_history(query, user_id, max_count) {
    var defer = $.Deferred();
    var options = {
        url: getFullUrl('medical/history/historyAskedQuestions.do'),
        dataType: 'JSON',
        type: 'POST',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        traditional: true,
        data: {
            "max_count": max_count
        },
        success: function (result) {
            if (result.result === 1) {
                defer.resolve(result.data);
            } else {
                alert(result.message)
            }
        }
    };
    $.ajax(options);
    return defer.promise();
}


/**
 * 根据问题中的特征返回关联疾病、关联症状
 * @param question
 * @param user_id
 * @param max_num
 * @return
 * medical/symptom/questionCorrelationSymptoms.do
 * http://222.29.68.23:22602/medical/symptom/questionCorrelationSymptoms.do?&question=高血压怎么治&user_id=h&max_num=5
 */
function question_correlation_symptoms(question, user_id, max_num) {
    var defer = $.Deferred();
    var options = {
        url: getFullUrl('medical/symptom/questionCorrelationSymptoms.do'),
        dataType: 'JSON',
        data: {
            "question": question,
            "user_id": user_id,
            "max_num": max_num
        },
        success: function (result) {
            if (result.result === 1) {
                defer.resolve(result.data);
            } else {
                alert(result.message)
            }
        }
    };
    $.ajax(options);
    return defer.promise();
}

/**
 * 根据症状名获取所有的关联症状
 * @param symptom_list ：症状列表：["发烧","咳嗽"]
 * @param user_id
 * @param max_num
 */
function symptom_correlation_symptom(symptom_list, user_id, max_num) {

    var defer = $.Deferred();
    var options = {
        url: getFullUrl('medical/symptom/questionCorrelationSymptoms.do'),
        dataType: 'JSON',
        data: {
            "question": trans_list_to_dict_list(symptom_list, "symptom_name"),
            "user_id": user_id,
            "max_num": max_num
        },
        success: function (result) {
            if (result.result === 1) {
                defer.resolve(result.data);
            } else {
                alert(result.message)
            }
        }
    };
    $.ajax(options);
    return defer.promise();
}


/**
 * 将list转化为dict list
 * @param list_
 * @param key
 * @returns [{},{}]
 */
function trans_list_to_dict_list(list_, key) {
    var result = [];
    for (var i = 0; i < list_.length; i++) {
        var tmp = {};
        tmp[key] = list_[i];
        result[i] = tmp;
    }
    return result
}


/**
 * 填充问题重写
 * @param question
 * @param type
 * @param div_id 填充内容容器 父容器id为子容器id+“_div” 用于隐藏hidden_div("correlation_symptoms_div")
 */
function fill_question_rewrite(question, type, div_id) {
    hidden_div(div_id + "_div");
    $.when(question_rewrite(question, type)).done(function (data_dict) {
        // var data_json = JSON.parse(data_dict);
        var data_json = data_dict; //已经是json
        if ($.isEmptyObject(data_json) || data_json["tagRewrittenQuery"] === localStorage.getItem("question_index")) {
            hidden_div(div_id + "_div");
            return;
        } else {
            show_div(div_id + "_div");
            var tag_rewritten_query = data_json["tagRewrittenQuery"];
            var suggestWrap = $('#' + div_id);
            var input = $('#search_input');

            var a;
            var tmpFrag = document.createDocumentFragment();
            suggestWrap.html('');

            a = document.createElement('a');
            a.innerHTML = tag_rewritten_query;
            tmpFrag.appendChild(a);

            suggestWrap.append(tmpFrag);
            suggestWrap.show();
            suggestWrap.find('a').hover(function () {
                suggestWrap.find('a').removeClass('hover');
                $(this).addClass('hover');
            }, function () {
                $(this).removeClass('hover');
            }).bind('click', function () {
                input.val(this.innerHTML);
            });
        }

    });
}


/**
 * 填充推荐、热点、历史 问题
 * @param question
 * @param user_id
 * @param max_count
 * @param div_id
 */
function fill_question_related(question, user_id, max_count, div_id, get_data_function) {
    $.when(get_data_function(question, user_id, max_count).done(function (data) {
        if (data instanceof Array) {
            var question_list = data;
        } else {
            question_list = data.result;
        }
        if ($.isEmptyObject(question_list)) {
            return;
        } else {
            var suggestWrap = $('#' + div_id);
            var li;
            var tmpFrag = document.createDocumentFragment();
            suggestWrap.html('');
            for (var i = 0; i < question_list.length; i++) {
                li = document.createElement('li');
                li.innerHTML = question_list[i];
                tmpFrag.appendChild(li);
                tmpFrag.append(" ");
            }
            suggestWrap.append(tmpFrag);
            suggestWrap.show();
            suggestWrap.find('li').hover(function () {
                suggestWrap.find('li').removeClass('hover');
                $(this).addClass('hover');
            }, function () {
                $(this).removeClass('hover');
            }).bind('click', function () {
                var path = window.location.pathname;
                if (path.indexOf("index") !== -1) {
                    //在首页
                    localStorage.setItem("question_index", this.innerHTML);
                    window.open('answer_main.html', '_self');
                } else {
                    answer_question(this.innerHTML);
                    var uuid = localStorage.getItem("user_uuid");
                    var input = $('#search_input');
                    input.val(this.innerHTML);
                    // 这里不是递归，需要点击才能触发下面函数
                    fill_question_related(this.innerHTML, uuid, 10, "recommend_questions", question_recommend);
                    fill_question_related(this.innerHTML, uuid, 10, "history_questions", question_history);
                    fill_question_rewrite(this.innerHTML, "tag", "question_rewrite");
                    fill_question_correlation_symptoms(this.innerHTML, uuid, 10, "correlation_symptoms");
                    localStorage.setItem("question_index", this.innerHTML);
                    // fill_search_engine(this.innerHTML, 1, 10);
                    // fill_news_engine(this.innerHTML, 1, 10);

                }

            });
        }
    }));
}


/**
 * 填充关联症状
 * @param question
 * @param user_id
 * @param max_num
 * @param div_id ：填充内容容器 父容器id为子容器id+“_div” 用于隐藏hidden_div("correlation_symptoms_div")
 */
function fill_question_correlation_symptoms(question, user_id, max_num, div_id) {
    hidden_div(div_id + "_div");
    $.when(question_correlation_symptoms(question, user_id, max_num)).done(function (data_dict) {
        var data_json = data_dict; //已经是json
        if ($.isEmptyObject(data_json.symptoms)) {
            hidden_div(div_id + "_div");
            return;
        } else {
            show_div(div_id + "_div");
            var suggestWrap = $('#' + div_id);
            var input = $('#search_input');

            var a;
            var tmpFrag = document.createDocumentFragment();
            suggestWrap.html('');

            var symptom = data_json.symptoms;

            //相关症状
            for (var i = 0; i < symptom.length; i++) {
                a = document.createElement('a');
                a.innerHTML = symptom[i];
                tmpFrag.appendChild(a);
                tmpFrag.append(" ");
            }
            // var br = document.createElement("br");
            // tmpFrag.appendChild(br);//添加一个换行

            suggestWrap.append(tmpFrag);
            suggestWrap.show();
            suggestWrap.find('a').hover(function () {
                suggestWrap.find('a').removeClass('hover');
                $(this).addClass('hover');
            }, function () {
                $(this).removeClass('hover');
            }).bind('click', function () {
                var input_list = input.val().split(" ");
                if (!isInArray(input_list, this.innerHTML)) {
                    input.val(input.val() + " " + this.innerHTML);
                }
            });
        }
    });
}


/**
 * 用于boostrapTable 鼠标悬停显示所有信息,不要删除！！！
 * @param value
 * @param row
 * @param index
 * @returns {string}
 */
function paramsMatter(value, row, index) {
    var span = document.createElement('span');
    span.setAttribute('title', value);
    span.innerHTML = value;
    span.setAttribute("onclick", "entity_click(this.getAttribute('title'))");
    return span.outerHTML;
}


function entity_click(string) {
    if (string.length > 30) {
        return;
    }
    $.when(judge_entity(string)).done(function (data) {
        if (data.data === true) {
            localStorage.setItem("medpedia_name", string);
            window.open('../medpedia/html/medpedia_main.html', '_self');
        } else {
            alert(data.message);
        }
    });
}

/**
 * 判断是否是一个词条
 * @param string
 * @returns {*|jQuery}
 */
function judge_entity(string) {
    var defer = $.Deferred();
    var options = {
        url: getFullUrl('medpedia/check/doesItemHaveDetails.do'),
        dataType: 'JSON',
        data: {
            "item_name": string
        },
        success: function (result) {
            defer.resolve(result);
        }
    };
    $.ajax(options);
    return defer.promise();
}

/**
 * bootstrapTable cell样式
 * @param value
 * @param row
 * @param index
 * @returns {{css: {overflow: string, "white-space": string, "text-overflow": string}}}
 */
function formatTableUnit(value, row, index) {
    return {
        css: {
            "white-space": 'nowrap',
            "text-overflow": 'ellipsis',
            "overflow": 'hidden'
        }
    }
}

/**
 * 根据answerQuestion 返回的"chart_tag":"ListContainer"填充list_div
 * @param data_list :list
 * @param div_id
 */
function fill_list_div(data_list, div_id) {
    if ($.isEmptyObject(data_list)) {
        hidden_div(div_id + "_div");
        return
    }
    show_div(div_id + "_div");
    var suggestWrap = $('#' + div_id);
    var input = $('#search_input');

    var a;
    var tmpFrag = document.createDocumentFragment();
    suggestWrap.html('');
    for (var i = 0; i < data_list.length; i++) {
        a = document.createElement('a');
        a.innerHTML = data_list[i];
        tmpFrag.appendChild(a);
        tmpFrag.append(" ");
    }
    suggestWrap.append(tmpFrag);
    suggestWrap.show();
    suggestWrap.find('a').hover(function () {
        suggestWrap.find('a').removeClass('hover');
        $(this).addClass('hover');
    }, function () {
        $(this).removeClass('hover');
    }).bind('click', function () {
        input.val(this.innerHTML);
    });
}


/**
 * 根据answerQuestion 返回的"chart_tag":"StringContainer"StringContainer_div
 * @param data_list :list
 * @param div_id
 */
function fill_string_container_div(data_list, div_id) {

    if ($.isEmptyObject(data_list)) {
        hidden_div(div_id + "_div");
        return
    }
    show_div(div_id + "_div");
    var suggestWrap = $('#' + div_id);
    var input = $('#search_input');

    var a;
    var tmpFrag = document.createDocumentFragment();
    suggestWrap.html('');
    a = document.createElement('a');
    a.innerHTML = data_list;
    tmpFrag.appendChild(a);
    tmpFrag.append(" ");
    suggestWrap.append(tmpFrag);
    suggestWrap.show();
    suggestWrap.find('a').hover(function () {
        suggestWrap.find('a').removeClass('hover');
        $(this).addClass('hover');
    }, function () {
        $(this).removeClass('hover');
    }).bind('click', function () {
        input.val(this.innerHTML);
    });
}

/**
 * 填充饼图
 * @param result_json_list
 * @param div_id : 填充的div 父div id 后边“_div”
 */
function fill_pie(result_json_list, i, div_id) {
    // 饼图
    show_div(div_id + "_div");
    var my_pie_chart = echarts.init(document.getElementById(div_id));
    var title = {
        text: result_json_list[i].title.text,
        top: 10,
        left: "left",
        textStyle: {
            color: '#f7f7f7'
        }
    };

    var data_ = result_json_list[i].data;
    var option_pie = {
        title: title,
        backgroundColor: '#2c343c',
        series: [
            {
                name: '访问来源',
                type: 'pie',
                radius: '55%',
                data: data_,
                roseType: 'angle',
                label: {
                    normal: {
                        textStyle: {
                            color: 'rgba(255, 255, 255, 0.3)'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.3)'
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        shadowBlur: 200,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    my_pie_chart.setOption(option_pie);
}

/**
 * 填充柱状图
 * @param result_json_list
 * @param div_id
 */
function fill_histogram(result_json_list, i, div_id) {
    // 柱状图
    show_div(div_id + "_div");
    var my_bar_chart = echarts.init(document.getElementById(div_id));
    var option_bar = {
        title: result_json_list[i].title,
        tooltip: {
            trigger: 'axis'
        },
        legend: result_json_list[i].legend,
        toolbox: {
            show: true,
            feature: {
                mark: {show: true},
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar']},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        calculable: true,
        xAxis: result_json_list[i].xAxis,
        yAxis: result_json_list[i].yAxis,
        series: result_json_list[i].series
    };
    my_bar_chart.setOption(option_bar);
}

/**
 * 填充表格
 * @param result_json_list
 * @param i
 * @param div_id
 * @param toolbar_id
 */
function fill_table(result_json_list, i, div_id, toolbar_id, title_id) {
    // 表格
    var columns = result_json_list[i].columns;
    var data = result_json_list[i].row_datas;
    if (data.length === 0) {
        return
    }
    var is_pagination = false;
    if (data.length > 10) {
        is_pagination = true;
    }
    show_div(div_id + "_div");
    document.getElementById(title_id).innerHTML = result_json_list[i].title;
    var table_option;
    table_option = {
        toolbar: '#' + toolbar_id,
        showToggle: true,
        sortable: true,
        search: true,
        icons: {
            refresh: 'fa fa-refresh',
            toggle: 'fa fa-refresh',
            columns: 'fa fa-columns'
        },
        striped: true,
        pagination: is_pagination, // 启动分页
        pageSize: 10, // 每页显示的记录数
        pageNumber: 1, // 当前第几页
        // columns: columns
        columns: polish_table_data(columns)
    };
    $("#" + div_id).bootstrapTable('destroy');
    var table = $("#" + div_id).bootstrapTable(table_option);
    table.bootstrapTable('append', data);
}


/**
 * 填充知识图谱
 * @param result_json_list
 * @param i
 * @param div_id
 */
function fill_graph(result_json_list, i, div_id) {
    show_div(div_id + "_div");
    var myChart = echarts.init(document.getElementById(div_id));
    // var option = {
    //     title: {
    //         text: "知识图谱",
    //         top: "top",
    //         left: "left",
    //         textStyle: {
    //             color: '#f7f7f7'
    //         }
    //     },
    //     tooltip: {
    //         formatter: '{b}'
    //     },
    //     toolbox: {
    //         show: true,
    //         feature: {
    //             restore: {
    //                 show: true
    //             },
    //             saveAsImage: {
    //                 show: true
    //             }
    //         }
    //     },
    //     backgroundColor: '#00000',
    //     legend: {
    //         data: result_json_list[i].legend.data,
    //         textStyle: {
    //             color: '#fff'
    //         },
    //         icon: 'circle',
    //         type: 'scroll',
    //         orient: 'vertical',
    //         left: 10,
    //         top: 20,
    //         bottom: 20,
    //         itemWidth: 10,
    //         itemHeight: 10
    //     },
    //     animationDuration: 1000,
    //     animationEasingUpdate: 'quinticInOut',
    //     series: [{
    //         name: '知识图谱',
    //         type: 'graph',
    //         layout: 'force',
    //         force: {
    //             repulsion: 60,
    //             gravity: 0.1,
    //             edgeLength: 15,
    //             layoutAnimation: true,
    //         },
    //         data: result_json_list[i].series[0].data,
    //         links: result_json_list[i].series[0].links,
    //         categories: [{"name": "疾病"}],
    //         roam: false,
    //         label: {
    //             normal: {
    //                 show: true,
    //                 position: 'inside',
    //                 formatter: '{b}',
    //                 fontSize: 16,
    //                 fontStyle: '600',
    //             }
    //         },
    //         lineStyle: {
    //             normal: {
    //                 opacity: 0.9,
    //                 width: 1.5,
    //                 curveness: 0
    //             }
    //         }
    //     }]
    // };
    var option = {
        title: {
            text: ''
        },
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        label: {
            normal: {
                show: true,
                textStyle: {
                    fontSize: 12
                },
            }
        },
        legend: {
            x: "center",
            show: false
        },
        series: [

            {
                type: 'graph',
                layout: 'force',
                symbolSize: 45,
                focusNodeAdjacency: true,
                roam: true,
                edgeSymbol: ['none', 'arrow'],
                categories: [{
                    name: '查询实体',
                    itemStyle: {
                        normal: {
                            color: "#009800",
                        }
                    }
                }, {
                    name: 'HudongItem',
                    itemStyle: {
                        normal: {
                            color: "#4592FF",
                        }
                    }
                }, {
                    name: 'NewNode',
                    itemStyle: {
                        normal: {
                            color: "#C71585",
                        }
                    }
                }],
                label: {
                    normal: {
                        show: true,
                        textStyle: {
                            fontSize: 12,
                        },
                    }
                },
                force: {
                    repulsion: 1000
                },
                edgeSymbolSize: [4, 50],
                edgeLabel: {
                    normal: {
                        show: true,
                        textStyle: {
                            fontSize: 10
                        },
                        formatter: "{c}"
                    }
                },
                data: result_json_list[i].data,
                links: result_json_list[i].links,
                lineStyle: {
                    normal: {
                        opacity: 0.9,
                        width: 1.3,
                        curveness: 0,
                        color: "#262626",
                    }
                }
            }
        ]
    };
    myChart.setOption(option);
}

/**
 * 处理列表数据，添加style和操作属性
 * @param column_list
 */
function polish_table_data(column_list) {
    var result = [];
    var tmp;
    for (var i = 0; i < column_list.length; i++) {
        tmp = column_list[i];
        tmp["cellStyle"] = formatTableUnit;
        tmp["width"] = "150px";
        //
        // TODO 列表宽度
        // delete tmp.width;
        tmp["formatter"] = paramsMatter;
        result.push(tmp);
    }
    return result;

}

/**
 * 隐藏所有模板div
 */
function hidden_all_div() {
    hidden_div("basic_div");
    // hidden_div("fresh-table_div");
    // hidden_div("main_div");
    // hidden_div("main1_div");
    // hidden_div("main2_div");
    // hidden_div("question_rewrite_div");
    // hidden_div("correlation_symptoms_div");
    // hidden_div("list_div");
}


/**
 * 从表格调用二级接口
 * @param result_json_list_1:一级接口返回数据
 * @param i
 * @param data_json
 * @param question
 */
function table_2_interface(result_json_list_1, i, data_json, question) {
    var current_props = "[]";
    if (result_json_list_1[i].chart_tag === "Table") {
        var column_fields = result_json_list_1[i].column_fields;
        current_props = JSON.stringify(column_fields)
    }
    var further_tags = data_json.furtherTags;

    var options = {
        url: getFullUrl('medical/ask/answersRelatedInfo.do'),
        dataType: 'JSON',
        data: {
            "query": question,
            "further_tags": further_tags,
            "current_props": current_props
        },
        success: function (ret) {
            if (ret.result === 1) {
                var result_str = ret.data.integrationResults;
                if (result_str === undefined) {
                    return
                }
                var result_json_list = JSON.parse(result_str);
                if (result_json_list === undefined) {
                    return
                }
                for (var j = 0; j < result_json_list.length; j++) {
                    if (result_json_list[j].chart_tag === "Pie") {
                        copy_div("main1", "_" + i + "_" + j, "basic_div_show", "", "");
                        fill_pie(result_json_list, j, "main1" + "_" + i + "_" + j);
                    }
                    if (result_json_list[j].chart_tag === "Histogram") {
                        copy_div("main", "_" + i + "_" + j, "basic_div_show", "", "");
                        fill_histogram(result_json_list, j, "main" + "_" + i + "_" + j);
                    }
                    if (result_json_list[j].chart_tag === "Table") {
                        // 表格
                        copy_div("fresh-table", "_" + i + "_" + j, "basic_div_show", "table_title", "toolbar");
                        fill_table(result_json_list, j, "fresh-table" + "_" + i + "_" + j, "toolbar" + "_" + i + "_" + j, 'table_title' + "_" + i + "_" + j);
                    }
                    if (result_json_list[j].chart_tag === "ListContainer") {
                        //list_div
                        copy_div("list", "_" + i + "_" + j, "basic_div_show", "list_title", "");
                        document.getElementById('list_title' + "_" + i + "_" + j).innerHTML = question;
                        fill_list_div(result_json_list[j].contents, "list" + "_" + i + "_" + j);
                    }
                    if (result_json_list[j].chart_tag === "StringContainer") {
                        //StringContainer_div
                        copy_div("string_container", "_" + i + "_" + j, "basic_div_show", "string_container_title", "");
                        document.getElementById('string_container_title' + "_" + i + "_" + j).innerHTML = question;
                        fill_string_container_div(result_json_list[j].content, "string_container" + "_" + i + "_" + j);
                    }
                    if (result_json_list[j].chart_tag === "KnowledgeGraph") {
                        //知识图谱
                        copy_div("main2", "_" + i + "_" + j, "basic_div_show", "", "");
                        fill_graph(result_json_list, j, "main2" + "_" + i + "_" + j);
                    }

                }


            } else {
                alert(ret.message);
            }
        }
    };
    $.ajax(options);
}

/**
 * 克隆div
 * @param old_div_id 是被复制元素的子元素的id，父元素id+“_div” 这里克隆父元素div
 * @param new_id_add 新增元素子div id修改部分 一般用"_数字" 比如原来的子div是main 现在变成main_1
 * @param basic_div_id 复制好的元素追加到base上
 * @param title_id 一些复制div里面有title，id需要改一下
 * @param toolbar_id 一些复制div里面有toolbar，id需要改一下
 */
function copy_div(old_div_id, new_id_add, basic_div_id, title_id, toolbar_id) {
    var copy_div = $("#" + old_div_id + "_div").clone(true);
    copy_div.attr("id", old_div_id + new_id_add + "_div");
    var son_div = copy_div.find("#" + old_div_id); //根据id查找子元素
    son_div.attr("id", old_div_id + new_id_add); //改变克隆子元素节点一
    if (title_id !== "") {
        var title_div = copy_div.find("#" + title_id); //根据id查找子元素
        title_div.attr("id", title_id + new_id_add); //改变克隆子元素节点一
    }
    if (toolbar_id !== "") {
        var toolbar_div = copy_div.find("#" + toolbar_id); //根据id查找子元素
        toolbar_div.attr("id", toolbar_id + new_id_add); //改变克隆子元素节点一
    }
    $('#' + basic_div_id).append(copy_div);
    hidden_div(old_div_id + new_id_add + "_div")//隐藏起来

    // $("#addDiv").before(copy_div);
}

function answer_question(question) {
    var uuid = localStorage.getItem("user_uuid");
    $('#basic_div_show').html("");

    var options = {
        url: getFullUrl("medical/ask/answerQuestion.do?"),
        dataType: 'JSON',
        data: {
            "query": question
        },
        success: function (ret) {
            if (ret.result === 1) {
                var result_str = ret.data.integrationResults;
                if (result_str === undefined) {
                    return
                }
                var result_json_list = JSON.parse(result_str);
                if (result_json_list === undefined) {
                    return
                }
                for (var i = 0; i < result_json_list.length; i++) {
                    if (result_json_list[i].chart_tag === "Pie") {
                        copy_div("main1", "_yi_" + i, "basic_div_show", "", "");
                        fill_pie(result_json_list, i, "main1_yi_" + i);

                    }
                    if (result_json_list[i].chart_tag === "Histogram") {
                        copy_div("main", "_yi_" + i, "basic_div_show", "", "");
                        fill_histogram(result_json_list, i, "main_yi_" + i);

                    }
                    if (result_json_list[i].chart_tag === "Table") {
                        // 表格
                        copy_div("fresh-table", "_yi_" + i, "basic_div_show", "table_title", "toolbar");
                        fill_table(result_json_list, i, "fresh-table_yi_" + i, "toolbar_yi_" + i, "table_title" + "_yi_" + i);
                    }
                    if (result_json_list[i].chart_tag === "ListContainer") {
                        //list_div
                        copy_div("list", "_yi_" + i, "basic_div_show", "list_title", "");
                        document.getElementById('list_title_yi_' + i).innerHTML = question;
                        fill_list_div(result_json_list[i].contents, "list_yi_" + i);
                    }
                    if (result_json_list[i].chart_tag === "StringContainer") {
                        //StringContainer_div
                        copy_div("string_container", "_yi_" + i, "basic_div_show", "string_container_title", "");
                        document.getElementById('string_container_title_yi_' + i).innerHTML = question;
                        fill_string_container_div(result_json_list[i].content, "string_container_yi_" + i);
                    }
                    if (result_json_list[i].chart_tag === "KnowledgeGraph") {
                        //知识图谱
                        copy_div("main2", "_yi_" + i, "basic_div_show", "", "");
                        fill_graph(result_json_list, i, "main2_yi_" + i);
                    }
                    //调用二级接口
                    table_2_interface(result_json_list, i, ret.data, question);
                }


            } else {
                alert(ret.message);
            }
        },
        error: function (ret) {
            alert("error");
            alert(JSON.stringify(ret))
        }
    };
    $.ajax(options);
}