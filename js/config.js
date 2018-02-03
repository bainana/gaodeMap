var markers = [];
var maplist = [
    {'name': '奥林匹克公园', 'position': [116.393071,40.000775], address:'北京市朝阳区北辰路'},
    {'name': '中国国家图书馆', 'position': [116.325209,39.943134], address: '北京市海淀区中关村南大街33号'},
    {'name': '中国人民大学', 'position': [116.313232,39.97061], address: '北京市海淀区中关村大街59号'},
    {'name': '朝阳公园', 'position': [116.478071,39.933824], address: '北京市朝阳区农展南路1号'},
    {'name': '动物园', 'position': [116.337023,39.941983], address: '北京市海淀区西三环中路11号'},
    {'name': '清华大学', 'position': [116.325935,40.003545], address: '北京市海淀区双清路30号'}
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

    getPositions(maplist);
});

function getPositions(maplist){
    maplist.forEach(function(data){
        marker = new AMap.Marker({
            map: map,
            position: data.position
        });
        //设置信息窗体内容
        marker.title = data.name;
        marker.content = '<div class="info-title">' + data.name + '</div><div class="info-content">'+ '地址：' + data.address;
        //点击marker显示信息窗体
        marker.on('click', function(e){
            e.target.setAnimation('AMAP_ANIMATION_DROP');
            infoWindow.setContent(e.target.content);
            infoWindow.open(map, e.target.getPosition());
        });
        markers.push(marker);
    });
}
// 将 viewModel 移到外面来
var viewModel = function() {
    var self = this;
    self.lists = ko.observableArray(maplist);// 用 maplist 来初始化
    self.keyword = ko.observable();
    self.search = function() {
        keywords = self.keyword();
        console.log(keywords)
        if (keywords !== '' && keywords !== undefined) {
          // 借用数组的方法 filter 来过滤返回需要的结果
            var filteredMarkers = self.lists().filter(function(marker) {
                return marker.name.indexOf(keywords) > -1;
            });
            map.remove(markers);//先移除markers
            self.lists(filteredMarkers); // 设置为过滤后的数组
            getPositions(filteredMarkers);//渲染标记
        } else {
          self.lists(markers); // 当没有输入时，恢复为初始的所有列表项
        }
    }
    self.showdedetail = function(data,e){
        markers.forEach(function(marker,index){
            if (marker.title === data.name){
                marker = new AMap.Marker({
                    map: map,
                    position: [data.position[0],data.position[1]]
                });
                //设置信息窗体内容
                marker.title = data.name;
                marker.content = '<div class="info-title">' + data.name + '</div><div class="info-content">'+
                '地址：' + data.address;
                //点击marker显示信息窗体
                marker.setAnimation('AMAP_ANIMATION_DROP');
                infoWindow.setContent(marker.content);
                infoWindow.open(map, marker.getPosition());
                setTimeout(function(){
                    infoWindow.close();//3秒后自动关闭信息窗体
                },3000);
            } else {
              marker = new AMap.Marker({
                map: map,
                position: [data.position[0],data.position[1]],
              });
            }
        });
    }
}
setTimeout(function(){
    ko.applyBindings(new viewModel());//请求需要时间，延迟渲染
},800);

$('#menu-btn').on('click', function(){
    $('#sidebar').toggle('slow');
})
