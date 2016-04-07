var http=require('http');
var cheerio=require('cheerio');
var url='http://www.imooc.com/learn/348';
function filterChapters(html){
	var $=cheerio.load(html);
	var chapters=$('.chapter');

	// [{
	// 	chapterTitle:'',
	// 	videos:[
	// 		title:'',
	// 		id:''
	// 	]
	// }]
	// 
	var courserData=[];
	chapters.each(function(item){
			var chapter=$(this);
			var chapterTitle=chapter.find('strong').text();
			var vidioess=chapter.find('.video').children('li');
			var chapterData={
				chapterTitle:chapterTitle,
				vidioes:[]
			}

			vidioess.each(function(index,item){
				var vidioe=$(item).find('.studyvideo');
				var vidioeTitle=vidioe.text();
				var id=vidioe.attr('href').split('video/')[1];
				chapterData.vidioes.push({
					title:vidioeTitle,
					id:id
				})

			})
			courserData.push(chapterData);
	})
	return courserData;
}

function printCourseInfo(courserData){
	courserData.forEach(function(item){
		var chapterTitle=item.chapterTitle;
		console.log(chapterTitle+'\n')
		item.vidioes.forEach(function(video){
			console.log('【'+video.id+'】'+video.title+'\n');
		})
	})
}

http.get(url,function(res){
	var html='';
	res.on('data',function(data){
		html+=data;
	});
	res.on('end',function(){
		var courserData=filterChapters(html);
		printCourseInfo(courserData);
	});
}).on('error',function(){
	console.log("获取数据出错！")
})
