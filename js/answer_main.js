/**
 @Name：tzhx
 @Author： qa返回结果展示，以及一些其他功能，如搜索引擎等
 @version
 */

$(function () {
    var username = localStorage.getItem("username");
    var uuid = localStorage.getItem("user_uuid");
    init_page();
    bind_event();

    /**
     * 绑定按钮
     */
    function bind_event() {
        $("#search_answer_btn").on('click', function () {
            hidden_all_div();
            var question = $('#search_input').val();
            if (question === "") {
                return
            }
            localStorage.setItem("question_index", $("#search_input").val());
            //回答问题
            answer_question(question);
            fill_question_related(question, uuid, 10, "recommend_questions",question_recommend);
            fill_question_related(question, uuid, 10, "history_questions",question_history);
            fill_question_rewrite(question, "tag", "question_rewrite");
            fill_question_correlation_symptoms(question, uuid, 10, "correlation_symptoms");
            fill_search_engine(question, 1, 10);
        });
        $("#s_btn").on('click', function () {
            backDiv("more_related_content_ach");
        });
        $("#qa_btn").on('click', function () {
            backDiv("answer_acho");
        });
        //TODO 修改title


    }

    /**
     * 从主页面跳转过来，需要初始化加载回答结果
     */
    function init_page() {
        hidden_all_div();
        $('#basic_div_show').html("");

        var question = localStorage.getItem("question_index");
        var input = $('#search_input');
        input.val(question);
        if (question === "") {
            return
        }
        answer_question(question);

        fill_question_related(question, uuid, 10, "recommend_questions",question_recommend);
        fill_question_related(question, uuid, 10, "history_questions",question_history);
        fill_question_rewrite(question, "tag", "question_rewrite");
        fill_question_correlation_symptoms(question, uuid, 10, "correlation_symptoms");
        fill_search_engine(question, 1, 10);
    }

    /**
     * 翻页插件
     * @type {{pageSize: number, callback: callback, listTotal: number, list: string, currentPage: number}}
     */
    var options = {
        list: ".list",//列表标识
        currentPage: 1,//初始页（选传，默认1）
        pageSize: 10,//每页列表数
        listTotal: 10000,//列表总数（选传），不传为list总数
        callback: function (currentPage) {//翻页回调（可填，可做ajax请求）,不传为纯html切换
            // TODO 加判断，根据不同的tab定制下一页
            var question = localStorage.getItem("question_index");
            fill_search_engine(question,currentPage,10);
        }
    };
    $("#community_qa_view").paging(options);

});

/**
 * 处理过长显示数据
 * @param string
 */
function process_data(string) {
    // var string_no = string.replace(/^\s+|\s+$/g,"");
    string = string.replace(/[<em>]/g, "");
    string = string.replace(/[</em>]/g, "");
    if (string.length >= 300) {
        return string.substring(0, 100) + ".....<b>点击标题查看详情</b>"
    } else {
        return string;
    }
}


/**
 * 搜索引擎返回结果bind event
 */
function bindEvent() {

}
function fill_search_engine(question, page_no, page_size) {
    var options = {
        url: getFullUrl('medical/search/search.do?'),
        dataType: 'JSON',
        data: {
            "query": question,
            "page_no": page_no,
            "page_size": page_size
        },
        type: 'GET',
        success: function (result) {
            if (result.result === 1 && !$.isEmptyObject(result.data)) {
                initTpl(JSON.stringify(result.data), $("#community_qa_template"), $("#community_qa_view"), bindEvent);
            } else {
                alert(result.message);
            }
        }
    };
    $.ajax(options);
}
