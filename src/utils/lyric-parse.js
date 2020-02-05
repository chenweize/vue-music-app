// 歌词解析
export function parseLyric (data) {
    var $this=this;
    //清空上一首歌曲信息
    this.timer=[];
    this.words=[];
    //console.log(data);
    var array=data.split("\n");
    //console.log(array);
    var timeRegExp=/\[(\d+:\d+\.\d+)\]/;
    //遍历歌词
    $.each(array,function (index,ele) {
        //console.log(ele);
        //处理歌词
        var wordsStr=ele.split("]")[1];//截取切割完成后的歌词
        //console.log(wordsStr);
        if (wordsStr.length==1) return true;//处理掉没有歌词的部分
        $this.words.push(wordsStr);

        //处理时间
        var res=timeRegExp.exec(ele);//exec() 方法用于检索字符串中的正则表达式的匹配
        //console.log(res);
        if(res==null) return true;
        var resTime=res[1];//取出真正的时间  如：00:23.52
        var res2=resTime.split(":");
        var minites=parseInt(res2[0])*60;
        var seconds=parseFloat(res2[1]);
        var time=parseFloat(Number(minites+seconds).toFixed(2));//Number()把函数对象转换为数字,toFixed(n)保留n位小数，因为toFixed(n)的使用,把time再次变为字符串，故用parseFloat再转化
        //console.log(time);
        $this.timer.push(time);    //push() 方法可向数组的末尾添加一个或多个元素,并返回新的长度;即将时间存储下来

    });
    //console.log($this.timer);
    //console.log($this.words);
}