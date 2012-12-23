define('viewpost',
       ['jquery'],
       function($){
            var addLike = function(){
                alert('working');
            },
            registerHandlers = function(){
                $('.like').click(function(e){
                    var likeDiv = e.target,
                        permalink = $(likeDiv).attr('data-plink'),
                        token = $(likeDiv).attr('data-token'),
                        like = { token : token };
                        
                    $.ajax({
                        type: 'POST',
                        url: '/post/'+permalink+'/addlike',
                        data : like                        
                    }).done(function(data){
                        
                    });
                });
            };
            
            return {
                addLike : addLike,
                registerHandlers : registerHandlers
            }
       });