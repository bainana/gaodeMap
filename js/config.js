var map = new AMap.Map("container", {
    resizeEnable: true,
    zoom: 13,
    center: [116.325252,39.943035]
});

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
        var markers = [];
        if(status == 'complete' && result.info == 'OK'){
            var poiList = result.poiList.pois;
            poiList.forEach(function(data){
                marker = new AMap.Marker({
                    title: data.name,
                    icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png'
                });
                marker.setPosition(new AMap.LngLat(data.location.lng,data.location.lat));
                marker.setMap(map);
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
                markers.push(data);
            })
            Init(markers);
        }
    });
}

function Init(data) {
    var viewModel = function(){
        var self = this;
        self.lists = ko.observableArray(data);
        self.keyword = ko.observable();
        self.search = function(){
            var keywords = self.keyword();
            if(keywords !== '' && keywords !== undefined){
                console.log(keywords)
                getPositions(keywords);
            }

        }
    };

    ko.applyBindings(new viewModel());
}
