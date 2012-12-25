define('viewpost',
       ['jquery'],
       function($){
            var addLike = function(){
                alert('working');
            },
            registerHandlers = function(){
                $('.like').click(function(e){
                    var likeDiv = e.target,
                        likeInfo = $(likeDiv).parent().children('.like-info'),
                        permalink = $(likeDiv).attr('data-plink'),
                        token = $(likeDiv).attr('data-token'),
                        like = { token : token };
                        
                    $.ajax({
                        type: 'POST',
                        url: '/post/'+permalink+'/addlike',
                        data : like
                    }).done(function(data){
                        var likes = 0
                        if(data.success)
                            likes = data.likes;
                        $(likeInfo).text(data.likes);
                    });
                });
            };
            
            return {
                addLike : addLike,
                registerHandlers : registerHandlers
            }
       });