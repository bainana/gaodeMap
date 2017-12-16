var map = new AMap.Map("container", {
    resizeEnable: true,
    zoom: 13,
    center: [116.325252,39.943035]
});
var markers = [];
var maplist = [];
var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
AMap.service('AMap.PlaceSearch',function(){//回调函数
    //实例化PlaceSearch
    placeSearch= new AMap.PlaceSearch({
        city: '010'
    });
    // 使用placeSearch对象调用关键字搜索的功能

    getPositions('大学');
});

function getPositions(address){
    placeSearch.searchNearBy(address,[116.325252,39.943035], 2000,function(status,result){
        if(status == 'complete' && result.info == 'OK'){
            var poiList = result.poiList.pois;
            maplist = [];
            poiList.forEach(function(data){
                marker = new AMap.Marker({
                    map: map,
                    position: [data.location.lng,data.location.lat]
                });
                //设置信息窗体内容
                marker.title = data.name;
                marker.content = '<div class="info-title">' + data.name + '</div><div class="info-content">'+
                '电话：' + data.tel + '<br/>'+ '地址：' + data.address;
                //点击marker显示信息窗体
                marker.on('click', function(e){
                    e.target.setAnimation('AMAP_ANIMATION_DROP');
                    infoWindow.setContent(e.target.content);
                    infoWindow.open(map, e.target.getPosition());
                });
                markers.push(marker);
                maplist.push(data);
            });
        }
    });
}
// 将 viewModel 移到外面来
var viewModel = function() {
    var self = this;
    self.lists = ko.observableArray(maplist);// 用 maplist 来初始化
    self.keyword = ko.observable();
    self.search = function() {
        keywords = self.keyword();
        if (keywords !== '' && keywords !== undefined) {
            map.remove(markers);//先移除markers
            getPositions(keywords);//根据关键字去请求
            setTimeout(function(){
                self.lists(maplist);//请求需要时间，延迟渲染
            },800)
        }
    }
    self.showdedetail = function(data,e){
        markers.filter(function(marker) {
            if (marker.title === data.name){
                marker = new AMap.Marker({
                    map: map,
                    position: [data.location.lng,data.location.lat]
                });
                //设置信息窗体内容
                marker.title = data.name;
                marker.content = '<div class="info-title">' + data.name + '</div><div class="info-content">'+
                '电话：' + data.tel + '<br/>'+ '地址：' + data.address;
                //点击marker显示信息窗体
                marker.setAnimation('AMAP_ANIMATION_DROP');
                infoWindow.setContent(marker.content);
                infoWindow.open(map, marker.getPosition());
            }
        });
    }
};
setTimeout(function(){
    ko.applyBindings(new viewModel());//请求需要时间，延迟渲染
},800);

$('#menu-btn').on('click', function(){
    $('#sidebar').toggle('slow');
})
