var markers = [];
var maplist = [
    {'title': '奥林匹克公园', 'position': [116.393071,40.000775], address:'北京市朝阳区北辰路'},
    {'title': '中国国家图书馆', 'position': [116.325209,39.943134], address: '北京市海淀区中关村南大街33号'},
    {'title': '中国人民大学', 'position': [116.313232,39.97061], address: '北京市海淀区中关村大街59号'},
    {'title': '朝阳公园', 'position': [116.478071,39.933824], address: '北京市朝阳区农展南路1号'},
    {'title': '动物园', 'position': [116.337023,39.941983], address: '北京市海淀区西三环中路11号'},
    {'title': '清华大学', 'position': [116.325935,40.003545], address: '北京市海淀区双清路30号'}
];
var map = new AMap.Map("container", {
    resizeEnable: true,
    zoom: 12,
    center: [116.407639,39.968896]
});
var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
AMap.service('AMap.PlaceSearch',function(){//回调函数
    //实例化PlaceSearch
    placeSearch= new AMap.PlaceSearch({
        city: '010'
    });
    // 使用placeSearch对象调用关键字搜索的功能

    getPositions();
});

function getPositions(){
    maplist.forEach(function(data){
        marker = new AMap.Marker({
            map: map,
            position: data.position
        });
        //设置信息窗体内容
        marker.title = data.name;
        marker.content = '<div class="info-title">' + data.title + '</div><div class="info-content">'+ '地址：' + data.address;
        //点击marker显示信息窗体
        marker.on('click', function(e){
            e.target.setAnimation('AMAP_ANIMATION_DROP');
            infoWindow.setContent(e.target.content);
            infoWindow.open(map, e.target.getPosition());
        });
        setTimeout(function(){
            infoWindow.close();//3秒后自动关闭信息窗体
        },3000);
        markers.push(marker);
    });
}

//创建列表中的marker对象
var Marker = function(marker, id){
  this.title = ko.observable(marker.title);
  this.position = ko.observable(marker.position);
  this.id = ko.observable(id);
};
var ViewModel = function(){
    var _this = this;
    //marker列表数组
    this.lists = ko.observableArray([]);
    maplist.forEach(function(marker, id){
        _this.lists.push(new Marker(marker, id));
    });
    this.showmenu = ko.observable(true);//默认显示左侧列表
    this.buttonclick = function(){
        _this.showmenu(!_this.showmenu());
    };
    //输入框的值
    this.keyword = ko.observable("");

    //过滤左侧列表
    this.filter = function(id, title, value){
        //判断列表名字中是否包含输入的值
        this.result = title().indexOf(value());
        if(this.result == -1){
            markers[id()].setMap(null);
            return false;
        }else {
            markers[id()].setMap(map);
            return true;
        }
    };
    this.showdetail = function(id){
        infoWindow.close();
        markers[id()].setAnimation('AMAP_ANIMATION_DROP');
        infoWindow.setContent(markers[id()].content);
        infoWindow.open(map, markers[id()].getPosition());

    }

    $.ajax({
        url: 'http://www.sojson.com/open/api/weather/json.shtml?city=北京',
        success: function(data){
            console.log(data);
            var str = '当前城市：' + data.city+ '，今天是：' + data.date + '，湿度：' + data.data.shidu + '，空气质量：' + data.data.quality + '，温度' + data.data.wendu;
            $("#city").html(str);
        },
        error: function(error){
            console.log(error)
        }
    })

};

//初始化调用ViewModel()函数
ko.applyBindings(new ViewModel());
